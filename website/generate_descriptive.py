"""Generate descriptive mining visualizations for the website."""
import re, warnings
import numpy as np
import pandas as pd
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import seaborn as sns
from pathlib import Path

from sklearn.feature_extraction.text import TfidfVectorizer, CountVectorizer
from sklearn.cluster import KMeans, AgglomerativeClustering, DBSCAN
from sklearn.decomposition import TruncatedSVD
from sklearn.manifold import TSNE
from sklearn.metrics import silhouette_score
from mlxtend.frequent_patterns import apriori, association_rules

warnings.filterwarnings("ignore")
sns.set_theme(style="whitegrid", palette="muted")

ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = ROOT / "data"
OUT_DIR = ROOT / "website" / "images" / "descriptive"
OUT_DIR.mkdir(parents=True, exist_ok=True)

# ── Load data ─────────────────────────────────────────────────────
messages = pd.read_csv(DATA_DIR / "disaster_messages.csv")
categories = pd.read_csv(DATA_DIR / "disaster_categories.csv")
df = messages.merge(categories, on="id")

def clean_text(text):
    text = str(text).lower()
    text = re.sub(r"http\S+|www\S+", " ", text)
    text = re.sub(r"[^a-z0-9\s']", " ", text)
    return re.sub(r"\s+", " ", text).strip()

df["message_clean"] = df["message"].apply(clean_text)

# Parse categories from "category-1;category-0" format
cat_raw = df["categories"].str.split(";")
cat_expanded = cat_raw.apply(lambda x: {c.split("-")[0]: int(c.split("-")[1]) for c in x})
cat_df = pd.DataFrame(cat_expanded.tolist(), index=df.index)
df = pd.concat([df, cat_df], axis=1)
df.drop(columns=["categories"], inplace=True)

all_cats = cat_df.columns.tolist()
for c in all_cats:
    df[c] = df[c].astype(int)

print(f"Loaded {len(df)} messages, {len(all_cats)} categories")

# ── 1. Genre Distribution ────────────────────────────────────────
fig, ax = plt.subplots(figsize=(6, 3))
df["genre"].value_counts().plot(kind="barh", ax=ax, color=["#2196F3", "#4CAF50", "#FF9800"])
ax.set_title("Genre Distribution")
ax.set_xlabel("Count")
plt.tight_layout()
plt.savefig(OUT_DIR / "genre_distribution.png", dpi=150)
plt.close()
print("Saved genre_distribution.png")

# ── 2. Category Frequency ───────────────────────────────────────
fig, ax = plt.subplots(figsize=(14, 4))
cat_freq = df[all_cats].sum().sort_values(ascending=False)
colors = plt.cm.tab20(np.linspace(0, 1, len(cat_freq)))
cat_freq.plot(kind="bar", ax=ax, color=colors, edgecolor="white")
ax.set_title("Category Frequency Distribution")
ax.set_ylabel("Count")
plt.xticks(rotation=45, ha="right")
plt.tight_layout()
plt.savefig(OUT_DIR / "category_frequency.png", dpi=150)
plt.close()
print("Saved category_frequency.png")

# ── 3. Urgency Distribution (Heuristic vs Synthetic) ────────────
# Heuristic urgency
def urgency_heuristic(row):
    score = 0
    for c in ["aid_related", "request"]:
        if row.get(c, 0) == 1: score += 1
    for c in ["medical_help", "medical_products"]:
        if row.get(c, 0) == 1: score += 2
    for c in ["death"]:
        if row.get(c, 0) == 1: score += 2
    for c in ["shelter", "food", "water"]:
        if row.get(c, 0) == 1: score += 1
    return score

df["urgency_heuristic"] = df.apply(urgency_heuristic, axis=1)
bins_h = [-1, 0, 2, 4, 20]
labels_h = ["low", "medium", "high", "critical"]
df["urgency_h_level"] = pd.cut(df["urgency_heuristic"], bins=bins_h, labels=labels_h, include_lowest=True)

# Synthetic urgency
signals_critical = {"death", "rescue", "hospitals", "medical_help", "medical_products"}
signals_high = {"shelter", "food", "water", "infrastructure_related"}
signals_neg = {"offer", "direct_report", "tools", "shops"}

def urgency_synthetic(row):
    score = 0.0
    for c in signals_critical:
        if row.get(c, 0) == 1: score += 4.0
    for c in signals_high:
        if row.get(c, 0) == 1: score += 1.2
    score = min(score, 3.0)
    for c in all_cats:
        if row.get(c, 0) == 1 and c not in signals_critical and c not in signals_high and c not in signals_neg:
            score += 0.3
    for c in signals_neg:
        if row.get(c, 0) == 1: score -= 1.0
    if row.get("genre", "") == "direct": score += 1.5
    return max(score, 0.0)

df["urgency_synthetic"] = df.apply(urgency_synthetic, axis=1)
q33, q66, q90 = df["urgency_synthetic"].quantile([0.33, 0.66, 0.90])
bins_s = [-0.01, q33, q66, q90, 20]
labels_s = ["low", "medium", "high", "critical"]
df["urgency_s_level"] = pd.cut(df["urgency_synthetic"], bins=bins_s, labels=labels_s, include_lowest=True)

fig, axes = plt.subplots(1, 2, figsize=(12, 4))
order = ["low", "medium", "high", "critical"]
colors = ["#4CAF50", "#FFC107", "#FF9800", "#F44336"]

h_counts = df["urgency_h_level"].value_counts().reindex(order)
s_counts = df["urgency_s_level"].value_counts().reindex(order)

axes[0].bar(order, h_counts.values, color=colors, edgecolor="white")
axes[0].set_title("Heuristic Urgency Distribution")
axes[0].set_ylabel("Count")

axes[1].bar(order, s_counts.values, color=colors, edgecolor="white")
axes[1].set_title("Synthetic Urgency Distribution")
axes[1].set_ylabel("Count")

plt.tight_layout()
plt.savefig(OUT_DIR / "urgency_distribution.png", dpi=150)
plt.close()
print("Saved urgency_distribution.png")

# ── 4. Message Length Distribution ────────────────────────────────
df["msg_len"] = df["message_clean"].str.len()
fig, ax = plt.subplots(figsize=(8, 4))
ax.hist(df["msg_len"], bins=50, color="#2196F3", edgecolor="white")
ax.set_title("Message Length Distribution")
ax.set_xlabel("Character Count")
ax.set_ylabel("Frequency")
plt.tight_layout()
plt.savefig(OUT_DIR / "message_length.png", dpi=150)
plt.close()
print("Saved message_length.png")

# ── 5. TF-IDF + Association Rules ───────────────────────────────
# Create transaction matrix for top categories
top_cats = cat_freq.head(10).index.tolist()
txn = df[top_cats].clip(upper=1).astype(bool)

frequent_itemsets = apriori(txn, min_support=0.05, use_colnames=True)
rules = association_rules(frequent_itemsets, metric="lift", min_threshold=1.0, num_itemsets=len(frequent_itemsets))
rules_simple = rules[["antecedents", "consequents", "support", "confidence", "lift"]].copy()
rules_simple = rules_simple.sort_values("lift", ascending=False).head(20)

# Scatter plot: support vs confidence (size = lift)
top_rules = rules_simple.head(15).copy()
top_rules["rule"] = top_rules.apply(
    lambda r: f"{list(r['antecedents'])[0]} → {list(r['consequents'])[0]}", axis=1)

fig, axes = plt.subplots(1, 2, figsize=(16, 6))

scatter = axes[0].scatter(
    top_rules["support"], top_rules["confidence"],
    s=top_rules["lift"] * 100, alpha=0.7,
    c=top_rules["lift"], cmap="YlOrRd", edgecolors="gray"
)
axes[0].set_xlabel("Support")
axes[0].set_ylabel("Confidence")
axes[0].set_title("Association Rules: Support vs Confidence")
plt.colorbar(scatter, ax=axes[0], label="Lift")

# Bar chart of top rules by lift
axes[1].barh(top_rules["rule"], top_rules["lift"], color="#FF9800", edgecolor="white")
axes[1].set_xlabel("Lift")
axes[1].set_title("Top Association Rules by Lift")
axes[1].invert_yaxis()

plt.tight_layout()
plt.savefig(OUT_DIR / "association_rules.png", dpi=150)
plt.close()
print("Saved association_rules.png")

# ── 6. Co-occurrence Heatmap ─────────────────────────────────────
cooc = txn.T.dot(txn)
cooc_arr = cooc.to_numpy().copy()
np.fill_diagonal(cooc_arr, 0)
cooc = pd.DataFrame(cooc_arr, index=txn.columns, columns=txn.columns)

fig, ax = plt.subplots(figsize=(10, 8))
sns.heatmap(cooc, annot=True, fmt="d", cmap="YlOrRd", ax=ax, linewidths=0.5)
ax.set_title("Category Co-occurrence Heatmap")
plt.tight_layout()
plt.savefig(OUT_DIR / "cooccurrence_heatmap.png", dpi=150)
plt.close()
print("Saved cooccurrence_heatmap.png")

# ── 7. Clustering: Elbow + Silhouette ────────────────────────────
tfidf = TfidfVectorizer(max_features=5000, stop_words="english", ngram_range=(1, 2))
X_tfidf = tfidf.fit_transform(df["message_clean"])

svd = TruncatedSVD(n_components=50, random_state=42)
X_svd = svd.fit_transform(X_tfidf)

K_range = range(2, 11)
inertias, silhouettes = [], []

for k in K_range:
    km = KMeans(n_clusters=k, random_state=42, n_init=10, max_iter=300)
    labels = km.fit_predict(X_svd)
    inertias.append(km.inertia_)
    silhouettes.append(silhouette_score(X_svd, labels))

fig, axes = plt.subplots(1, 2, figsize=(12, 4))

axes[0].plot(list(K_range), inertias, "o-", color="#2196F3", lw=2)
axes[0].set_xlabel("Number of Clusters (k)")
axes[0].set_ylabel("Inertia")
axes[0].set_title("Elbow Method")
axes[0].axvline(x=2, color="red", linestyle="--", alpha=0.5, label="k=2")
axes[0].legend()

axes[1].plot(list(K_range), silhouettes, "s-", color="#4CAF50", lw=2)
axes[1].set_xlabel("Number of Clusters (k)")
axes[1].set_ylabel("Silhouette Score")
axes[1].set_title("Silhouette Analysis")
axes[1].axvline(x=2, color="red", linestyle="--", alpha=0.5, label="k=2")
axes[1].legend()

plt.tight_layout()
plt.savefig(OUT_DIR / "clustering_elbow.png", dpi=150)
plt.close()
print("Saved clustering_elbow.png")

# ── 8. K-Means Clustering + t-SNE ────────────────────────────────
km_final = KMeans(n_clusters=2, random_state=42, n_init=10)
df["cluster_km"] = km_final.fit_predict(X_svd)

sample_idx = np.random.RandomState(42).choice(len(X_svd), size=min(3000, len(X_svd)), replace=False)
tsne = TSNE(n_components=2, random_state=42, perplexity=30, max_iter=500)
X_tsne = tsne.fit_transform(X_svd[sample_idx])

fig, axes = plt.subplots(1, 2, figsize=(14, 5))

scatter = axes[0].scatter(X_tsne[:, 0], X_tsne[:, 1],
    c=df["cluster_km"].iloc[sample_idx], cmap="Set1", alpha=0.5, s=10)
axes[0].set_title("K-Means Clusters (t-SNE)")
axes[0].set_xlabel("t-SNE 1")
axes[0].set_ylabel("t-SNE 2")
plt.colorbar(scatter, ax=axes[0], label="Cluster")

# Genre coloring
genre_map = {"news": 0, "direct": 1, "social": 2}
genre_colors = df["genre"].iloc[sample_idx].map(genre_map).values
scatter2 = axes[1].scatter(X_tsne[:, 0], X_tsne[:, 1],
    c=genre_colors, cmap="Set2", alpha=0.5, s=10)
axes[1].set_title("Message Genre (t-SNE)")
axes[1].set_xlabel("t-SNE 1")
axes[1].set_ylabel("t-SNE 2")
cbar = plt.colorbar(scatter2, ax=axes[1], ticks=[0, 1, 2])
cbar.set_ticklabels(["news", "direct", "social"])

plt.tight_layout()
plt.savefig(OUT_DIR / "tsne_clusters.png", dpi=150)
plt.close()
print("Saved tsne_clusters.png")

# ── 9. Cluster Profile ───────────────────────────────────────────
cluster_profile = df.groupby("cluster_km")[all_cats].mean()

fig, ax = plt.subplots(figsize=(14, 6))
cluster_profile.T.plot(kind="bar", ax=ax, colormap="Set2", edgecolor="white")
ax.set_title("Category Distribution per Cluster (K-Means)")
ax.set_ylabel("Proportion")
ax.set_xlabel("")
plt.xticks(rotation=45, ha="right")
plt.legend(title="Cluster")
plt.tight_layout()
plt.savefig(OUT_DIR / "cluster_profile.png", dpi=150)
plt.close()
print("Saved cluster_profile.png")

print(f"\nAll visualizations saved to {OUT_DIR}")
