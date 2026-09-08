import os
import re
import sys
import pickle
import warnings
from pathlib import Path

import numpy as np
import torch
from fastapi import FastAPI, APIRouter, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from huggingface_hub import snapshot_download
from dotenv import load_dotenv

sys.path.insert(0, str(Path(__file__).resolve().parent / "src"))
from translation import translate_to_english

load_dotenv()

warnings.filterwarnings("ignore")


# ═══════════════════════════════════════════════════════════════════
#  PATHS
# ═══════════════════════════════════════════════════════════════════

BASE_DIR = Path(__file__).resolve().parent

ML_DIR = BASE_DIR / "models" / "ML"
DL_DIR = BASE_DIR / "models" / "DL"


# ═══════════════════════════════════════════════════════════════════
#  LOAD ML MODELS
#  These are small enough to remain in GitHub.
# ═══════════════════════════════════════════════════════════════════

with open(ML_DIR / "urgency_classifier.pkl", "rb") as f:
    urg_data = pickle.load(f)

urg_model = urg_data["model"]
urg_labels = urg_data["label_names"]


with open(ML_DIR / "disaster_binary_classifier.pkl", "rb") as f:
    bin_data = pickle.load(f)

bin_model = bin_data["model"]
bin_threshold = bin_data["threshold"]


with open(ML_DIR / "essential_categories_classifier.pkl", "rb") as f:
    ess_data = pickle.load(f)

ess_tfidf = ess_data["tfidf"]
ess_clfs = ess_data["classifiers"]
ess_thresholds = ess_data["thresholds"]
ess_categories = ess_data["categories"]


# ═══════════════════════════════════════════════════════════════════
#  DEEP LEARNING MODEL CONFIGURATION
# ═══════════════════════════════════════════════════════════════════

DL_DEVICE = torch.device(
    "cuda"
    if torch.cuda.is_available()
    else "mps"
    if torch.backends.mps.is_available()
    else "cpu"
)

DL_MAX_LEN = 128
DL_THRESHOLD = 0.5

DL_URGENCY_LABELS = {
    0: "low",
    1: "medium",
    2: "high",
    3: "critical",
}


# ── Hugging Face configuration ──────────────────────────────────
#
# You can override these with environment variables:
#
# HF_REPO_ID=your_username/disaster-data-mining-models
# MODEL_SOURCE=auto
#
# MODEL_SOURCE options:
#
#   auto       → use local models if available, otherwise Hugging Face
#   local      → ONLY use local models
#   huggingface → ONLY use Hugging Face
#

HF_REPO_ID = os.getenv(
    "HF_REPO_ID",
    "waiyanwoody/disaster-data-mining-models"
)

MODEL_SOURCE = os.getenv("MODEL_SOURCE", "auto").lower()


# ═══════════════════════════════════════════════════════════════════
#  DL MODEL LOADING
# ═══════════════════════════════════════════════════════════════════

def get_dl_model_root() -> Path:
    """
    Decide where the Deep Learning models should be loaded from.

    Priority in AUTO mode:

        1. Local models
        2. Hugging Face

    Returns:
        Path containing:
            transformer_urgency/
            transformer_binary/
            transformer_essential/
    """

    local_urgency = DL_DIR / "transformer_urgency"
    local_binary = DL_DIR / "transformer_binary"
    local_essential = DL_DIR / "transformer_essential"

    local_models_exist = (
        local_urgency.exists()
        and local_binary.exists()
        and local_essential.exists()
    )

    # ──────────────────────────────────────────────────────────────
    # FORCE LOCAL
    # ──────────────────────────────────────────────────────────────

    if MODEL_SOURCE == "local":

        if not local_models_exist:
            raise FileNotFoundError(
                "MODEL_SOURCE=local, but one or more local "
                "Deep Learning model directories are missing."
            )

        print("Loading Deep Learning models from LOCAL storage.")

        return DL_DIR

    # ──────────────────────────────────────────────────────────────
    # FORCE HUGGING FACE
    # ──────────────────────────────────────────────────────────────

    if MODEL_SOURCE == "huggingface":

        print(
            f"Downloading Deep Learning models from "
            f"Hugging Face: {HF_REPO_ID}"
        )

        hf_dir = snapshot_download(
            repo_id=HF_REPO_ID
        )

        return Path(hf_dir)

    # ──────────────────────────────────────────────────────────────
    # AUTO
    # ──────────────────────────────────────────────────────────────

    if MODEL_SOURCE == "auto":

        if local_models_exist:

            print(
                "Local Deep Learning models found. "
                "Loading from local storage."
            )

            return DL_DIR

        print(
            "Local Deep Learning models not found."
        )

        print(
            f"Downloading models from Hugging Face: "
            f"{HF_REPO_ID}"
        )

        hf_dir = snapshot_download(
            repo_id=HF_REPO_ID
        )

        return Path(hf_dir)

    # ──────────────────────────────────────────────────────────────
    # INVALID CONFIGURATION
    # ──────────────────────────────────────────────────────────────

    raise ValueError(
        f"Invalid MODEL_SOURCE='{MODEL_SOURCE}'. "
        f"Use 'auto', 'local', or 'huggingface'."
    )


# ── Find DL model root ───────────────────────────────────────────

DL_MODEL_ROOT = get_dl_model_root()

DL_URGENCY_DIR = DL_MODEL_ROOT / "transformer_urgency"
DL_BINARY_DIR = DL_MODEL_ROOT / "transformer_binary"
DL_ESSENTIAL_DIR = DL_MODEL_ROOT / "transformer_essential"


# ═══════════════════════════════════════════════════════════════════
#  LOAD DL ESSENTIAL METADATA
# ═══════════════════════════════════════════════════════════════════
#
# This file is small, so it can remain in GitHub.
#
# If running from Hugging Face and the local metadata is missing,
# you can alternatively place this file in the Hugging Face repo.
# For now, the application expects it locally.
# ═══════════════════════════════════════════════════════════════════

DL_ESSENTIAL_META_PATH = DL_DIR / "transformer_essential_meta.pkl"

with open(DL_ESSENTIAL_META_PATH, "rb") as f:
    dl_ess_meta = pickle.load(f)

DL_ESSENTIAL_CATEGORIES = dl_ess_meta["categories"]


# ═══════════════════════════════════════════════════════════════════
#  LOAD TRANSFORMER MODELS
# ═══════════════════════════════════════════════════════════════════

print("Loading Transformer models...")

# ── Urgency ──────────────────────────────────────────────────────

dl_tok_u = AutoTokenizer.from_pretrained(
    DL_URGENCY_DIR
)

dl_model_u = AutoModelForSequenceClassification.from_pretrained(
    DL_URGENCY_DIR
).to(DL_DEVICE)


# ── Binary ────────────────────────────────────────────────────────

dl_tok_b = AutoTokenizer.from_pretrained(
    DL_BINARY_DIR
)

dl_model_b = AutoModelForSequenceClassification.from_pretrained(
    DL_BINARY_DIR
).to(DL_DEVICE)


# ── Essential categories ─────────────────────────────────────────

dl_tok_e = AutoTokenizer.from_pretrained(
    DL_ESSENTIAL_DIR
)

dl_model_e = AutoModelForSequenceClassification.from_pretrained(
    DL_ESSENTIAL_DIR
).to(DL_DEVICE)


# ── Evaluation mode ──────────────────────────────────────────────

dl_model_u.eval()
dl_model_b.eval()
dl_model_e.eval()


print(
    f"Deep Learning models loaded successfully."
)

print(
    f"Model source: {MODEL_SOURCE}"
)

print(
    f"Model root: {DL_MODEL_ROOT}"
)

print(
    f"Device: {DL_DEVICE}"
)


# ═══════════════════════════════════════════════════════════════════
#  PREPROCESSING
# ═══════════════════════════════════════════════════════════════════

def clean_text(text: str) -> str:
    text = str(text).lower()
    text = re.sub(r"http\S+|www\S+", " ", text)
    text = re.sub(r"[^a-z0-9\s']", " ", text)
    return re.sub(r"\s+", " ", text).strip()


# ═══════════════════════════════════════════════════════════════════
#  DL PREDICTION HELPERS
# ═══════════════════════════════════════════════════════════════════

def dl_predict_clf(texts: list, model, tok) -> tuple:

    model.eval()

    enc = tok(
        texts,
        max_length=DL_MAX_LEN,
        padding=True,
        truncation=True,
        return_tensors="pt",
    )

    with torch.no_grad():

        out = model(
            **{
                k: v.to(DL_DEVICE)
                for k, v in enc.items()
            }
        )

    probs = (
        torch.softmax(
            out.logits,
            dim=1
        )
        .cpu()
        .numpy()
    )

    preds = (
        torch.argmax(
            out.logits,
            dim=1
        )
        .cpu()
        .numpy()
    )

    return preds, probs


def dl_predict_ml(
    texts: list,
    model,
    tok,
    thr: float = DL_THRESHOLD
) -> tuple:

    model.eval()

    enc = tok(
        texts,
        max_length=DL_MAX_LEN,
        padding=True,
        truncation=True,
        return_tensors="pt",
    )

    with torch.no_grad():

        out = model(
            **{
                k: v.to(DL_DEVICE)
                for k, v in enc.items()
            }
        )

    probs = (
        torch.sigmoid(
            out.logits
        )
        .cpu()
        .numpy()
    )

    preds = (
        probs >= thr
    ).astype(int)

    return preds, probs


# ═══════════════════════════════════════════════════════════════════
#  SHARED SCHEMA
# ═══════════════════════════════════════════════════════════════════

class MessageRequest(BaseModel):

    message: str
    genre: str = "direct"

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "message": (
                        "We are dying of hunger - 500 people "
                        "in Delmas 19 need immediate help"
                    ),
                    "genre": "direct",
                }
            ]
        }
    }


# ═══════════════════════════════════════════════════════════════════
#  ML ROUTER
#  TF-IDF + Classical Machine Learning
# ═══════════════════════════════════════════════════════════════════

ml_router = APIRouter(
    prefix="/ml",
    tags=["Machine Learning (TF-IDF)"],
)


@ml_router.get("/")
def ml_info():

    return {
        "model": "TF-IDF + Classical ML",

        "endpoints": {
            "/ml/predict/urgency":
                "predict urgency level "
                "(low/medium/high/critical)",

            "/ml/predict/binary":
                "predict disaster (yes/no)",

            "/ml/predict/essential":
                "predict essential categories "
                "(multi-label, 13 labels)",

            "/ml/predict/all":
                "all 3 predictions in one call",
        },
    }


# ═══════════════════════════════════════════════════════════════════
#  ML URGENCY
# ═══════════════════════════════════════════════════════════════════

@ml_router.post(
    "/predict/urgency",
    summary="Urgency Level",
    description=(
        "Classify message urgency into 4 levels: "
        "low, medium, high, critical"
    ),
    responses={
        200: {
            "description": "Urgency prediction",
            "content": {
                "application/json": {
                    "example": {
                        "label": "critical",
                        "confidence": 0.9995,
                        "probabilities": {
                            "low": 0.0,
                            "medium": 0.0,
                            "high": 0.0005,
                            "critical": 0.9995,
                        },
                    }
                }
            },
        }
    },
)
def predict_urgency(
    req: MessageRequest = Body(
        example={
            "message": (
                "We are dying of hunger - 500 people "
                "in Delmas 19 need immediate help"
            ),
            "genre": "direct",
        }
    )
):

    message, was_translated = translate_to_english(req.message)

    text = clean_text(message)

    pred = urg_model.predict([text])[0]

    proba = urg_model.predict_proba([text])[0]

    label = urg_labels[int(pred)]

    confidence = float(proba.max())

    probs = {
        urg_labels[i]: round(float(p), 4)
        for i, p in enumerate(proba)
    }

    result = {
        "label": label,
        "confidence": round(confidence, 4),
        "probabilities": probs,
    }

    if was_translated:
        result["translated_message"] = message

    return result


# ═══════════════════════════════════════════════════════════════════
#  ML BINARY
# ═══════════════════════════════════════════════════════════════════

@ml_router.post(
    "/predict/binary",
    summary="Disaster Binary",
    description=(
        "Classify if message is disaster-related "
        "(yes/no)"
    ),
    responses={
        200: {
            "description": "Binary disaster prediction",
            "content": {
                "application/json": {
                    "example": {
                        "is_disaster": True,
                        "confidence": 0.9976,
                        "threshold": 0.4093,
                    }
                }
            },
        }
    },
)
def predict_binary(
    req: MessageRequest = Body(
        example={
            "message": (
                "Weather update - a cold front from "
                "Cuba could pass over Haiti tomorrow"
            ),
            "genre": "news",
        }
    )
):

    message, was_translated = translate_to_english(req.message)

    text = clean_text(message)

    proba = bin_model.predict_proba([text])[0]

    disaster_prob = float(proba[1])

    is_disaster = (
        disaster_prob >= bin_threshold
    )

    result = {
        "is_disaster": bool(is_disaster),
        "confidence": round(disaster_prob, 4),
        "threshold": round(bin_threshold, 4),
    }

    if was_translated:
        result["translated_message"] = message

    return result


# ═══════════════════════════════════════════════════════════════════
#  ML ESSENTIAL CATEGORIES
# ═══════════════════════════════════════════════════════════════════

@ml_router.post(
    "/predict/essential",
    summary="Essential Categories",
    description=(
        "Multi-label classification for "
        "13 disaster categories"
    ),
    responses={
        200: {
            "description": "Essential categories prediction",
            "content": {
                "application/json": {
                    "example": {
                        "active_categories": [
                            "water",
                            "food",
                            "shelter",
                            "aid_related",
                        ],
                        "details": {
                            "water": {
                                "active": True,
                                "probability": 0.9732,
                                "threshold": 0.2434,
                            },
                            "food": {
                                "active": True,
                                "probability": 0.991,
                                "threshold": 0.3364,
                            },
                        },
                    }
                }
            },
        }
    },
)
def predict_essential(
    req: MessageRequest = Body(
        example={
            "message": (
                "We have no food or water in our shelter. "
                "Children are sick."
            ),
            "genre": "direct",
        }
    )
):

    message, was_translated = translate_to_english(req.message)

    text = clean_text(message)

    X = ess_tfidf.transform([text])

    results = {}

    for cat, clf, thr in zip(
        ess_categories,
        ess_clfs,
        ess_thresholds
    ):

        prob = float(
            clf.predict_proba(X)[0, 1]
        )

        results[cat] = {
            "active": prob >= thr,
            "probability": round(prob, 4),
            "threshold": round(thr, 4),
        }

    active = [
        cat
        for cat, value in results.items()
        if value["active"]
    ]

    response = {
        "active_categories": active,
        "details": results,
    }

    if was_translated:
        response["translated_message"] = message

    return response


# ═══════════════════════════════════════════════════════════════════
#  ML ALL
# ═══════════════════════════════════════════════════════════════════

@ml_router.post(
    "/predict/all",
    summary="All ML Predictions",
    description=(
        "Run all 3 ML models and return "
        "combined results"
    ),
    responses={
        200: {
            "description": "All ML predictions combined",
            "content": {
                "application/json": {
                    "example": {
                        "message": (
                            "We are dying of hunger - 500 people "
                            "in Delmas 19 need immediate help"
                        ),
                        "urgency": {
                            "label": "critical",
                            "confidence": 0.9995,
                        },
                        "disaster": {
                            "is_disaster": True,
                            "confidence": 0.9976,
                        },
                        "essential_categories": [
                            "medical_help",
                            "death",
                            "food",
                            "aid_related",
                        ],
                    }
                }
            },
        }
    },
)
def predict_all(
    req: MessageRequest = Body(
        example={
            "message": (
                "We are dying of hunger - 500 people "
                "in Delmas 19 need immediate help"
            ),
            "genre": "direct",
        }
    )
):

    message, was_translated = translate_to_english(req.message)

    text = clean_text(message)

    # Urgency
    u_pred = urg_model.predict([text])[0]

    u_proba = urg_model.predict_proba([text])[0]

    urgency = {
        "label": urg_labels[int(u_pred)],
        "confidence": round(
            float(u_proba.max()),
            4
        ),
        "probabilities": {
            urg_labels[i]: round(float(p), 4)
            for i, p in enumerate(u_proba)
        },
    }

    # Binary
    b_proba = bin_model.predict_proba([text])[0]

    binary = {
        "is_disaster": bool(
            float(b_proba[1]) >= bin_threshold
        ),
        "confidence": round(
            float(b_proba[1]),
            4
        ),
    }

    # Essential
    X = ess_tfidf.transform([text])

    essential_active = []

    for cat, clf, thr in zip(
        ess_categories,
        ess_clfs,
        ess_thresholds
    ):

        prob = float(
            clf.predict_proba(X)[0, 1]
        )

        if prob >= thr:
            essential_active.append(cat)

    response = {
        "message": req.message,
        "urgency": urgency,
        "disaster": binary,
        "essential_categories": essential_active,
    }

    if was_translated:
        response["translated_message"] = message

    return response


# ═══════════════════════════════════════════════════════════════════
#  DL ROUTER
#  DistilBERT Transformer
# ═══════════════════════════════════════════════════════════════════

dl_router = APIRouter(
    prefix="/dl",
    tags=["Deep Learning (Distilbert)"],
)


@dl_router.get("/")
def dl_info():

    return {
        "model": "DistilBERT Transformer",
        "device": str(DL_DEVICE),
        "model_source": MODEL_SOURCE,
        "model_repository": HF_REPO_ID,

        "endpoints": {
            "/dl/predict/urgency":
                "predict urgency level "
                "(low/medium/high/critical)",

            "/dl/predict/binary":
                "predict disaster (yes/no)",

            "/dl/predict/essential":
                "predict essential categories "
                "(multi-label, 10 labels)",

            "/dl/predict/all":
                "all 3 predictions in one call",
        },
    }


# ═══════════════════════════════════════════════════════════════════
#  DL URGENCY
# ═══════════════════════════════════════════════════════════════════

@dl_router.post(
    "/predict/urgency",
    summary="Urgency Level",
    description=(
        "Classify message urgency into 4 levels "
        "using DistilBERT"
    ),
    responses={
        200: {
            "description": "Urgency prediction (Distilbert)",
            "content": {
                "application/json": {
                    "example": {
                        "label": "critical",
                        "confidence": 0.9995,
                    }
                }
            },
        }
    },
)
def dl_predict_urgency(
    req: MessageRequest = Body(
        example={
            "message": (
                "We are dying of hunger - 500 people "
                "in Delmas 19 need immediate help"
            ),
            "genre": "direct",
        }
    )
):

    message, was_translated = translate_to_english(req.message)

    text = (
        f"{req.genre} "
        f"{clean_text(message)}"
    )

    pred, proba = dl_predict_clf(
        [text],
        dl_model_u,
        dl_tok_u
    )

    label = DL_URGENCY_LABELS[
        int(pred[0])
    ]

    confidence = float(
        proba[0].max()
    )

    probs = {
        DL_URGENCY_LABELS[i]:
            round(float(p), 4)
        for i, p in enumerate(proba[0])
    }

    result = {
        "label": label,
        "confidence": round(
            confidence,
            4
        ),
        "probabilities": probs,
    }

    if was_translated:
        result["translated_message"] = message

    return result


# ═══════════════════════════════════════════════════════════════════
#  DL BINARY
# ═══════════════════════════════════════════════════════════════════

@dl_router.post(
    "/predict/binary",
    summary="Disaster Binary",
    description=(
        "Classify if message is disaster-related "
        "using DistilBERT"
    ),
    responses={
        200: {
            "description": (
                "Binary disaster prediction (Distilbert)"
            ),
            "content": {
                "application/json": {
                    "example": {
                        "is_disaster": True,
                        "confidence": 0.98,
                    }
                }
            },
        }
    },
)
def dl_predict_binary(
    req: MessageRequest = Body(
        example={
            "message": (
                "Weather update - a cold front from "
                "Cuba could pass over Haiti tomorrow"
            ),
            "genre": "news",
        }
    )
):

    message, was_translated = translate_to_english(req.message)

    text = (
        f"{req.genre} "
        f"{clean_text(message)}"
    )

    pred, proba = dl_predict_clf(
        [text],
        dl_model_b,
        dl_tok_b
    )

    disaster_prob = float(
        proba[0][1]
    )

    is_disaster = bool(
        pred[0] == 1
    )

    result = {
        "is_disaster": is_disaster,
        "confidence": round(
            disaster_prob,
            4
        ),
        "probabilities": {
            "not_disaster":
                round(float(proba[0][0]), 4),

            "disaster":
                round(float(proba[0][1]), 4),
        },
    }

    if was_translated:
        result["translated_message"] = message

    return result


# ═══════════════════════════════════════════════════════════════════
#  DL ESSENTIAL CATEGORIES
# ═══════════════════════════════════════════════════════════════════

@dl_router.post(
    "/predict/essential",
    summary="Essential Categories",
    description=(
        "Multi-label classification for "
        "10 disaster categories using DistilBERT"
    ),
    responses={
        200: {
            "description": (
                "Essential categories prediction "
                "(Distilbert, 10 labels)"
            ),
            "content": {
                "application/json": {
                    "example": {
                        "active_categories": [
                            "water",
                            "food",
                            "shelter",
                            "aid_related",
                        ],
                        "probabilities": {
                            "water": 0.95,
                            "food": 0.92,
                            "shelter": 0.88,
                            "aid_related": 0.97,
                        },
                    }
                }
            },
        }
    },
)
def dl_predict_essential(
    req: MessageRequest = Body(
        example={
            "message": (
                "We have no food or water in our shelter. "
                "Children are sick."
            ),
            "genre": "direct",
        }
    )
):

    message, was_translated = translate_to_english(req.message)

    text = (
        f"{req.genre} "
        f"{clean_text(message)}"
    )

    preds, probs = dl_predict_ml(
        [text],
        dl_model_e,
        dl_tok_e
    )

    active = [
        DL_ESSENTIAL_CATEGORIES[i]
        for i, value in enumerate(preds[0])
        if value == 1
    ]

    prob_dict = {
        category:
            round(float(probs[0][i]), 4)
        for i, category in enumerate(
            DL_ESSENTIAL_CATEGORIES
        )
    }

    response = {
        "active_categories": active,
        "probabilities": prob_dict,
    }

    if was_translated:
        response["translated_message"] = message

    return response


# ═══════════════════════════════════════════════════════════════════
#  DL ALL
# ═══════════════════════════════════════════════════════════════════

@dl_router.post(
    "/predict/all",
    summary="All DL Predictions",
    description=(
        "Run all 3 DistilBERT models and "
        "return combined results"
    ),
    responses={
        200: {
            "description": (
                "All DL predictions combined"
            ),
            "content": {
                "application/json": {
                    "example": {
                        "message": (
                            "We are dying of hunger - 500 people "
                            "in Delmas 19 need immediate help"
                        ),
                        "urgency": {
                            "label": "critical"
                        },
                        "disaster": {
                            "is_disaster": True
                        },
                        "essential_categories": [
                            "food",
                            "aid_related"
                        ],
                    }
                }
            },
        }
    },
)
def dl_predict_all(
    req: MessageRequest = Body(
        example={
            "message": (
                "We are dying of hunger - 500 people "
                "in Delmas 19 need immediate help"
            ),
            "genre": "direct",
        }
    )
):

    message, was_translated = translate_to_english(req.message)

    text = (
        f"{req.genre} "
        f"{clean_text(message)}"
    )

    # Urgency
    u_pred, u_proba = dl_predict_clf(
        [text],
        dl_model_u,
        dl_tok_u
    )

    urgency = {
        "label":
            DL_URGENCY_LABELS[
                int(u_pred[0])
            ],

        "confidence":
            round(
                float(u_proba[0].max()),
                4
            ),

        "probabilities": {
            DL_URGENCY_LABELS[i]:
                round(float(p), 4)
            for i, p in enumerate(
                u_proba[0]
            )
        },
    }

    # Binary
    b_pred, b_proba = dl_predict_clf(
        [text],
        dl_model_b,
        dl_tok_b
    )

    binary = {
        "is_disaster":
            bool(b_pred[0] == 1),

        "confidence":
            round(
                float(b_proba[0][1]),
                4
            ),
    }

    # Essential
    e_pred, e_probs = dl_predict_ml(
        [text],
        dl_model_e,
        dl_tok_e
    )

    essential = [
        DL_ESSENTIAL_CATEGORIES[i]
        for i, value in enumerate(e_pred[0])
        if value == 1
    ]

    response = {
        "message": req.message,
        "urgency": urgency,
        "disaster": binary,
        "essential_categories": essential,
    }

    if was_translated:
        response["translated_message"] = message

    return response


# ═══════════════════════════════════════════════════════════════════
#  MAIN APP
# ═══════════════════════════════════════════════════════════════════

app = FastAPI(
    title="Disaster Data Analysis and Predictive Mining",

    description=(
        "ML (TF-IDF) and DL (Distilbert) models "
        "for disaster response classification"
    ),

    version="2.0.0",
)


# ═══════════════════════════════════════════════════════════════════
#  CORS
# ═══════════════════════════════════════════════════════════════════

app.add_middleware(
    CORSMiddleware,

    allow_origins=["*"],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)


# ═══════════════════════════════════════════════════════════════════
#  ROUTERS
# ═══════════════════════════════════════════════════════════════════

app.include_router(ml_router)
app.include_router(dl_router)


# ═══════════════════════════════════════════════════════════════════
#  SERVE WEBSITE
# ═══════════════════════════════════════════════════════════════════

WEB_DIR = BASE_DIR / "website"


@app.get(
    "/",
    include_in_schema=False
)
def serve_website():

    return FileResponse(
        str(WEB_DIR / "index.html")
    )


# ═══════════════════════════════════════════════════════════════════
#  STATIC DIRECTORIES
# ═══════════════════════════════════════════════════════════════════

app.mount(
    "/css",
    StaticFiles(
        directory=str(WEB_DIR / "css")
    ),
    name="css",
)

app.mount(
    "/js",
    StaticFiles(
        directory=str(WEB_DIR / "js")
    ),
    name="js",
)

app.mount(
    "/components",
    StaticFiles(
        directory=str(WEB_DIR / "components")
    ),
    name="components",
)

app.mount(
    "/images",
    StaticFiles(
        directory=str(WEB_DIR / "images")
    ),
    name="images",
)