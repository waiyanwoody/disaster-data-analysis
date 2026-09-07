"""
preprocessing.py
Merges disaster_messages.csv + disaster_categories.csv,
engineers labels for all three classifiers, and exposes a
clean load_data() function used by every training script.
"""

import re
import pandas as pd
import numpy as np
from pathlib import Path

# ── paths ──────────────────────────────────────────────────────────────────
DATA_DIR = Path(__file__).resolve().parent.parent / "data"
MSG_PATH = DATA_DIR / "disaster_messages.csv"
CAT_PATH = DATA_DIR / "disaster_categories.csv"

# ── essential categories ────────────────────────────────────────────────────
# aid_related is a synthetic label: 1 if any of (aid_related, request, other_aid) == 1
ESSENTIAL_CATEGORIES = [
    # original 9
    "medical_help", "medical_products",
    "death",
    "floods", "storm", "earthquake",
    "water", "food", "shelter",
    # newly added 4
    "aid_related",        # synthetic: aid_related | request | other_aid
    "search_and_rescue",
    "transport",
    "missing_people",
]

# ── urgency scoring weights ─────────────────────────────────────────────────
# Each category contributes a score; thresholds map score → level
URGENCY_WEIGHTS = {
    "death":            4,
    "medical_help":     3,
    "medical_products": 3,
    "search_and_rescue":3,
    "missing_people":   3,
    "water":            2,
    "food":             2,
    "shelter":          2,
    "floods":           2,
    "earthquake":       2,
    "storm":            2,
    "fire":             2,
    "medical_help":     3,
    "infrastructure_related": 1,
    "transport":        1,
    "buildings":        1,
    "electricity":      1,
    "other_aid":        1,
    "refugees":         1,
    "direct_report":    1,   # first-hand report raises urgency slightly
}

URGENCY_THRESHOLDS = {
    # score → label (0=low, 1=medium, 2=high, 3=critical)
    0: 0,   # 0           → low
    1: 1,   # 1-3         → medium
    4: 2,   # 4-6         → high
    7: 3,   # 7+          → critical
}

URGENCY_LABEL_NAMES = {0: "low", 1: "medium", 2: "high", 3: "critical"}


def _score_to_urgency(score: int) -> int:
    level = 0
    for threshold, label in sorted(URGENCY_THRESHOLDS.items()):
        if score >= threshold:
            level = label
    return level


def clean_text(text: str) -> str:
    """Lowercase, remove URLs, punctuation noise, extra spaces."""
    text = str(text).lower()
    text = re.sub(r"http\S+|www\S+", " ", text)
    text = re.sub(r"[^a-z0-9\s']", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def parse_categories(cat_series: pd.Series) -> pd.DataFrame:
    """
    Expand the semicolon-separated 'categories' column into
    one binary column per category.
    """
    split = cat_series.str.split(";", expand=True)
    # derive column names from first row
    col_names = split.iloc[0].apply(lambda x: x.rsplit("-", 1)[0])
    split.columns = col_names
    # extract 0/1 values; clip to [0,1] (some rows have value=2)
    for col in split.columns:
        split[col] = split[col].apply(lambda x: int(str(x).rsplit("-", 1)[-1])).clip(0, 1)
    return split.astype(np.int8)


def load_data() -> pd.DataFrame:
    """
    Returns a merged DataFrame with:
      - message_clean    : cleaned English message
      - genre            : direct / news / social
      - <36 category cols>
      - urgency_score    : raw integer score
      - urgency_level    : 0-3 integer label
      - urgency_label    : string (low/medium/high/critical)
      - is_disaster      : 1 if related==1 AND at least one real category active
    """
    messages = pd.read_csv(MSG_PATH)
    categories = pd.read_csv(CAT_PATH)

    # merge on id
    df = messages.merge(categories, on="id")

    # drop duplicates
    df = df.drop_duplicates(subset="id").reset_index(drop=True)

    # parse categories into columns
    cat_df = parse_categories(df["categories"])
    df = pd.concat([df.drop(columns=["categories"]), cat_df], axis=1)

    # clean message text
    df["message_clean"] = df["message"].apply(clean_text)

    # ── synthetic aid_related label (aid_related | request | other_aid) ───────
    df["aid_related"] = (
        (df.get("aid_related", pd.Series(0, index=df.index)) == 1) |
        (df.get("request",     pd.Series(0, index=df.index)) == 1) |
        (df.get("other_aid",   pd.Series(0, index=df.index)) == 1)
    ).astype(np.int8)

    # ── urgency label ───────────────────────────────────────────────────────
    df["urgency_score"] = sum(
        df.get(cat, pd.Series(0, index=df.index)) * weight
        for cat, weight in URGENCY_WEIGHTS.items()
    )
    df["urgency_level"] = df["urgency_score"].apply(_score_to_urgency)
    df["urgency_label"] = df["urgency_level"].map(URGENCY_LABEL_NAMES)

    # ── disaster binary label ───────────────────────────────────────────────
    # "related" == 1 but that includes noise; we require at least one
    # meaningful category (any column beyond 'related', 'request', 'offer')
    noise_cols = {"related", "request", "offer", "direct_report", "child_alone", "tools", "shops"}
    meaningful = [c for c in cat_df.columns if c not in noise_cols]
    df["is_disaster"] = (
        (df["related"] == 1) & (df[meaningful].sum(axis=1) >= 1)
    ).astype(np.int8)

    return df


if __name__ == "__main__":
    df = load_data()
    print("Shape:", df.shape)
    print("\nUrgency distribution:")
    print(df["urgency_label"].value_counts())
    print("\nDisaster binary distribution:")
    print(df["is_disaster"].value_counts())
    print("\nEssential category counts (13 labels):")
    print(df[ESSENTIAL_CATEGORIES].sum().sort_values(ascending=False))
