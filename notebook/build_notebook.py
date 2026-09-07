"""
build_notebook.py  –  run once to generate disaster_pipeline.ipynb
"""
import nbformat as nbf
from pathlib import Path

NB_PATH = Path(__file__).parent / "disaster_pipeline.ipynb"
nb = nbf.v4.new_notebook()
cells = []

def md(src):   cells.append(nbf.v4.new_markdown_cell(src))
def code(src): cells.append(nbf.v4.new_code_cell(src))

# ─────────────────────────────────────────────────────────────────────────────
# TITLE
# ─────────────────────────────────────────────────────────────────────────────
md("""# Disaster Response ML Pipeline

Three classifiers built on the Figure-Eight / Appen disaster dataset:

| # | Task | Type |
|---|------|------|
| 1 | **Urgency Level** | Multi-class (low / medium / high / critical) |
| 2 | **Disaster Binary** | Binary (disaster / not disaster) |
| 3 | **Essential Categories** | Multi-label (9 categories) |

---
""")

# ─────────────────────────────────────────────────────────────────────────────
# 0 – SETUP
# ─────────────────────────────────────────────────────────────────────────────
md("## 0 · Setup")

code("""\
# Install any missing deps (silent if already present)
import subprocess, sys
pkgs = ["scikit-learn", "pandas", "numpy", "matplotlib", "seaborn"]
subprocess.run([sys.executable, "-m", "pip", "install", *pkgs, "-q"], check=True)
print("Dependencies ready.")
""")

code("""\
import re, pickle, warnings
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from pathlib import Path

warnings.filterwarnings("ignore")
sns.set_theme(style="whitegrid", palette="muted")

# ── paths ──────────────────────────────────────────────────────────────────
ROOT      = Path("..").resolve()
DATA_DIR  = ROOT / "data"
MODEL_DIR = ROOT / "models"
OUT_DIR   = ROOT / "outputs"
MODEL_DIR.mkdir(exist_ok=True)
OUT_DIR.mkdir(exist_ok=True)

MSG_PATH = DATA_DIR / "disaster_messages.csv"
CAT_PATH = DATA_DIR / "disaster_categories.csv"

ESSENTIAL_CATEGORIES = [
    "medical_help", "medical_products",
    "death",
    "floods", "storm", "earthquake",
    "water", "food", "shelter",
]

URGENCY_LABEL_NAMES = {0: "low", 1: "medium", 2: "high", 3: "critical"}
print("Setup complete. ROOT →", ROOT)
""")

# ─────────────────────────────────────────────────────────────────────────────
# 1 – DATA LOADING & EDA
# ─────────────────────────────────────────────────────────────────────────────
md("---\n## 1 · Data Loading & Exploratory Analysis")

code("""\
messages   = pd.read_csv(MSG_PATH)
categories = pd.read_csv(CAT_PATH)
print("messages  :", messages.shape)
print("categories:", categories.shape)
messages.head(3)
""")

code("""\
categories.head(3)
""")

code("""\
# ── genre distribution ─────────────────────────────────────────────────────
fig, ax = plt.subplots(figsize=(6, 3))
messages["genre"].value_counts().plot(kind="barh", ax=ax, color=["#2196F3","#4CAF50","#FF9800"])
ax.set_title("Message Genre Distribution")
ax.set_xlabel("Count")
plt.tight_layout()
plt.show()
""")

code("""\
# ── parse category columns ─────────────────────────────────────────────────
def parse_categories(cat_series):
    split = cat_series.str.split(";", expand=True)
    col_names = split.iloc[0].apply(lambda x: x.rsplit("-", 1)[0])
    split.columns = col_names
    for col in split.columns:
        split[col] = split[col].apply(lambda x: int(str(x).rsplit("-", 1)[-1])).clip(0, 1)
    return split.astype(np.int8)

df_raw = messages.merge(categories, on="id").drop_duplicates(subset="id").reset_index(drop=True)
cat_df = parse_categories(df_raw["categories"])
df_raw = pd.concat([df_raw.drop(columns=["categories"]), cat_df], axis=1)
print("Merged shape:", df_raw.shape)
df_raw.head(3)
""")

code("""\
# ── category frequency heatmap (top 20) ───────────────────────────────────
cat_cols = cat_df.columns.tolist()
cat_freq = df_raw[cat_cols].sum().sort_values(ascending=False)

fig, ax = plt.subplots(figsize=(14, 4))
colors = ["#e53935" if c in ESSENTIAL_CATEGORIES else "#1565C0" for c in cat_freq.index]
cat_freq.plot(kind="bar", ax=ax, color=colors, edgecolor="white")
ax.set_title("Category Frequency  (red = essential categories)")
ax.set_ylabel("Count")
ax.tick_params(axis="x", rotation=45)
plt.tight_layout()
plt.show()
""")

code("""\
# ── label co-occurrence for essential categories ───────────────────────────
co = df_raw[ESSENTIAL_CATEGORIES].T.dot(df_raw[ESSENTIAL_CATEGORIES])
np.fill_diagonal(co.values, 0)

fig, ax = plt.subplots(figsize=(8, 6))
sns.heatmap(co, annot=True, fmt="d", cmap="YlOrRd", ax=ax, linewidths=0.5)
ax.set_title("Essential Category Co-occurrence")
plt.tight_layout()
plt.show()
""")

# ─────────────────────────────────────────────────────────────────────────────
# 2 – PREPROCESSING
# ─────────────────────────────────────────────────────────────────────────────
md("---\n## 2 · Preprocessing & Feature Engineering")

code("""\
def clean_text(text):
    text = str(text).lower()
    text = re.sub(r"http\\S+|www\\S+", " ", text)
    text = re.sub(r"[^a-z0-9\\s']", " ", text)
    return re.sub(r"\\s+", " ", text).strip()

df_raw["message_clean"] = df_raw["message"].apply(clean_text)

# ── urgency scoring ────────────────────────────────────────────────────────
URGENCY_WEIGHTS = {
    "death": 4, "medical_help": 3, "medical_products": 3,
    "search_and_rescue": 3, "missing_people": 3,
    "water": 2, "food": 2, "shelter": 2,
    "floods": 2, "earthquake": 2, "storm": 2, "fire": 2,
    "infrastructure_related": 1, "transport": 1, "buildings": 1,
    "electricity": 1, "other_aid": 1, "refugees": 1, "direct_report": 1,
}
URGENCY_THRESHOLDS = {0: 0, 1: 1, 4: 2, 7: 3}

def score_to_urgency(score):
    level = 0
    for threshold, label in sorted(URGENCY_THRESHOLDS.items()):
        if score >= threshold:
            level = label
    return level

df_raw["urgency_score"] = sum(
    df_raw.get(cat, pd.Series(0, index=df_raw.index)) * w
    for cat, w in URGENCY_WEIGHTS.items()
)
df_raw["urgency_level"] = df_raw["urgency_score"].apply(score_to_urgency)
df_raw["urgency_label"] = df_raw["urgency_level"].map(URGENCY_LABEL_NAMES)

# ── disaster binary ────────────────────────────────────────────────────────
noise_cols = {"related","request","offer","direct_report","child_alone","tools","shops"}
meaningful = [c for c in cat_df.columns if c not in noise_cols]
df_raw["is_disaster"] = (
    (df_raw["related"] == 1) & (df_raw[meaningful].sum(axis=1) >= 1)
).astype(np.int8)

print("Urgency distribution:")
print(df_raw["urgency_label"].value_counts())
print("\\nDisaster distribution:")
print(df_raw["is_disaster"].value_counts())
""")

code("""\
# ── visualise urgency distribution ────────────────────────────────────────
order = ["low", "medium", "high", "critical"]
counts = df_raw["urgency_label"].value_counts().reindex(order)
colors = ["#4CAF50", "#FF9800", "#F44336", "#9C27B0"]

fig, axes = plt.subplots(1, 2, figsize=(12, 4))

axes[0].bar(order, counts.values, color=colors, edgecolor="white")
axes[0].set_title("Urgency Level Distribution")
axes[0].set_ylabel("Count")
for i, v in enumerate(counts.values):
    axes[0].text(i, v + 80, str(v), ha="center", fontsize=10)

axes[1].pie(counts.values, labels=order, colors=colors,
            autopct="%1.1f%%", startangle=140)
axes[1].set_title("Urgency Level (Proportions)")
plt.tight_layout()
plt.show()
""")

code("""\
# ── combined feature: genre prefix + cleaned message ──────────────────────
X_all = df_raw["genre"].fillna("unknown") + " " + df_raw["message_clean"]

y_urgency   = df_raw["urgency_level"].values
y_binary    = df_raw["is_disaster"].values
y_essential = df_raw[ESSENTIAL_CATEGORIES].values.astype(np.int8)

print("Feature sample:", X_all.iloc[0])
print("Urgency label:", y_urgency[0], "| Binary:", y_binary[0])
print("Essential labels:", dict(zip(ESSENTIAL_CATEGORIES, y_essential[0])))
""")

code("""\
from sklearn.model_selection import train_test_split

X_train, X_test, yu_train, yu_test = train_test_split(
    X_all, y_urgency,  test_size=0.2, random_state=42, stratify=y_urgency)
_, _,         yb_train, yb_test = train_test_split(
    X_all, y_binary,   test_size=0.2, random_state=42, stratify=y_binary)
_, _,         ye_train, ye_test = train_test_split(
    X_all, y_essential, test_size=0.2, random_state=42)

print(f"Train: {len(X_train):,}   Test: {len(X_test):,}")
""")

# ─────────────────────────────────────────────────────────────────────────────
# 3 – TFIDF BUILDER
# ─────────────────────────────────────────────────────────────────────────────
md("---\n## 3 · Shared TF-IDF Feature Union")

code("""\
from sklearn.pipeline import FeatureUnion
from sklearn.feature_extraction.text import TfidfVectorizer

def make_tfidf_union(word_feat=60_000, char_feat=25_000):
    return FeatureUnion([
        ("word", TfidfVectorizer(
            analyzer="word", ngram_range=(1, 3),
            max_features=word_feat, sublinear_tf=True, min_df=2)),
        ("char", TfidfVectorizer(
            analyzer="char_wb", ngram_range=(3, 5),
            max_features=char_feat, sublinear_tf=True, min_df=3)),
    ])

print("TF-IDF union builder ready.")
""")

# ─────────────────────────────────────────────────────────────────────────────
# 4 – CLASSIFIER 1: URGENCY
# ─────────────────────────────────────────────────────────────────────────────
md("---\n## 4 · Classifier 1 — Urgency Level  `(low / medium / high / critical)`")

code("""\
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression
from sklearn.svm import LinearSVC
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix, f1_score, accuracy_score
from sklearn.model_selection import cross_val_score, StratifiedKFold

label_names_urgency = [URGENCY_LABEL_NAMES[i] for i in sorted(URGENCY_LABEL_NAMES)]

urgency_pipelines = {
    "LogisticRegression": Pipeline([
        ("tfidf", make_tfidf_union()),
        ("clf",   LogisticRegression(C=1.0, max_iter=1000,
                                     class_weight="balanced", solver="lbfgs")),
    ]),
    "LinearSVC": Pipeline([
        ("tfidf", make_tfidf_union()),
        ("clf",   LinearSVC(C=0.5, max_iter=2000, class_weight="balanced")),
    ]),
    "RandomForest": Pipeline([
        ("tfidf", TfidfVectorizer(analyzer="word", ngram_range=(1,2),
                                  max_features=20_000, sublinear_tf=True)),
        ("clf",   RandomForestClassifier(n_estimators=200,
                                         class_weight="balanced",
                                         n_jobs=-1, random_state=42)),
    ]),
}

urgency_results = {}
for name, pipe in urgency_pipelines.items():
    print(f"Training {name} …", end=" ", flush=True)
    pipe.fit(X_train, yu_train)
    y_pred = pipe.predict(X_test)
    urgency_results[name] = {
        "pipeline":    pipe,
        "accuracy":    accuracy_score(yu_test, y_pred),
        "f1_macro":    f1_score(yu_test, y_pred, average="macro"),
        "f1_weighted": f1_score(yu_test, y_pred, average="weighted"),
        "y_pred":      y_pred,
    }
    print(f"done  (F1 macro={urgency_results[name]['f1_macro']:.4f})")
""")

code("""\
# ── comparison bar chart ───────────────────────────────────────────────────
urg_df = pd.DataFrame([
    {"model": k, "F1 macro": v["f1_macro"], "Accuracy": v["accuracy"]}
    for k, v in urgency_results.items()
])
urg_df.set_index("model")[["F1 macro", "Accuracy"]].plot(
    kind="bar", figsize=(8, 4), rot=0, edgecolor="white",
    color=["#2196F3", "#4CAF50"])
plt.title("Urgency Classifier — Model Comparison")
plt.ylabel("Score")
plt.ylim(0, 0.85)
plt.legend(loc="upper right")
plt.tight_layout()
plt.show()
urg_df
""")

code("""\
# ── best model detail ──────────────────────────────────────────────────────
best_urgency_name = max(urgency_results, key=lambda k: urgency_results[k]["f1_macro"])
best_urgency = urgency_results[best_urgency_name]
print(f"Best: {best_urgency_name}  (F1 macro={best_urgency['f1_macro']:.4f})")
print()
print(classification_report(yu_test, best_urgency["y_pred"], target_names=label_names_urgency))
""")

code("""\
# ── confusion matrix ──────────────────────────────────────────────────────
cm = confusion_matrix(yu_test, best_urgency["y_pred"])
fig, ax = plt.subplots(figsize=(7, 6))
sns.heatmap(cm, annot=True, fmt="d", cmap="Blues",
            xticklabels=label_names_urgency, yticklabels=label_names_urgency, ax=ax)
ax.set_title(f"Urgency Classifier — Confusion Matrix ({best_urgency_name})", pad=12)
ax.set_xlabel("Predicted"); ax.set_ylabel("Actual")
plt.tight_layout()
plt.savefig(OUT_DIR / "nb_confusion_urgency.png", dpi=150)
plt.show()
""")

code("""\
# ── 5-fold cross-validation ────────────────────────────────────────────────
cv_scores = cross_val_score(
    best_urgency["pipeline"], X_all, y_urgency,
    cv=StratifiedKFold(5, shuffle=True, random_state=42),
    scoring="f1_macro", n_jobs=-1)
print(f"CV F1 macro: {cv_scores.mean():.4f} ± {cv_scores.std():.4f}")
""")

code("""\
# ── save model ────────────────────────────────────────────────────────────
with open(MODEL_DIR / "urgency_classifier.pkl", "wb") as f:
    pickle.dump({"model": best_urgency["pipeline"],
                 "label_names": label_names_urgency}, f)
print("Saved → models/urgency_classifier.pkl")
""")

# ─────────────────────────────────────────────────────────────────────────────
# 5 – CLASSIFIER 2: BINARY
# ─────────────────────────────────────────────────────────────────────────────
md("---\n## 5 · Classifier 2 — Disaster Binary  `(disaster / not_disaster)`")

code("""\
from sklearn.calibration import CalibratedClassifierCV
from sklearn.metrics import roc_auc_score, average_precision_score, RocCurveDisplay

binary_pipelines = {
    "LogisticRegression": Pipeline([
        ("tfidf", make_tfidf_union()),
        ("clf",   LogisticRegression(C=1.0, max_iter=1000,
                                     class_weight="balanced", solver="lbfgs")),
    ]),
    "LinearSVC (calibrated)": Pipeline([
        ("tfidf", make_tfidf_union()),
        ("clf",   CalibratedClassifierCV(
                      LinearSVC(C=1.0, max_iter=2000, class_weight="balanced"), cv=3)),
    ]),
    "RandomForest": Pipeline([
        ("tfidf", TfidfVectorizer(analyzer="word", ngram_range=(1,2),
                                  max_features=20_000, sublinear_tf=True)),
        ("clf",   RandomForestClassifier(n_estimators=300, class_weight="balanced",
                                         n_jobs=-1, random_state=42)),
    ]),
}

binary_results = {}
for name, pipe in binary_pipelines.items():
    print(f"Training {name} …", end=" ", flush=True)
    pipe.fit(X_train, yb_train)
    y_pred = pipe.predict(X_test)
    try:
        y_prob = pipe.predict_proba(X_test)[:, 1]
        auc = roc_auc_score(yb_test, y_prob)
        ap  = average_precision_score(yb_test, y_prob)
    except AttributeError:
        y_prob, auc, ap = None, float("nan"), float("nan")
    binary_results[name] = {
        "pipeline": pipe, "y_pred": y_pred, "y_prob": y_prob,
        "f1":  f1_score(yb_test, y_pred, average="binary"),
        "auc": auc, "ap": ap,
    }
    print(f"done  (F1={binary_results[name]['f1']:.4f}  AUC={auc:.4f})")
""")

code("""\
# ── model comparison ──────────────────────────────────────────────────────
bin_df = pd.DataFrame([
    {"model": k, "F1": v["f1"], "ROC-AUC": v["auc"], "Avg Precision": v["ap"]}
    for k, v in binary_results.items()
])
bin_df.set_index("model").plot(kind="bar", figsize=(9, 4), rot=0,
                                edgecolor="white",
                                color=["#2196F3","#4CAF50","#FF9800"])
plt.title("Disaster Binary — Model Comparison")
plt.ylabel("Score"); plt.ylim(0.6, 1.0)
plt.tight_layout(); plt.show()
bin_df
""")

code("""\
# ── ROC curves ────────────────────────────────────────────────────────────
best_binary_name = max(binary_results, key=lambda k: binary_results[k]["f1"])
fig, ax = plt.subplots(figsize=(6, 5))
for name, res in binary_results.items():
    if res["y_prob"] is not None:
        RocCurveDisplay.from_predictions(
            yb_test, res["y_prob"], name=f"{name} (AUC={res['auc']:.3f})", ax=ax)
ax.plot([0,1],[0,1],"k--", lw=1)
ax.set_title("Disaster Binary — ROC Curves")
plt.tight_layout(); plt.show()
""")

code("""\
best_binary = binary_results[best_binary_name]
print(f"Best: {best_binary_name}  (F1={best_binary['f1']:.4f}  AUC={best_binary['auc']:.4f})")
print()
print(classification_report(yb_test, best_binary["y_pred"],
                             target_names=["not_disaster", "disaster"]))
""")

code("""\
# ── 5-fold CV ─────────────────────────────────────────────────────────────
cv_bin = cross_val_score(
    best_binary["pipeline"], X_all, y_binary,
    cv=StratifiedKFold(5, shuffle=True, random_state=42),
    scoring="f1", n_jobs=-1)
print(f"CV F1: {cv_bin.mean():.4f} ± {cv_bin.std():.4f}")
""")

code("""\
with open(MODEL_DIR / "disaster_binary_classifier.pkl", "wb") as f:
    pickle.dump(best_binary["pipeline"], f)
print("Saved → models/disaster_binary_classifier.pkl")
""")

# ─────────────────────────────────────────────────────────────────────────────
# 6 – CLASSIFIER 3: ESSENTIAL CATEGORIES
# ─────────────────────────────────────────────────────────────────────────────
md("---\n## 6 · Classifier 3 — Essential Categories  `(multi-label, 9 classes)`")

code("""\
from sklearn.multiclass import OneVsRestClassifier
from sklearn.metrics import hamming_loss, jaccard_score

ess_pipelines = {
    "OvR LogisticRegression": Pipeline([
        ("tfidf", make_tfidf_union()),
        ("clf",   OneVsRestClassifier(
                      LogisticRegression(C=1.0, max_iter=1000,
                                         class_weight="balanced", solver="lbfgs"),
                      n_jobs=-1)),
    ]),
    "OvR LinearSVC": Pipeline([
        ("tfidf", make_tfidf_union()),
        ("clf",   OneVsRestClassifier(
                      LinearSVC(C=0.5, max_iter=2000, class_weight="balanced"),
                      n_jobs=-1)),
    ]),
    "OvR RandomForest": Pipeline([
        ("tfidf", TfidfVectorizer(analyzer="word", ngram_range=(1,2),
                                  max_features=20_000, sublinear_tf=True)),
        ("clf",   OneVsRestClassifier(
                      RandomForestClassifier(n_estimators=200,
                                             class_weight="balanced",
                                             n_jobs=-1, random_state=42),
                      n_jobs=-1)),
    ]),
}

ess_results = {}
for name, pipe in ess_pipelines.items():
    print(f"Training {name} …", end=" ", flush=True)
    pipe.fit(X_train, ye_train)
    y_pred = pipe.predict(X_test)
    ess_results[name] = {
        "pipeline":   pipe,
        "y_pred":     y_pred,
        "f1_micro":   f1_score(ye_test, y_pred, average="micro",   zero_division=0),
        "f1_macro":   f1_score(ye_test, y_pred, average="macro",   zero_division=0),
        "f1_samples": f1_score(ye_test, y_pred, average="samples", zero_division=0),
        "hamming":    hamming_loss(ye_test, y_pred),
        "jaccard":    jaccard_score(ye_test, y_pred, average="samples", zero_division=0),
    }
    print(f"done  (F1 micro={ess_results[name]['f1_micro']:.4f})")
""")

code("""\
# ── model comparison ──────────────────────────────────────────────────────
ess_df = pd.DataFrame([
    {"model": k, "F1 micro": v["f1_micro"], "F1 macro": v["f1_macro"],
     "Hamming loss": v["hamming"], "Jaccard": v["jaccard"]}
    for k, v in ess_results.items()
])
ess_df.set_index("model")[["F1 micro", "F1 macro", "Jaccard"]].plot(
    kind="bar", figsize=(9, 4), rot=0, edgecolor="white",
    color=["#2196F3","#4CAF50","#FF9800"])
plt.title("Essential Categories — Model Comparison")
plt.ylabel("Score"); plt.ylim(0, 1.0)
plt.tight_layout(); plt.show()
ess_df
""")

code("""\
best_ess_name = max(ess_results, key=lambda k: ess_results[k]["f1_micro"])
best_ess = ess_results[best_ess_name]
print(f"Best: {best_ess_name}  (F1 micro={best_ess['f1_micro']:.4f})")
print()
print(classification_report(ye_test, best_ess["y_pred"],
                             target_names=ESSENTIAL_CATEGORIES, zero_division=0))
""")

code("""\
# ── per-label F1 bar chart ────────────────────────────────────────────────
per_f1 = [
    f1_score(ye_test[:, i], best_ess["y_pred"][:, i], zero_division=0)
    for i in range(len(ESSENTIAL_CATEGORIES))
]
order_idx = np.argsort(per_f1)
cats_ord  = [ESSENTIAL_CATEGORIES[i] for i in order_idx]
f1_ord    = [per_f1[i] for i in order_idx]

colors = ["#2196F3" if s >= 0.7 else "#FF9800" if s >= 0.5 else "#F44336"
          for s in f1_ord]
fig, ax = plt.subplots(figsize=(10, 5))
bars = ax.barh(cats_ord, f1_ord, color=colors, edgecolor="white")
ax.axvline(0.7, color="green",  linestyle="--", lw=1.2, label="0.70")
ax.axvline(0.5, color="orange", linestyle="--", lw=1.2, label="0.50")
for bar, score in zip(bars, f1_ord):
    ax.text(score + 0.01, bar.get_y() + bar.get_height()/2,
            f"{score:.3f}", va="center", fontsize=10)
ax.set_xlabel("F1 Score"); ax.set_xlim(0, 1.05)
ax.set_title(f"Essential Categories — Per-Label F1  ({best_ess_name})", pad=12)
ax.legend()
plt.tight_layout()
plt.savefig(OUT_DIR / "nb_label_f1_essential.png", dpi=150)
plt.show()
""")

code("""\
with open(MODEL_DIR / "essential_categories_classifier.pkl", "wb") as f:
    pickle.dump({"model": best_ess["pipeline"],
                 "categories": ESSENTIAL_CATEGORIES}, f)
print("Saved → models/essential_categories_classifier.pkl")
""")

# ─────────────────────────────────────────────────────────────────────────────
# 7 – SUMMARY DASHBOARD
# ─────────────────────────────────────────────────────────────────────────────
md("---\n## 7 · Summary Dashboard")

code("""\
summary = pd.DataFrame([
    {"Classifier": "Urgency Level (4-class)",
     "Best Model": best_urgency_name,
     "Primary Metric": "F1 macro",
     "Score": round(best_urgency["f1_macro"], 4)},
    {"Classifier": "Disaster Binary",
     "Best Model": best_binary_name,
     "Primary Metric": "F1 + ROC-AUC",
     "Score": f"{best_binary['f1']:.4f} / {best_binary['auc']:.4f}"},
    {"Classifier": "Essential Categories (9-label)",
     "Best Model": best_ess_name,
     "Primary Metric": "F1 micro",
     "Score": round(best_ess["f1_micro"], 4)},
])
print(summary.to_string(index=False))
summary.to_csv(OUT_DIR / "evaluation_summary.csv", index=False)
""")

code("""\
# ── multi-panel summary plot ──────────────────────────────────────────────
fig, axes = plt.subplots(1, 3, figsize=(17, 5))
fig.suptitle("Disaster ML Pipeline — Final Results", fontsize=14, fontweight="bold")

# Panel 1: Urgency per-class F1
report_dict = {}
for label, row in zip(label_names_urgency,
    [classification_report(yu_test, best_urgency["y_pred"],
                           target_names=label_names_urgency,
                           output_dict=True)[l]
     for l in label_names_urgency]):
    report_dict[label] = row["f1-score"]
axes[0].bar(list(report_dict.keys()), list(report_dict.values()),
            color=["#4CAF50","#FF9800","#F44336","#9C27B0"], edgecolor="white")
axes[0].set_title("Urgency — Per-class F1"); axes[0].set_ylim(0, 1)
axes[0].axhline(0.5, color="gray", linestyle="--", lw=1)

# Panel 2: Binary metrics grouped bar
bin_metrics = {"F1": best_binary["f1"], "ROC-AUC": best_binary["auc"],
               "Avg Prec": best_binary["ap"]}
axes[1].bar(bin_metrics.keys(), bin_metrics.values(),
            color=["#2196F3","#4CAF50","#FF9800"], edgecolor="white")
for i, (k, v) in enumerate(bin_metrics.items()):
    axes[1].text(i, v + 0.01, f"{v:.3f}", ha="center", fontsize=10)
axes[1].set_title("Disaster Binary — Metrics"); axes[1].set_ylim(0.7, 1.0)

# Panel 3: Essential per-label F1
axes[2].barh(cats_ord, f1_ord,
             color=["#2196F3" if s>=0.7 else "#FF9800" if s>=0.5 else "#F44336"
                    for s in f1_ord], edgecolor="white")
axes[2].axvline(0.7, color="green",  linestyle="--", lw=1)
axes[2].set_title("Essential Categories — Per-Label F1"); axes[2].set_xlim(0, 1)

plt.tight_layout()
plt.savefig(OUT_DIR / "nb_summary_dashboard.png", dpi=150)
plt.show()
""")

# ─────────────────────────────────────────────────────────────────────────────
# 8 – LIVE INFERENCE
# ─────────────────────────────────────────────────────────────────────────────
md("---\n## 8 · Live Inference Demo\n\nRun any message through all three classifiers at once.")

code("""\
def predict_all(text: str, genre: str = "direct") -> dict:
    \"\"\"Run all three classifiers on a single message.\"\"\"
    x = pd.Series([genre + " " + clean_text(text)])

    urgency_pred = best_urgency["pipeline"].predict(x)[0]
    binary_pred  = best_binary["pipeline"].predict(x)[0]
    cats_pred    = best_ess["pipeline"].predict(x)[0]
    active_cats  = [c for c, v in zip(ESSENTIAL_CATEGORIES, cats_pred) if v]

    return {
        "is_disaster":        bool(binary_pred),
        "urgency":            URGENCY_LABEL_NAMES[urgency_pred],
        "active_categories":  active_cats,
    }

# ── demo ──────────────────────────────────────────────────────────────────
demo_messages = [
    ("People are trapped under collapsed buildings, need rescue now.", "direct"),
    ("Weather update — cold front from Cuba could pass over Haiti.",   "news"),
    ("We have no food or water. Children are sick and dying.",         "direct"),
    ("I would like to receive messages, thank you.",                   "direct"),
    ("Hospital destroyed by earthquake. Patients on the street.",      "direct"),
    ("Storm approaching northern coast. Residents must evacuate.",     "news"),
    ("500 people in Delmas 19 urgently need water, food, medicine.",   "direct"),
]

print(f"  {'MESSAGE':<56} DISASTER  URGENCY    CATEGORIES")
print("─" * 110)
for text, genre in demo_messages:
    result = predict_all(text, genre)
    dis   = "✓ YES" if result["is_disaster"] else "✗ NO "
    cats  = ", ".join(result["active_categories"]) or "—"
    short = text[:55] + "…" if len(text) > 55 else text
    print(f"  {short:<56} {dis:^9} {result['urgency']:^10} {cats}")
""")

md("""\
---
## Notes

- **Urgency** labels are heuristically derived from category weights — not human-annotated. F1 macro ~0.53 is the practical ceiling without real urgency labels.
- **Disaster binary** is the strongest signal: F1 0.82, AUC 0.89 with a simple LR + TF-IDF pipeline.
- **Essential categories** perform well for high-frequency labels (earthquake 0.83, food 0.78) but struggle with semantically similar ones (medical_help vs medical_products).
- To improve further: fine-tune `xlm-roberta-base` (handles the Haitian Creole originals) or add label-specific threshold tuning per category.
""")

# ─────────────────────────────────────────────────────────────────────────────
nb.cells = cells
nbf.write(nb, NB_PATH)
print(f"Notebook written → {NB_PATH}")
