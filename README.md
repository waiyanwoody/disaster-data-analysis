# Disaster Data Analysis and Predictive Mining

A complete machine learning pipeline for classifying disaster response messages using NLP and text mining techniques. Built for IS-212 Data Mining course.

[![Python](https://img.shields.io/badge/Python-3.8+-3776AB?style=flat&logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-009688?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![PyTorch](https://img.shields.io/badge/PyTorch-2.0+-EE4C2C?style=flat&logo=pytorch&logoColor=white)](https://pytorch.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat)](LICENSE)

## 📋 Overview

This project develops a complete ML pipeline for disaster response message classification, covering the full KDD process from data preparation to model deployment with an interactive web interface.

### Key Features

- **Three Classification Tasks:**
  - **Urgency Level** (4-class): Low, Medium, High, Critical
  - **Disaster Binary**: Disaster vs Non-Disaster
  - **Essential Categories** (10-label multi-label): medical_help, food, water, shelter, etc.

- **Two Model Architectures:**
  - **Classical ML**: TF-IDF + LogisticRegression/CalibratedSVC
  - **Deep Learning**: DistilBERT (distilbert-base-uncased, 66M params)

- **Interactive Web Interface:**
  - Live prediction testing
  - Performance dashboards
  - EDA visualizations
  - Model comparison charts

- **REST API:**
  - FastAPI endpoints for all models
  - Myanmar-English auto-translation
  - JSON response format

## 🎯 Results

| Model | Task | F1 Score | Accuracy |
|-------|------|----------|----------|
| **DistilBERT** | Binary | **84.9%** | 82.5% |
| **DistilBERT** | Urgency (4-class) | **82.3%** (macro) | 81.1% |
| **DistilBERT** | Essential (10-label) | **75.0%** (micro) | — |
| TF-IDF | Binary | 82.8% | 79.1% |
| TF-IDF | Urgency (4-class) | 70.1% (macro) | 76.2% |
| TF-IDF | Essential (10-label) | 70.5% (micro) | — |

## 🗂️ Project Structure

```
kiro-datamining/
├── app.py                          # FastAPI server
├── src/
│   └── translation.py              # Myanmar-English translation
├── data/
│   ├── disaster_messages.csv       # 26,180 messages
│   └── disaster_categories.csv     # 36 binary category labels
├── models/
│   ├── ML/                         # TF-IDF + Classical ML models
│   │   ├── urgency_classifier.pkl
│   │   ├── disaster_binary_classifier.pkl
│   │   └── essential_categories_classifier.pkl
│   └── DL/                         # DistilBERT fine-tuned models
│       ├── urgency/
│       ├── binary/
│       └── essential/
├── notebook/
│   └── final/
│       ├── improved_model_training_synthetic.ipynb    # TF-IDF training
│       ├── transformer_training_synthetic.ipynb       # DistilBERT training
│       └── descriptive_mining.ipynb                   # EDA & Association Rules
├── outputs/                        # Evaluation charts & diagrams
├── website/                        # Frontend SPA
│   ├── index.html
│   ├── css/
│   ├── js/
│   │   ├── app.js                  # Router & page logic
│   │   ├── api.js                  # API client
│   │   ├── data.js                 # Project data
│   │   └── charts.js               # Chart.js configs
│   ├── components/                 # Web components
│   └── images/
└── README.md
```

## 🚀 Setup

### Prerequisites

- Python 3.8 or higher
- pip (Python package manager)
- 8GB+ RAM (for DistilBERT models)
- macOS / Linux / Windows

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/kiro-datamining.git
cd kiro-datamining
```

### 2. Create Virtual Environment

```bash
# Create virtual environment
python3 -m venv venv

# Activate virtual environment
# macOS/Linux:
source venv/bin/activate

# Windows:
venv\Scripts\activate
```

### 3. Install Dependencies

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

**Core Dependencies:**
- `fastapi` - Web framework
- `uvicorn` - ASGI server
- `torch` - PyTorch (MPS/CPU)
- `transformers` - Hugging Face transformers
- `scikit-learn` - ML algorithms
- `pandas`, `numpy` - Data processing
- `deep_translator` - Myanmar translation
- `python-dotenv` - Environment variables

### 4. Download Dataset (Optional)

If not included in the repo:

```bash
# Download from Kaggle
kaggle datasets download -d sidharth178/disaster-response-messages
unzip disaster-response-messages.zip -d data/
```

Or download manually from: https://www.kaggle.com/datasets/sidharth178/disaster-response-messages

### 5. Download Models (Optional)

If models are not in the repo (due to size):

```bash
# ML models are small and included in repo
# DL models (DistilBERT) - download if needed:
# The app will auto-download from Hugging Face on first run
```

## 🏃 Run

### Start the Server

```bash
# Default (localhost:8000)
python3 -m uvicorn app:app --host 0.0.0.0 --port 8000

# With auto-reload (development)
python3 -m uvicorn app:app --host 0.0.0.0 --port 8000 --reload

# Custom port
python3 -m uvicorn app:app --host 0.0.0.0 --port 3000
```

### Access the Website

- **Local:** http://localhost:8000
- **Network:** http://192.168.x.x:8000 (replace with your IP)

### API Endpoints

#### ML Models (TF-IDF)

```bash
# Urgency
curl -X POST http://localhost:8000/ml/predict/urgency \
  -H "Content-Type: application/json" \
  -d '{"message": "Hospital destroyed, need medical help urgently", "genre": "direct"}'

# Binary
curl -X POST http://localhost:8000/ml/predict/binary \
  -H "Content-Type: application/json" \
  -d '{"message": "Earthquake hits coastal area", "genre": "news"}'

# Essential Categories
curl -X POST http://localhost:8000/ml/predict/essential \
  -H "Content-Type: application/json" \
  -d '{"message": "Need food and water for 500 people", "genre": "direct"}'

# All predictions
curl -X POST http://localhost:8000/ml/predict/all \
  -H "Content-Type: application/json" \
  -d '{"message": "Flood victims need shelter", "genre": "direct"}'
```

#### DL Models (DistilBERT)

Replace `/ml/` with `/dl/` in the above URLs:

```bash
curl -X POST http://localhost:8000/dl/predict/urgency \
  -H "Content-Type: application/json" \
  -d '{"message": "Hospital destroyed, need medical help urgently", "genre": "direct"}'
```

## 📊 Training Notebooks

Run Jupyter notebooks to retrain models:

```bash
# Start Jupyter
jupyter notebook

# Navigate to:
# notebook/final/improved_model_training_synthetic.ipynb     (TF-IDF)
# notebook/final/transformer_training_synthetic.ipynb        (DistilBERT)
# notebook/final/descriptive_mining.ipynb                    (EDA)
```

## 🔧 Configuration

### Environment Variables (Optional)

Create `.env` file:

```bash
# Hugging Face token (optional, for private models)
HF_TOKEN=your_huggingface_token

# Model paths (optional, defaults to models/DL/)
DL_MODEL_DIR=models/DL

# Device (optional, auto-detected)
DEVICE=mps  # or cuda, cpu
```

## 🎨 Website Features

### Pages

1. **Home**
   - Overview
   - Dataset Summary (2-column CSV preview)
   - Key Findings
   - About Models (with technical details)

2. **EDA**
   - Data Distributions (15 charts)
   - Patterns & Correlations (association rules, heatmaps, word clouds)
   - Visualizations (clustering, t-SNE)

3. **Model Testing**
   - Live prediction interface
   - 8 demo templates
   - Performance metrics
   - Evaluation dashboards (confusion matrices, F1 charts)

4. **Insights**
   - 9 key discoveries
   - Important patterns
   - Conclusions
   - Limitations & Future Work

### Tech Stack

- **Frontend:** Vanilla JS, TailwindCSS, Chart.js, Lucide Icons, Preline UI
- **Backend:** FastAPI, PyTorch, Transformers, scikit-learn
- **Dark Mode:** System preference + manual toggle

## 📈 Model Details

### Urgency Level (4-class)

- **Labels:** Low (0), Medium (1), High (2), Critical (3)
- **Method:** Synthetic labels from weighted category scoring + percentile thresholds
- **Weights:** death=4, medical=3, water/food=2, transport=1, etc.
- **Thresholds:** Score 0→Low, 1-3→Medium, 4-6→High, 7+→Critical

### Disaster Binary

- **Labels:** Non-Disaster (0), Disaster (1)
- **Target:** "related" category (75% disaster, 25% non-disaster)
- **Optimization:** CalibratedSVC + threshold tuning (0.5 → ~0.41)

### Essential Categories (10-label multi-label)

- **Labels:** medical_help, medical_products, death, floods, storm, earthquake, water, food, shelter, aid_related
- **Method:** Per-label threshold optimization, per-label C tuning
- **Removed:** 3 rare categories (search_and_rescue, transport, missing_people) <1% prevalence

## 🧪 Testing

```bash
# Test API endpoints
python3 -m pytest tests/

# Test models
python3 -m pytest tests/test_models.py

# Manual test via curl (see API Endpoints section)
```

## 📦 Deployment

### Docker (Optional)

```dockerfile
FROM python:3.10-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
```

```bash
docker build -t disaster-ml .
docker run -p 8000:8000 disaster-ml
```

## 📚 References

- **Dataset:** [Disaster Response Messages](https://www.kaggle.com/datasets/sidharth178/disaster-response-messages) (Figure Eight / Appen)
- **Model:** [DistilBERT](https://huggingface.co/distilbert-base-uncased) (Hugging Face)
- **Textbook:** Han, J., Kamber, M., Pei, J. *Data Mining: Concepts and Techniques*. 4th Ed.

## 🤝 Contributing

This is a course project. For educational purposes only.

## 📝 License

MIT License - see LICENSE file

## 👥 Authors

- Wai Yan Tun - IS-212 Data Mining Project

## 🙏 Acknowledgments

- Figure Eight / Appen for the dataset
- Hugging Face for transformer models
- IS-212 instructors and TAs

---

**Built with ❤️ for IS-212 Data Mining**