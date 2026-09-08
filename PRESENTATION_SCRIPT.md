# 🎯 PRESENTATION SCRIPT - 10 Minutes
**Disaster Response Classification System**

## ⏱️ TIMING BREAKDOWN (10 min total)

```
0:00 - 1:00   Overview + Problem Statement      (1 min)
1:00 - 2:30   Data + EDA highlights             (1.5 min)
2:30 - 4:30   Model Building Strategies (CORE)  (2 min)
4:30 - 7:00   LIVE DEMO - Test Models           (2.5 min)
7:00 - 8:30   Performance Results               (1.5 min)
8:30 - 10:00  Conclusions + Q&A                 (1.5 min)
```

---

## 🎬 SCRIPT

### 1. HOME > OVERVIEW (1 min)
**SAY:**
> "We built a disaster response message classification system. It takes a raw message and classifies it into urgency level, detects if it's disaster-related, and identifies resource needs like food, water, or medical help — across 26,216 real messages using both ML and Deep Learning."

**SHOW:** Overview stats, 3 task cards

---

### 2. EDA > DATA DISTRIBUTIONS + PATTERNS (1.5 min)
**NAVIGATE TO:** EDA > Data Distributions
**SAY:**
> "The dataset has severe class imbalance — 86.9:1 ratio. Longer messages tend to be more urgent."

**POINT TO:** `overview_length_genre_urgency.png`, `class_imbalance.png`

**NAVIGATE TO:** EDA > Patterns & Correlations
**SAY:**
> "Using Apriori, we found {food, water, shelter} always appear together — 78% confidence. K-means found 2 natural clusters: urgent vs routine."

**POINT TO:** `association_rule_network.png`, `genre_category_heatmap.png`

---

### 3. HOME > MODEL BUILDING STRATEGIES (2 min — CORE)
**NAVIGATE TO:** Home > Model Building Strategies
**SAY:**
> "The most important part — urgency labels don't exist in the dataset, so we created them synthetically. We assign weights: death=4, medical_help=3, water=2, transport=1. Sum the weights per message, then split by quantile thresholds — Q35, Q65, Q88 — into 4 urgency levels."

**POINT TO:** Weight table, quantile thresholds

**SAY:**
> "This improved F1-Macro from 52% to 83%. For Deep Learning, DistilBERT fine-tuning pushed it to 85.7%."

---

### 4. MODELS > TEST MODELS (2.5 min — LIVE DEMO ⭐)
**NAVIGATE TO:** Models > Test Models

**TYPE message 1:**
```
We need food and water urgently. Many people injured.
```
**SHOW RESULTS:** Urgency=HIGH, Binary=DISASTER, Essential={food, water, medical_help}
**SAY:** "Correctly classified as high urgency, disaster, with food/water/medical needs."

**TYPE message 2:**
```
Weather forecast shows rain tomorrow.
```
**SHOW RESULTS:** Urgency=LOW, Binary=NOT_DISASTER
**SAY:** "Non-disaster — just a weather report. Low urgency."

**TYPE message 3 (Myanmar):**
```
ကျွန်တော်တို့ အစားအသောက် လိုအပ်ပါတယ်
```
**SAY:** "Myanmar language — auto-translated then classified. This says 'We need food.'"

---

### 5. MODELS > PERFORMANCE METRICS (1.5 min)
**NAVIGATE TO:** Models > Performance Metrics
**SAY:**
> "ML baseline: Urgency 83.2%, Binary 84.9%, Essential 68.9%. DistilBERT adds 3-5% on top. The tradeoff — ML is instant, DL needs GPU at scale."

**POINT TO:** Comparison table, F1 chart

---

### 6. INSIGHTS > CONCLUSIONS (1 min)
**NAVIGATE TO:** Insights > Conclusions & Future Work
**SAY:**
> "We applied the full KDD pipeline: association rules, clustering, classification, deployment via FastAPI. Key limitations: synthetic labels lack human validation. Future work: active learning with responder feedback, geo-tagging, multi-modal analysis."

**SAY (closing):**
> "This shows how data mining techniques can directly save lives in real disaster scenarios. Thank you."

---

## ✅ PRE-PRESENTATION CHECKLIST
- [ ] Server running: `uvicorn app:app --reload`
- [ ] Browser open: http://localhost:8000
- [ ] Test 1 message classification before presenting
- [ ] Do Not Disturb ON
- [ ] 3 test messages ready to copy-paste

## 💬 DEMO MESSAGES (copy-paste ready)
```
1. we need water and food, children are dying
   → CRITICAL, DISASTER, {death, water, food, medical_help} — 100% confidence

2. The president gave a speech about the economy today
   → LOW, NOT DISASTER, {} — 86% confidence

3. ငလျင်ကြောင့် ဆေးရုံ လုံးဝပျက်စီးသွားခဲ့သည်။ လူနာများ လမ်းပေါ်ရောက်နေကြသည်။
   → Myanmar (auto-translated) → CRITICAL, DISASTER, medical emergency
```

## ❓ QUICK Q&A ANSWERS
- **Why synthetic labels?** No urgency annotations exist — domain-weighted scoring is the standard approach
- **Why DistilBERT?** 40% smaller, 60% faster than BERT, 97% performance retained
- **Class imbalance?** Balanced class weights + F1-Macro evaluation (not accuracy)
- **Myanmar support?** Azure Translator API, auto-detects language

## 🖼️ BEST IMAGES TO HIGHLIGHT
1. `overview_length_genre_urgency.png` — tells the full data story in one chart
2. `association_rule_network.png` — visually striking, great for patterns section
3. `wordcloud_urgency.png` — audience can instantly see urgency word differences
4. `class_imbalance.png` — makes the challenge obvious
5. `genre_category_heatmap.png` — shows which message sources carry which needs

**Good luck! 🚀**
