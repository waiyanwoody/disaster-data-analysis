"""
essential_categories_classifier.py
Multi-label classifier for 9 essential disaster response categories:
  medical_help, medical_products, death,
  floods, storm, earthquake,
  water, food, shelter

Pipeline:
  TF-IDF (word + char n-grams)  →  OneVsRestClassifier(LogisticRegression)
  Also trains OneVsRest(LinearSVC) and OneVsRest(RandomForest) for comparison.

Saves best model to models/essential_categories_classifier.pkl
"""

import pickle
import numpy as np
import pandas as pd
from pathlib import Path

from sklearn.pipeline import Pipeline, FeatureUnion
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.svm import LinearSVC
from sklearn.ensemble import RandomForestClassifier
from sklearn.multiclass import OneVsRestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    classification_report,
    f1_score,
    hamming_loss,
    jaccard_score,
    multilabel_confusion_matrix,
)

import sys
sys.path.insert(0, str(Path(__file__).resolve().parent))
from preprocessing import load_data, ESSENTIAL_CATEGORIES

MODEL_DIR = Path(__file__).resolve().parent.parent / "models"
MODEL_DIR.mkdir(exist_ok=True)
OUTPUT_DIR = Path(__file__).resolve().parent.parent / "outputs"
OUTPUT_DIR.mkdir(exist_ok=True)


# ── shared TF-IDF ─────────────────────────────────────────────────────────────
def make_tfidf_union():
    return FeatureUnion([
        ("word", TfidfVectorizer(
            analyzer="word",
            ngram_range=(1, 3),
            max_features=60_000,
            sublinear_tf=True,
            min_df=2,
        )),
        ("char", TfidfVectorizer(
            analyzer="char_wb",
            ngram_range=(3, 5),
            max_features=25_000,
            sublinear_tf=True,
            min_df=3,
        )),
    ])


# ── pipelines ─────────────────────────────────────────────────────────────────
def build_pipelines() -> dict:
    return {
        "OvR LogisticRegression": Pipeline([
            ("tfidf", make_tfidf_union()),
            ("clf", OneVsRestClassifier(
                LogisticRegression(
                    C=1.0,
                    max_iter=1000,
                    class_weight="balanced",
                    solver="lbfgs",
                    n_jobs=-1,
                ),
                n_jobs=-1,
            )),
        ]),

        "OvR LinearSVC": Pipeline([
            ("tfidf", make_tfidf_union()),
            ("clf", OneVsRestClassifier(
                LinearSVC(C=0.5, max_iter=2000, class_weight="balanced"),
                n_jobs=-1,
            )),
        ]),

        "OvR RandomForest": Pipeline([
            ("tfidf", TfidfVectorizer(
                analyzer="word",
                ngram_range=(1, 2),
                max_features=20_000,
                sublinear_tf=True,
            )),
            ("clf", OneVsRestClassifier(
                RandomForestClassifier(
                    n_estimators=200,
                    class_weight="balanced",
                    n_jobs=-1,
                    random_state=42,
                ),
                n_jobs=-1,
            )),
        ]),
    }


# ── evaluation ────────────────────────────────────────────────────────────────
def evaluate(name: str, pipe, X_test, y_test: np.ndarray) -> dict:
    y_pred = pipe.predict(X_test)

    f1_micro = f1_score(y_test, y_pred, average="micro", zero_division=0)
    f1_macro = f1_score(y_test, y_pred, average="macro", zero_division=0)
    f1_samples = f1_score(y_test, y_pred, average="samples", zero_division=0)
    hl = hamming_loss(y_test, y_pred)
    jac = jaccard_score(y_test, y_pred, average="samples", zero_division=0)

    report = classification_report(
        y_test, y_pred, target_names=ESSENTIAL_CATEGORIES, zero_division=0
    )

    print(f"\n{'='*60}")
    print(f"  {name}")
    print(f"{'='*60}")
    print(f"  F1 micro        : {f1_micro:.4f}")
    print(f"  F1 macro        : {f1_macro:.4f}")
    print(f"  F1 samples      : {f1_samples:.4f}")
    print(f"  Hamming loss    : {hl:.4f}")
    print(f"  Jaccard (samp.) : {jac:.4f}")
    print(f"\n{report}")

    return {
        "name": name,
        "f1_micro": f1_micro,
        "f1_macro": f1_macro,
        "f1_samples": f1_samples,
        "hamming_loss": hl,
        "jaccard": jac,
        "pipeline": pipe,
    }


# ── per-label analysis ────────────────────────────────────────────────────────
def per_label_analysis(pipe, X_test, y_test: np.ndarray):
    y_pred = pipe.predict(X_test)
    rows = []
    for i, cat in enumerate(ESSENTIAL_CATEGORIES):
        f1 = f1_score(y_test[:, i], y_pred[:, i], zero_division=0)
        support = y_test[:, i].sum()
        rows.append({"category": cat, "f1": round(f1, 4), "support": int(support)})
    df = pd.DataFrame(rows).sort_values("f1", ascending=False)
    print("\nPer-label F1 (best model):")
    print(df.to_string(index=False))
    df.to_csv(OUTPUT_DIR / "essential_categories_per_label.csv", index=False)


# ── main ──────────────────────────────────────────────────────────────────────
def train(save: bool = True) -> Pipeline:
    print("Loading data …")
    df = load_data()

    X = df["genre"].fillna("unknown") + " " + df["message_clean"]
    y = df[ESSENTIAL_CATEGORIES].values.astype(np.int8)

    print(f"Samples: {len(X)}  Labels: {y.shape[1]}")
    print("Label positives:")
    for i, cat in enumerate(ESSENTIAL_CATEGORIES):
        print(f"  {cat:25s}: {y[:,i].sum():>5d}  ({y[:,i].mean()*100:.1f}%)")

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    print(f"\nTrain: {len(X_train)}  Test: {len(X_test)}")

    results = []
    for name, pipe in build_pipelines().items():
        print(f"\nTraining {name} …")
        pipe.fit(X_train, y_train)
        res = evaluate(name, pipe, X_test, y_test)
        results.append(res)

    best = max(results, key=lambda r: r["f1_micro"])
    print(f"\n✓ Best model: {best['name']}  (F1 micro={best['f1_micro']:.4f})")

    per_label_analysis(best["pipeline"], X_test, y_test)

    if save:
        out = MODEL_DIR / "essential_categories_classifier.pkl"
        with open(out, "wb") as f:
            pickle.dump(
                {"model": best["pipeline"], "categories": ESSENTIAL_CATEGORIES}, f
            )
        print(f"\nModel saved → {out}")

    summary = pd.DataFrame([
        {k: v for k, v in r.items() if k != "pipeline"}
        for r in results
    ])
    summary.to_csv(OUTPUT_DIR / "essential_categories_results.csv", index=False)

    return best["pipeline"]


def predict(texts: list[str], genres: list[str] | None = None) -> list[dict]:
    """
    Returns a list of dicts, one per input text.
    Each dict maps category name → 0 or 1.
    """
    model_path = MODEL_DIR / "essential_categories_classifier.pkl"
    with open(model_path, "rb") as f:
        bundle = pickle.load(f)
    model = bundle["model"]
    categories = bundle["categories"]

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
    return [dict(zip(categories, row.tolist())) for row in preds]


if __name__ == "__main__":
    train()
