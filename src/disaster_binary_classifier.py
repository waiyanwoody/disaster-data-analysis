"""
disaster_binary_classifier.py
Binary classifier: is this message disaster-related? (0 / 1)

Pipeline:
  TF-IDF (word + char n-grams)  →  Logistic Regression / LinearSVC / GradientBoosting

Saves best model to models/disaster_binary_classifier.pkl
"""

import pickle
import numpy as np
import pandas as pd
from pathlib import Path

from sklearn.pipeline import Pipeline, FeatureUnion
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.svm import LinearSVC
from sklearn.ensemble import GradientBoostingClassifier, RandomForestClassifier
from sklearn.calibration import CalibratedClassifierCV
from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score
from sklearn.metrics import (
    classification_report, roc_auc_score, f1_score,
    precision_recall_curve, average_precision_score
)

import sys
sys.path.insert(0, str(Path(__file__).resolve().parent))
from preprocessing import load_data

MODEL_DIR = Path(__file__).resolve().parent.parent / "models"
MODEL_DIR.mkdir(exist_ok=True)
OUTPUT_DIR = Path(__file__).resolve().parent.parent / "outputs"
OUTPUT_DIR.mkdir(exist_ok=True)


# ── shared TF-IDF union ──────────────────────────────────────────────────────
def make_tfidf_union(word_features=60_000, char_features=30_000):
    return FeatureUnion([
        ("word", TfidfVectorizer(
            analyzer="word",
            ngram_range=(1, 3),
            max_features=word_features,
            sublinear_tf=True,
            min_df=2,
        )),
        ("char", TfidfVectorizer(
            analyzer="char_wb",
            ngram_range=(3, 5),
            max_features=char_features,
            sublinear_tf=True,
            min_df=3,
        )),
    ])


# ── pipelines ────────────────────────────────────────────────────────────────
def build_pipelines() -> dict:
    return {
        "LogisticRegression": Pipeline([
            ("tfidf", make_tfidf_union()),
            ("clf", LogisticRegression(
                C=1.0,
                max_iter=1000,
                class_weight="balanced",
                solver="lbfgs",
                n_jobs=-1,
            )),
        ]),

        "LinearSVC (calibrated)": Pipeline([
            ("tfidf", make_tfidf_union()),
            ("clf", CalibratedClassifierCV(
                LinearSVC(C=1.0, max_iter=2000, class_weight="balanced"),
                cv=3,
            )),
        ]),

        "RandomForest": Pipeline([
            ("tfidf", TfidfVectorizer(
                analyzer="word",
                ngram_range=(1, 2),
                max_features=20_000,
                sublinear_tf=True,
            )),
            ("clf", RandomForestClassifier(
                n_estimators=300,
                class_weight="balanced",
                max_depth=None,
                n_jobs=-1,
                random_state=42,
            )),
        ]),
    }


# ── evaluation ────────────────────────────────────────────────────────────────
def evaluate(name: str, pipe, X_test, y_test) -> dict:
    y_pred = pipe.predict(X_test)
    f1 = f1_score(y_test, y_pred, average="binary")
    report = classification_report(y_test, y_pred, target_names=["not_disaster", "disaster"])

    # ROC-AUC if probability is available
    try:
        y_prob = pipe.predict_proba(X_test)[:, 1]
        auc = roc_auc_score(y_test, y_prob)
        ap = average_precision_score(y_test, y_prob)
    except AttributeError:
        auc, ap = float("nan"), float("nan")

    print(f"\n{'='*60}")
    print(f"  {name}")
    print(f"{'='*60}")
    print(f"  F1 (disaster)   : {f1:.4f}")
    print(f"  ROC-AUC         : {auc:.4f}")
    print(f"  Avg Precision   : {ap:.4f}")
    print(f"\n{report}")

    return {"name": name, "f1": f1, "roc_auc": auc, "avg_precision": ap, "pipeline": pipe}


# ── main ──────────────────────────────────────────────────────────────────────
def train(save: bool = True) -> Pipeline:
    print("Loading data …")
    df = load_data()

    X = df["genre"].fillna("unknown") + " " + df["message_clean"]
    y = df["is_disaster"].values

    print(f"Class distribution — disaster: {y.sum()}  non-disaster: {(y==0).sum()}")

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    print(f"Train: {len(X_train)}  Test: {len(X_test)}")

    results = []
    for name, pipe in build_pipelines().items():
        print(f"\nTraining {name} …")
        pipe.fit(X_train, y_train)
        res = evaluate(name, pipe, X_test, y_test)
        results.append(res)

    best = max(results, key=lambda r: r["f1"])
    print(f"\n✓ Best model: {best['name']}  (F1={best['f1']:.4f}  AUC={best['roc_auc']:.4f})")

    # 5-fold CV on best
    print("\n5-fold cross-validation on best model …")
    cv = cross_val_score(
        best["pipeline"], X, y,
        cv=StratifiedKFold(5, shuffle=True, random_state=42),
        scoring="f1", n_jobs=-1
    )
    print(f"CV F1: {cv.mean():.4f} ± {cv.std():.4f}")

    if save:
        out = MODEL_DIR / "disaster_binary_classifier.pkl"
        with open(out, "wb") as f:
            pickle.dump(best["pipeline"], f)
        print(f"\nModel saved → {out}")

    summary = pd.DataFrame([
        {k: v for k, v in r.items() if k != "pipeline"}
        for r in results
    ])
    summary.to_csv(OUTPUT_DIR / "disaster_binary_results.csv", index=False)

    return best["pipeline"]


def predict(texts: list[str], genres: list[str] | None = None) -> list[int]:
    """Returns 1 (disaster) or 0 (not disaster) for each text."""
    model_path = MODEL_DIR / "disaster_binary_classifier.pkl"
    with open(model_path, "rb") as f:
        model = pickle.load(f)

    if genres is None:
        genres = ["direct"] * len(texts)

    import re
    def _clean(t):
        t = str(t).lower()
        t = re.sub(r"http\S+|www\S+", " ", t)
        t = re.sub(r"[^a-z0-9\s']", " ", t)
        return re.sub(r"\s+", " ", t).strip()

    X = pd.Series([g + " " + _clean(t) for g, t in zip(genres, texts)])
    return model.predict(X).tolist()


if __name__ == "__main__":
    train()
