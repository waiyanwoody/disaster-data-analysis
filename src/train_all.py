"""
train_all.py
Unified entry point — trains all three classifiers sequentially,
then runs a live inference demo on sample messages.

Usage:
    python3 src/train_all.py
"""

import time
from pathlib import Path

# ── import individual trainers ───────────────────────────────────────────────
import sys
sys.path.insert(0, str(Path(__file__).resolve().parent))

import urgency_classifier
import disaster_binary_classifier
import essential_categories_classifier
from preprocessing import ESSENTIAL_CATEGORIES

DIVIDER = "=" * 70


def section(title: str):
    print(f"\n{DIVIDER}")
    print(f"  {title}")
    print(DIVIDER)


# ── demo messages ────────────────────────────────────────────────────────────
DEMO_MESSAGES = [
    ("People are trapped under collapsed buildings, we need rescue teams now.",    "direct"),
    ("Weather update — a cold front from Cuba could pass over Haiti tomorrow.",     "news"),
    ("We have no food or water in our shelter. Children are sick.",                 "direct"),
    ("Government announces new relief fund for flood victims.",                     "news"),
    ("I would like to receive messages, thank you.",                                "direct"),
    ("Hospital completely destroyed by earthquake. Patients on the street.",        "direct"),
    ("Storm approaching the northern coast. Residents advised to evacuate.",        "news"),
    ("We are dying of hunger — 500 people in Delmas 19 need immediate help.",      "direct"),
    ("Missing: my sister Maryani, last seen near Petionville on Tuesday.",          "direct"),
    ("UN reports Leogane 80-90% destroyed. Only Hospital St. Croix functioning.",   "direct"),
]


def run_demo():
    section("LIVE INFERENCE DEMO")

    texts  = [m for m, _ in DEMO_MESSAGES]
    genres = [g for _, g in DEMO_MESSAGES]

    urgency_preds  = urgency_classifier.predict(texts, genres)
    binary_preds   = disaster_binary_classifier.predict(texts, genres)
    category_preds = essential_categories_classifier.predict(texts, genres)

    print(f"\n{'MSG':>3}  {'DISASTER':^10}  {'URGENCY':^10}  ACTIVE ESSENTIAL CATEGORIES")
    print("-" * 90)
    for i, (text, is_dis, urg, cats) in enumerate(
        zip(texts, binary_preds, urgency_preds, category_preds), 1
    ):
        active = [c for c, v in cats.items() if v == 1]
        dis_str = "✓ YES" if is_dis else "✗ NO "
        short = text[:55] + "…" if len(text) > 55 else text
        print(f"{i:>3}. {dis_str:^10}  {urg:^10}  {', '.join(active) or '—'}")
        print(f"     \"{short}\"")
        print()


# ── main ─────────────────────────────────────────────────────────────────────
def main():
    print(DIVIDER)
    print("  DISASTER RESPONSE ML PIPELINE — TRAIN ALL")
    print(DIVIDER)

    t0 = time.time()

    # 1. Urgency classifier
    section("1/3  URGENCY LEVEL CLASSIFIER  (low / medium / high / critical)")
    urgency_classifier.train(save=True)

    # 2. Disaster binary classifier
    section("2/3  DISASTER BINARY CLASSIFIER  (disaster / not_disaster)")
    disaster_binary_classifier.train(save=True)

    # 3. Essential categories multi-label classifier
    section("3/3  ESSENTIAL CATEGORIES CLASSIFIER  (multi-label, 9 classes)")
    essential_categories_classifier.train(save=True)

    elapsed = time.time() - t0
    print(f"\n{DIVIDER}")
    print(f"  All models trained in {elapsed:.1f}s")
    print(f"  Saved to   : models/")
    print(f"  CSV reports: outputs/")
    print(DIVIDER)

    # Live demo
    run_demo()


if __name__ == "__main__":
    main()
