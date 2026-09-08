# 🎯 QUICK REFERENCE - PRESENTATION FLOW

## ⚡ 30-MINUTE PRESENTATION PATH

```
1. HOME > Overview (2min)              "26K messages, 3 tasks, ML+DL"
2. HOME > Dataset (2min)               "Class imbalance, 15-20 words"
3. EDA > Distributions (2min)          "Length patterns, categories"
4. EDA > Patterns (2min)               "{food,water,shelter}, k=2"
5. HOME > Model Strategies (4min)      "Weights, thresholds, 52→83%"
6. MODELS > Test Models (3min) ⭐      "LIVE DEMO - 3 messages"
7. MODELS > Performance (2min)         "83-87% F1, ML vs DL"
8. MODELS > Evaluation (2min)          "89% recall critical"
9. HOME > Key Findings (2min)          "Bundle, clusters, Myanmar"
10. INSIGHTS > Conclusions (3min)      "KDD complete, limitations"
11. Q&A (5min)                         "Synthetic labels, deployment"
```

## 🎬 DEMO MESSAGES (Copy-Paste Ready)

```
1. we need water and food, children are dying
   → CRITICAL, DISASTER, {death, water, food, medical_help} — 100% confidence

2. People are trapped under collapsed buildings, need rescue teams urgently
   → CRITICAL, DISASTER, {medical_help, death, earthquake, search_and_rescue} — 99%

3. Hospital overwhelmed with earthquake victims, running out of medical supplies
   → CRITICAL, DISASTER, {medical_help, medical_products, earthquake} — 94%

4. The president gave a speech about the economy today
   → LOW, NOT DISASTER, {} — 86% confidence

5. ငလျင်ကြောင့် ဆေးရုံ လုံးဝပျက်စီးသွားခဲ့သည်။ လူနာများ လမ်းပေါ်ရောက်နေကြသည်။
   → Myanmar (auto-translated) → Medical Emergency

6. ကျွန်တော်တို့ အစားအသောက် လိုအပ်ပါတယ်
   → Myanmar: "We need food" (auto-translated)
```

## ✅ FINAL CHECKLIST (5 min before)

- [ ] Server running: `uvicorn app:app --reload`
- [ ] Browser open: http://localhost:8000
- [ ] Test 1 message classification
- [ ] Do Not Disturb ON
- [ ] Font size large enough
- [ ] Close other tabs
- [ ] PRESENTATION_SCRIPT.md open in second screen

## 🎤 MEMORIZE THESE

**OPENING:** "Imagine an earthquake—thousands of messages. How do you prioritize? Our system solves this."

**KEY STAT:** "52% → 83% F1-Macro using synthetic labels with quantile thresholds"

**DEMO MOMENT:** "Let me show you live classification..."

**CLOSING:** "Complete KDD pipeline, 83-87% F1, production-ready. Data mining saves lives."

## 💡 IF THINGS GO WRONG

- Demo fails → Use backup screenshots
- Time short → Skip EDA Visualizations
- Questions hard → "Great question, let me show you in the code/notebook"

**YOU'VE GOT THIS! 🚀**
