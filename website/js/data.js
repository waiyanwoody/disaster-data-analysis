// ── Project Data ──────────────────────────────────────────────────
const PROJECT = {
    title: "Disaster Data Analysis and Predictive Mining",
    subtitle: "Data Mining Project — IS-212",
    description: "Machine learning pipeline for classifying disaster response messages using NLP and text mining techniques.",

    dataset: {
        name: "Disaster Response Messages",
        source: "Figure Eight / Appen",
        totalMessages: 26180,
        categories: 36,
        genres: ["news", "direct", "social"],
        features: ["id", "message", "original", "genre"],
        samples: [
            { message: "Weather update - a cold front from Cuba that could pass over Haiti", genre: "news" },
            { message: "Is the Hurricane over or is it not over", genre: "social" },
            { message: "We need food and water in Delmas 75", genre: "direct" },
            { message: "Hospital completely destroyed by earthquake", genre: "direct" },
            { message: "Government announces new relief fund", genre: "news" },
        ],
    },

    preprocessing: [
        { step: "Data Integration", detail: "Merge messages.csv and categories.csv on id", icon: "🔗" },
        { step: "Deduplication", detail: "Remove duplicate entries by id", icon: "🗑️" },
        { step: "Category Parsing", detail: "Parse 'category-1;category-0' format into binary columns", icon: "📋" },
        { step: "Text Cleaning", detail: "Lowercase, remove URLs, special characters, extra whitespace", icon: "🧹" },
        { step: "Noise Removal", detail: "Drop columns: related, request, offer, direct_report, child_alone, tools, shops", icon: "❌" },
        { step: "Feature Engineering", detail: "Create urgency_level (4-class), is_disaster (binary), aid_related flags", icon: "⚙️" },
        { step: "Rare Category Removal", detail: "Remove missing_people (86.9:1), search_and_rescue (35.2:1), transport (20.8:1)", icon: "📉" },
    ],

    models: {
        ml: {
            name: "TF-IDF + Classical ML",
            description: "Term Frequency-Inverse Document Frequency vectorization with Logistic Regression and Calibrated SVC",
            urgency: {
                name: "Urgency Classifier",
                type: "LogisticRegression",
                features: "TF-IDF (word 1-3, char 2-6)",
                f1_macro: 0.7010,
                accuracy: 0.7620,
            },
            binary: {
                name: "Disaster Binary",
                type: "CalibratedClassifierCV(LinearSVC)",
                features: "TF-IDF (word 1-3, char 2-6)",
                f1: 0.8268,
                accuracy: 0.7930,
                recall: 0.8890,
                precision: 0.7728,
            },
            essential: {
                name: "Essential Categories",
                type: "Per-label CalibratedClassifierCV",
                features: "TF-IDF (word 1-3, char 2-6)",
                f1_micro: 0.6991,
                f1_macro: 0.5987,
                hamming_loss: 0.0578,
                jaccard: 0.3652,
                labels: 13,
            },
        },
        dl: {
            name: "DistilBERT Transformer",
            description: "Fine-tuned DistilBERT (66M params) for sequence classification",
            urgency: {
                name: "Urgency Classifier",
                type: "DistilBertForSequenceClassification",
                f1_macro: 0.8228,
                accuracy: 0.8579,
                epochs: 3,
                lr: "2e-5",
            },
            binary: {
                name: "Disaster Binary",
                type: "DistilBertForSequenceClassification",
                f1: 0.8491,
                accuracy: 0.8252,
                recall: 0.8842,
                precision: 0.8166,
                epochs: 3,
                lr: "2e-5",
            },
            essential: {
                name: "Essential Categories",
                type: "DistilBertForSequenceClassification",
                f1_micro: 0.7502,
                f1_macro: 0.7103,
                hamming_loss: 0.0545,
                jaccard: 0.3731,
                labels: 10,
                epochs: 3,
                lr: "2e-5",
            },
        },
    },

    clustering: {
        optimalK: 2,
        methods: ["K-Means", "Agglomerative (Ward)", "DBSCAN"],
        metrics: {
            silhouette: 0.1398,
            calinski_harabasz: 1850.5,
            davies_bouldin: 1.82,
        },
    },

    association: {
        minSupport: 0.05,
        minConfidence: 0.3,
        topRules: [
            { antecedent: "Medical Help", consequent: "Aid Related", confidence: 0.72, lift: 2.1 },
            { antecedent: "Food", consequent: "Water", confidence: 0.58, lift: 2.8 },
            { antecedent: "Shelter", consequent: "Food", confidence: 0.45, lift: 2.2 },
            { antecedent: "Storm", consequent: "Floods", confidence: 0.41, lift: 2.5 },
            { antecedent: "Death", consequent: "Medical Help", confidence: 0.38, lift: 1.9 },
        ],
        frequentItemsets: [
            { items: ["Aid Related"], support: 0.43 },
            { items: ["Food", "Water"], support: 0.12 },
            { items: ["Food", "Water", "Shelter"], support: 0.08 },
            { items: ["Medical Help"], support: 0.08 },
            { items: ["Storm", "Floods"], support: 0.07 },
            { items: ["Death"], support: 0.05 },
        ],
    },

    urgencyDistribution: {
        heuristic: { low: 12243, medium: 7370, high: 3858, critical: 2709 },
        synthetic: { low: 12936, medium: 5144, high: 4962, critical: 3138 },
    },

    categoryFrequency: {
        aid_related: 11283, food: 2917, storm: 2440, earthquake: 2452,
        shelter: 2308, floods: 2149, medical_help: 2081, water: 1669,
        infrastructure_related: 1640, medical_products: 1311, transport: 1199,
        death: 1192, other_aid: 1135,
    },

    genreDistribution: { news: 13300, direct: 10773, social: 2107 },

    costs: {
        ml: {
            training: {
                time_sec: 42,
                ram_gb: 1.2,
                note: "TF-IDF fit + 3 classifiers (LR, SVC×13)"
            },
            inference: {
                avg_ms: 18,
            },
            storage: {
                binary:   { label: "Binary Classifier",    size_mb: 5.4,  file: "disaster_binary_classifier.pkl" },
                essential:{ label: "Essential Categories", size_mb: 30.0, file: "essential_categories_classifier.pkl" },
                urgency:  { label: "Urgency Classifier",   size_mb: 6.1,  file: "urgency_classifier.pkl" },
            },
            total_mb: 41.5,
        },
        dl: {
            training: {
                time_sec: 3240,
                ram_gb: 6.4,
                note: "3 × DistilBERT fine-tunes, 3 epochs each"
            },
            inference: {
                avg_ms: 95,
            },
            storage: {
                binary:   { label: "Binary Classifier",    size_mb: 255, file: "transformer_binary/model.safetensors" },
                essential:{ label: "Essential Categories", size_mb: 255, file: "transformer_essential/model.safetensors" },
                urgency:  { label: "Urgency Classifier",   size_mb: 255, file: "transformer_urgency/model.safetensors" },
            },
            total_mb: 765,
        },
    },

    insights: [
        "Binary disaster classification achieved 84.9% F1 with 88.4% recall using DistilBERT",
        "Essential categories F1 improved from 0.687 to 0.699 via per-label threshold tuning",
        "Synthetic urgency labels outperform heuristic labels on content-aware scoring",
        "DistilBERT transformer reduces feature engineering overhead vs TF-IDF",
        "Co-occurrence analysis confirms {food, water, shelter} as core disaster need bundle",
        "Rare categories (missing_people, search_and_rescue, transport) hurt F1 due to extreme imbalance",
    ],
};
