"""
urgency_classifier.py
Multi-class classifier: low / medium / high / critical

Pipeline:
  TF-IDF (char + word n-grams)  →  Logistic Regression (OvR)

Also trains a Random Forest and a Linear SVM for comparison.
Saves best model to models/urgency_classifier.pkl
"""

import pickle
import numpy as np
import pandas as pd
from pathlib import Path

from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.svm import LinearSVC
from sklearn.ensemble import RandomForestClassifier
from sklearn.multiclass import OneVsRestClassifier
from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score
from sklearn.metrics import (
    classification_report, confusion_matrix, accuracy_score, f1_score
)
from sklearn.preprocessing import LabelEncoder

import sys
sys.path.insert(0, str(Path(__file__).resolve().parent))
from preprocessing import load_data, URGENCY_LABEL_NAMES

MODEL_DIR = Path(__file__).resolve().parent.parent / "models"
MODEL_DIR.mkdir(exist_ok=True)
OUTPUT_DIR = Path(__file__).resolve().parent.parent / "outputs"
OUTPUT_DIR.mkdir(exist_ok=True)


# ── feature engineering ─────────────────────────────────────────────────────
def make_features(df: pd.DataFrame) -> pd.Series:
    """Combine message text with genre as a feature prefix."""
    return df["genre"].fillna("unknown") + " " + df["message_clean"]


# ── pipelines ───────────────────────────────────────────────────────────────
def build_pipelines() -> dict:
    tfidf_word = TfidfVectorizer(
        analyzer="word",
        ngram_range=(1, 2),
        max_features=50_000,
        sublinear_tf=True,
        min_df=2,
    )
    tfidf_char = TfidfVectorizer(
        analyzer="char_wb",
        ngram_range=(3, 5),
        max_features=30_000,
        sublinear_tf=True,
        min_df=3,
    )

    from sklearn.pipeline import FeatureUnion
    tfidf_union = FeatureUnion([
        ("word", tfidf_word),
        ("char", tfidf_char),
    ])

    pipelines = {
        "LogisticRegression": Pipeline([
            ("tfidf", tfidf_union),
            ("clf", LogisticRegression(
                C=1.0,
                max_iter=1000,
                class_weight="balanced",
                solver="lbfgs",
                n_jobs=-1,
            )),
        ]),
        "LinearSVC": Pipeline([
            ("tfidf", tfidf_union),
            ("clf", LinearSVC(
                C=0.5,
                max_iter=2000,
                class_weight="balanced",
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
                n_estimators=200,
                class_weight="balanced",
                n_jobs=-1,
                random_state=42,
            )),
        ]),
    }
    return pipelines


# ── evaluation helper ────────────────────────────────────────────────────────
def evaluate(name: str, pipeline, X_test, y_test, label_names: list) -> dict:
    y_pred = pipeline.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    f1_macro = f1_score(y_test, y_pred, average="macro")
    f1_weighted = f1_score(y_test, y_pred, average="weighted")
    report = classification_report(y_test, y_pred, target_names=label_names)

    print(f"\n{'='*60}")
    print(f"  {name}")
    print(f"{'='*60}")
    print(f"  Accuracy        : {acc:.4f}")
    print(f"  F1 macro        : {f1_macro:.4f}")
    print(f"  F1 weighted     : {f1_weighted:.4f}")
    print(f"\n{report}")

    return {"name": name, "accuracy": acc, "f1_macro": f1_macro,
            "f1_weighted": f1_weighted, "pipeline": pipeline}


# ── main ────────────────────────────────────────────────────────────────────
def train(save: bool = True) -> Pipeline:
    print("Loading data …")
    df = load_data()

    X = make_features(df)
    y = df["urgency_level"].values  # 0/1/2/3

    label_names = [URGENCY_LABEL_NAMES[i] for i in sorted(URGENCY_LABEL_NAMES)]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    print(f"Train: {len(X_train)}  Test: {len(X_test)}")
    print(f"Class distribution (train): {np.bincount(y_train)}")

    pipelines = build_pipelines()
    results = []

    for name, pipe in pipelines.items():
        print(f"\nTraining {name} …")
        pipe.fit(X_train, y_train)
        res = evaluate(name, pipe, X_test, y_test, label_names)
        results.append(res)

    # pick best by F1 macro
    best = max(results, key=lambda r: r["f1_macro"])
    print(f"\n✓ Best model: {best['name']}  (F1 macro={best['f1_macro']:.4f})")

    # ── 5-fold CV on best ───────────────────────────────────────────────────
    print("\n5-fold cross-validation on best model …")
    cv_scores = cross_val_score(
        best["pipeline"], X, y, cv=StratifiedKFold(5, shuffle=True, random_state=42),
        scoring="f1_macro", n_jobs=-1
    )
    print(f"CV F1 macro: {cv_scores.mean():.4f} ± {cv_scores.std():.4f}")

    # ── save ────────────────────────────────────────────────────────────────
    if save:
        out = MODEL_DIR / "urgency_classifier.pkl"
        with open(out, "wb") as f:
            pickle.dump({"model": best["pipeline"], "label_names": label_names}, f)
        print(f"\nModel saved → {out}")

    # ── save results summary ────────────────────────────────────────────────
    summary = pd.DataFrame([
        {k: v for k, v in r.items() if k != "pipeline"}
        for r in results
    ])
    summary.to_csv(OUTPUT_DIR / "urgency_results.csv", index=False)

    return best["pipeline"]


def predict(texts: list[str], genres: list[str] | None = None) -> list[str]:
    """Load saved model and return urgency label strings."""
    model_path = MODEL_DIR / "urgency_classifier.pkl"
    with open(model_path, "rb") as f:
        bundle = pickle.load(f)
    model = bundle["model"]
    label_names = bundle["label_names"]

    if genres is None:
        genres = ["direct"] * len(texts)

    import re
    def _clean(t):
        t = str(t).lower()
        t = re.sub(r"http\S+|www\S+", " ", t)
        t = re.sub(r"[^a-z0-9\s']", " ", t)
        return re.sub(r"\s+", " ", t).strip()

    X = pd.Series([g + " " + _clean(t) for g, t in zip(genres, texts)])
    preds = model.predict(X)
    return [label_names[p] for p in preds]


if __name__ == "__main__":
    train()
