"""
evaluate_report.py
Loads the three saved models and produces a consolidated evaluation report:
  - Per-classifier metrics table
  - Confusion matrix for urgency
  - Per-label breakdown for essential categories
  - Saves outputs/evaluation_report.txt  (human-readable)
  - Saves outputs/evaluation_summary.csv (machine-readable)
  - Saves plots: outputs/confusion_urgency.png
                 outputs/label_f1_essential.png
"""

import pickle
import numpy as np
import pandas as pd
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import seaborn as sns
from pathlib import Path

from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    classification_report, confusion_matrix,
    accuracy_score, f1_score, roc_auc_score,
    average_precision_score, hamming_loss, jaccard_score,
)

import sys
sys.path.insert(0, str(Path(__file__).resolve().parent))
from preprocessing import load_data, ESSENTIAL_CATEGORIES, URGENCY_LABEL_NAMES

MODEL_DIR  = Path(__file__).resolve().parent.parent / "models"
OUTPUT_DIR = Path(__file__).resolve().parent.parent / "outputs"
OUTPUT_DIR.mkdir(exist_ok=True)

DIVIDER = "=" * 70
HALF    = "-" * 70


def load_models():
    with open(MODEL_DIR / "urgency_classifier.pkl", "rb") as f:
        urgency_bundle = pickle.load(f)

    with open(MODEL_DIR / "disaster_binary_classifier.pkl", "rb") as f:
        binary_model = pickle.load(f)

    with open(MODEL_DIR / "essential_categories_classifier.pkl", "rb") as f:
        cats_bundle = pickle.load(f)

    return urgency_bundle, binary_model, cats_bundle


def make_X(df: pd.DataFrame) -> pd.Series:
    return df["genre"].fillna("unknown") + " " + df["message_clean"]


# ── 1. Urgency ────────────────────────────────────────────────────────────────
def evaluate_urgency(model, label_names, X_test, y_test) -> dict:
    y_pred = model.predict(X_test)
    acc    = accuracy_score(y_test, y_pred)
    f1_mac = f1_score(y_test, y_pred, average="macro")
    f1_wt  = f1_score(y_test, y_pred, average="weighted")
    report = classification_report(y_test, y_pred, target_names=label_names)
    cm     = confusion_matrix(y_test, y_pred)

    # confusion matrix plot
    fig, ax = plt.subplots(figsize=(7, 6))
    sns.heatmap(cm, annot=True, fmt="d", cmap="Blues",
                xticklabels=label_names, yticklabels=label_names, ax=ax)
    ax.set_title("Urgency Classifier — Confusion Matrix", fontsize=13, pad=12)
    ax.set_xlabel("Predicted", fontsize=11)
    ax.set_ylabel("Actual", fontsize=11)
    plt.tight_layout()
    plt.savefig(OUTPUT_DIR / "confusion_urgency.png", dpi=150)
    plt.close()

    return {
        "accuracy": round(acc, 4),
        "f1_macro": round(f1_mac, 4),
        "f1_weighted": round(f1_wt, 4),
        "report": report,
    }


# ── 2. Binary ─────────────────────────────────────────────────────────────────
def evaluate_binary(model, X_test, y_test) -> dict:
    y_pred = model.predict(X_test)
    f1     = f1_score(y_test, y_pred, average="binary")
    try:
        y_prob = model.predict_proba(X_test)[:, 1]
        auc    = roc_auc_score(y_test, y_prob)
        ap     = average_precision_score(y_test, y_prob)
    except AttributeError:
        auc, ap = float("nan"), float("nan")
    report = classification_report(y_test, y_pred,
                                   target_names=["not_disaster", "disaster"])
    return {
        "f1_binary": round(f1, 4),
        "roc_auc":   round(auc, 4),
        "avg_precision": round(ap, 4),
        "report": report,
    }


# ── 3. Essential categories ───────────────────────────────────────────────────
def evaluate_essential(model, X_test, y_test) -> dict:
    y_pred      = model.predict(X_test)
    f1_micro    = f1_score(y_test, y_pred, average="micro",    zero_division=0)
    f1_macro    = f1_score(y_test, y_pred, average="macro",    zero_division=0)
    f1_samples  = f1_score(y_test, y_pred, average="samples",  zero_division=0)
    hl          = hamming_loss(y_test, y_pred)
    jac         = jaccard_score(y_test, y_pred, average="samples", zero_division=0)
    report      = classification_report(y_test, y_pred,
                                        target_names=ESSENTIAL_CATEGORIES,
                                        zero_division=0)

    # per-label F1 bar chart
    per_f1 = [
        f1_score(y_test[:, i], y_pred[:, i], zero_division=0)
        for i in range(len(ESSENTIAL_CATEGORIES))
    ]
    order   = np.argsort(per_f1)[::-1]
    cats_   = [ESSENTIAL_CATEGORIES[i] for i in order]
    scores_ = [per_f1[i] for i in order]

    fig, ax = plt.subplots(figsize=(10, 5))
    colors = ["#2196F3" if s >= 0.7 else "#FF9800" if s >= 0.5 else "#F44336"
              for s in scores_]
    bars = ax.barh(cats_[::-1], scores_[::-1], color=colors[::-1], edgecolor="white")
    ax.axvline(0.7, color="green",  linestyle="--", linewidth=1, label="0.70 threshold")
    ax.axvline(0.5, color="orange", linestyle="--", linewidth=1, label="0.50 threshold")
    ax.set_xlabel("F1 Score", fontsize=11)
    ax.set_title("Essential Categories — Per-Label F1 Score", fontsize=13, pad=12)
    ax.set_xlim(0, 1.0)
    for bar, score in zip(bars[::-1], scores_[::-1]):
        ax.text(score + 0.01, bar.get_y() + bar.get_height() / 2,
                f"{score:.3f}", va="center", fontsize=9)
    ax.legend(fontsize=9)
    plt.tight_layout()
    plt.savefig(OUTPUT_DIR / "label_f1_essential.png", dpi=150)
    plt.close()

    return {
        "f1_micro":    round(f1_micro, 4),
        "f1_macro":    round(f1_macro, 4),
        "f1_samples":  round(f1_samples, 4),
        "hamming_loss": round(hl, 4),
        "jaccard":     round(jac, 4),
        "report": report,
        "per_label_f1": dict(zip(ESSENTIAL_CATEGORIES, [round(s, 4) for s in per_f1])),
    }


# ── write text report ─────────────────────────────────────────────────────────
def write_report(urgency_res, binary_res, cats_res, out_path: Path):
    lines = []
    a = lines.append

    a(DIVIDER)
    a("  DISASTER RESPONSE ML PIPELINE — EVALUATION REPORT")
    a(DIVIDER)

    # ── Urgency
    a("\n1. URGENCY LEVEL CLASSIFIER  (low / medium / high / critical)")
    a(HALF)
    a(f"  Accuracy          : {urgency_res['accuracy']}")
    a(f"  F1 macro          : {urgency_res['f1_macro']}")
    a(f"  F1 weighted       : {urgency_res['f1_weighted']}")
    a(f"\nClassification Report:\n{urgency_res['report']}")

    # ── Binary
    a("\n2. DISASTER BINARY CLASSIFIER  (disaster / not_disaster)")
    a(HALF)
    a(f"  F1 (disaster)     : {binary_res['f1_binary']}")
    a(f"  ROC-AUC           : {binary_res['roc_auc']}")
    a(f"  Avg Precision     : {binary_res['avg_precision']}")
    a(f"\nClassification Report:\n{binary_res['report']}")

    # ── Essential categories
    a("\n3. ESSENTIAL CATEGORIES CLASSIFIER  (multi-label, 9 classes)")
    a(HALF)
    a(f"  F1 micro          : {cats_res['f1_micro']}")
    a(f"  F1 macro          : {cats_res['f1_macro']}")
    a(f"  F1 samples        : {cats_res['f1_samples']}")
    a(f"  Hamming loss      : {cats_res['hamming_loss']}  (lower = better)")
    a(f"  Jaccard (samples) : {cats_res['jaccard']}")
    a(f"\nPer-label F1:")
    for cat, score in sorted(cats_res["per_label_f1"].items(),
                             key=lambda x: x[1], reverse=True):
        bar = "█" * int(score * 20) + "░" * (20 - int(score * 20))
        a(f"  {cat:25s} {bar}  {score:.4f}")
    a(f"\nClassification Report:\n{cats_res['report']}")

    # ── Summary table
    a("\nSUMMARY TABLE")
    a(HALF)
    a(f"  {'Classifier':<35} {'Primary Metric':<18} {'Value':>8}")
    a(f"  {'-'*35} {'-'*18} {'-'*8}")
    a(f"  {'Urgency Level (4-class)':<35} {'F1 macro':<18} {urgency_res['f1_macro']:>8}")
    a(f"  {'Disaster Binary':<35} {'F1 + ROC-AUC':<18} {binary_res['f1_binary']:>5} / {binary_res['roc_auc']}")
    a(f"  {'Essential Categories (9-label)':<35} {'F1 micro':<18} {cats_res['f1_micro']:>8}")
    a("")
    a(f"  Plots saved:")
    a(f"    outputs/confusion_urgency.png")
    a(f"    outputs/label_f1_essential.png")
    a(DIVIDER)

    report_text = "\n".join(lines)
    out_path.write_text(report_text)
    print(report_text)


# ── main ──────────────────────────────────────────────────────────────────────
def main():
    print("Loading data …")
    df = load_data()
    X  = make_X(df)

    # reproducible 80/20 split — same seed as training
    _, X_test, _, y_urg  = train_test_split(X, df["urgency_level"].values,
                                             test_size=0.2, random_state=42,
                                             stratify=df["urgency_level"].values)
    _, X_test2, _, y_bin = train_test_split(X, df["is_disaster"].values,
                                             test_size=0.2, random_state=42,
                                             stratify=df["is_disaster"].values)
    _, X_test3, _, y_cat = train_test_split(X, df[ESSENTIAL_CATEGORIES].values,
                                             test_size=0.2, random_state=42)

    print("Loading models …")
    urgency_bundle, binary_model, cats_bundle = load_models()

    label_names = [URGENCY_LABEL_NAMES[i] for i in sorted(URGENCY_LABEL_NAMES)]

    print("Evaluating …")
    urgency_res = evaluate_urgency(urgency_bundle["model"], label_names, X_test,  y_urg)
    binary_res  = evaluate_binary(binary_model,                          X_test2, y_bin)
    cats_res    = evaluate_essential(cats_bundle["model"],               X_test3, y_cat)

    # CSV summary
    summary = pd.DataFrame([
        {"classifier": "Urgency Level",        "metric": "F1 macro",  "value": urgency_res["f1_macro"]},
        {"classifier": "Urgency Level",        "metric": "Accuracy",  "value": urgency_res["accuracy"]},
        {"classifier": "Urgency Level",        "metric": "F1 weighted","value": urgency_res["f1_weighted"]},
        {"classifier": "Disaster Binary",      "metric": "F1",        "value": binary_res["f1_binary"]},
        {"classifier": "Disaster Binary",      "metric": "ROC-AUC",   "value": binary_res["roc_auc"]},
        {"classifier": "Disaster Binary",      "metric": "Avg Prec",  "value": binary_res["avg_precision"]},
        {"classifier": "Essential Categories", "metric": "F1 micro",  "value": cats_res["f1_micro"]},
        {"classifier": "Essential Categories", "metric": "F1 macro",  "value": cats_res["f1_macro"]},
        {"classifier": "Essential Categories", "metric": "Hamming",   "value": cats_res["hamming_loss"]},
        {"classifier": "Essential Categories", "metric": "Jaccard",   "value": cats_res["jaccard"]},
    ])
    summary.to_csv(OUTPUT_DIR / "evaluation_summary.csv", index=False)

    write_report(urgency_res, binary_res, cats_res,
                 OUTPUT_DIR / "evaluation_report.txt")

    print(f"\nReport  → outputs/evaluation_report.txt")
    print(f"Summary → outputs/evaluation_summary.csv")
    print(f"Plots   → outputs/confusion_urgency.png")
    print(f"          outputs/label_f1_essential.png")


if __name__ == "__main__":
    main()
