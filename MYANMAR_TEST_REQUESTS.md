# Myanmar Language — Example Test Requests

All examples use Myanmar (Burmese) script. When sent to any prediction endpoint,
`translate_to_english` detects the script automatically and translates before
running the model. The response will include a `translated_message` field showing
what the model actually processed.

---

## 1. Urgency — Critical

**Scenario:** People are trapped after an earthquake and need immediate rescue.

### ML endpoint
```bash
curl -X POST http://localhost:8000/ml/predict/urgency \
  -H "Content-Type: application/json" \
  -d '{
    "message": "ငလျင်ကြောင့် လူများသာသည်။ ချက်ချင်းကယ်ဆယ်ရေးလိုသည်။",
    "genre": "direct"
  }'
```

### DL endpoint
```bash
curl -X POST http://localhost:8000/dl/predict/urgency \
  -H "Content-Type: application/json" \
  -d '{
    "message": "ငလျင်ကြောင့် လူများသာသည်။ ချက်ချင်းကယ်ဆယ်ရေးလိုသည်။",
    "genre": "direct"
  }'
```

**English equivalent:** *"People are trapped due to the earthquake. Immediate rescue is needed."*

**Expected response snippet:**
```json
{
  "label": "critical",
  "confidence": 0.97,
  "translated_message": "People are trapped due to the earthquake. Immediate rescue is needed."
}
```

---

## 2. Binary — Disaster Related

**Scenario:** A flood has destroyed homes and people have nowhere to go.

### ML endpoint
```bash
curl -X POST http://localhost:8000/ml/predict/binary \
  -H "Content-Type: application/json" \
  -d '{
    "message": "ရေကြီးမှုကြောင့် အိမ်များပျက်စီးသည်။ လူများနေရာမဲ့နေသည်။",
    "genre": "direct"
  }'
```

### DL endpoint
```bash
curl -X POST http://localhost:8000/dl/predict/binary \
  -H "Content-Type: application/json" \
  -d '{
    "message": "ရေကြီးမှုကြောင့် အိမ်များပျက်စီးသည်။ လူများနေရာမဲ့နေသည်။",
    "genre": "direct"
  }'
```

**English equivalent:** *"Houses are destroyed due to flooding. People are left homeless."*

**Expected response snippet:**
```json
{
  "is_disaster": true,
  "confidence": 0.98,
  "translated_message": "Houses are destroyed due to flooding. People are left homeless."
}
```

---

## 3. Essential Categories — Food & Water

**Scenario:** 200 people in a shelter have no food or clean water.

### ML endpoint
```bash
curl -X POST http://localhost:8000/ml/predict/essential \
  -H "Content-Type: application/json" \
  -d '{
    "message": "ခိုလှုံရာတွင် လူ ၂၀၀ ရှိသည်။ အစားအစာနှင့် သောက်ရေမရှိပါ။",
    "genre": "direct"
  }'
```

### DL endpoint
```bash
curl -X POST http://localhost:8000/dl/predict/essential \
  -H "Content-Type: application/json" \
  -d '{
    "message": "ခိုလှုံရာတွင် လူ ၂၀၀ ရှိသည်။ အစားအစာနှင့် သောက်ရေမရှိပါ။",
    "genre": "direct"
  }'
```

**English equivalent:** *"There are 200 people in the shelter. There is no food or drinking water."*

**Expected response snippet:**
```json
{
  "active_categories": ["food", "water", "shelter", "aid_related"],
  "translated_message": "There are 200 people in the shelter. There is no food or drinking water."
}
```

---

## 4. Medical Emergency

**Scenario:** Children are sick and need medicine urgently.

### ML endpoint
```bash
curl -X POST http://localhost:8000/ml/predict/essential \
  -H "Content-Type: application/json" \
  -d '{
    "message": "ကလေးများနာမကျန်းဖြစ်နေသည်။ ဆေးဝါးများချက်ချင်းလိုအပ်သည်။",
    "genre": "direct"
  }'
```

### DL endpoint
```bash
curl -X POST http://localhost:8000/dl/predict/essential \
  -H "Content-Type: application/json" \
  -d '{
    "message": "ကလေးများနာမကျန်းဖြစ်နေသည်။ ဆေးဝါးများချက်ချင်းလိုအပ်သည်။",
    "genre": "direct"
  }'
```

**English equivalent:** *"Children are sick. Medicine is urgently needed."*

**Expected response snippet:**
```json
{
  "active_categories": ["medical_help", "medical_products", "aid_related"],
  "translated_message": "Children are sick. Medicine is urgently needed."
}
```

---

## 5. Storm Warning (News genre)

**Scenario:** A cyclone is approaching and people should evacuate.

### ML endpoint
```bash
curl -X POST http://localhost:8000/ml/predict/all \
  -H "Content-Type: application/json" \
  -d '{
    "message": "ဆိုင်ကလုန်းမုန်တိုင်းကြီး နီးကပ်လာနေသည်။ လူများ ချက်ချင်းထွက်ခွာရမည်။",
    "genre": "news"
  }'
```

### DL endpoint
```bash
curl -X POST http://localhost:8000/dl/predict/all \
  -H "Content-Type: application/json" \
  -d '{
    "message": "ဆိုင်ကလုန်းမုန်တိုင်းကြီး နီးကပ်လာနေသည်။ လူများ ချက်ချင်းထွက်ခွာရမည်။",
    "genre": "news"
  }'
```

**English equivalent:** *"A major cyclone is approaching. People must evacuate immediately."*

**Expected response snippet:**
```json
{
  "message": "ဆိုင်ကလုန်းမုန်တိုင်းကြီး နီးကပ်လာနေသည်။ လူများ ချက်ချင်းထွက်ခွာရမည်။",
  "translated_message": "A major cyclone is approaching. People must evacuate immediately.",
  "urgency": { "label": "high" },
  "disaster": { "is_disaster": true },
  "essential_categories": ["storm"]
}
```

---

## 6. Search & Rescue — Missing People

**Scenario:** Several people have gone missing after the storm.

### ML — predict/all
```bash
curl -X POST http://localhost:8000/ml/predict/all \
  -H "Content-Type: application/json" \
  -d '{
    "message": "မုန်တိုင်းပြီးနောက် လူများပျောက်ဆုံးနေသည်။ ရှာဖွေကယ်ဆယ်ရေးအကူအညီလိုသည်။",
    "genre": "direct"
  }'
```

### DL — predict/all
```bash
curl -X POST http://localhost:8000/dl/predict/all \
  -H "Content-Type: application/json" \
  -d '{
    "message": "မုန်တိုင်းပြီးနောက် လူများပျောက်ဆုံးနေသည်။ ရှာဖွေကယ်ဆယ်ရေးအကူအညီလိုသည်။",
    "genre": "direct"
  }'
```

**English equivalent:** *"People have gone missing after the storm. Search and rescue assistance is needed."*

**Expected response snippet:**
```json
{
  "translated_message": "People have gone missing after the storm. Search and rescue assistance is needed.",
  "urgency": { "label": "high" },
  "disaster": { "is_disaster": true },
  "essential_categories": ["search_and_rescue", "missing_people", "storm"]
}
```

---

## 7. Non-Disaster (English passes through unchanged)

To confirm non-Myanmar text is **not** translated and `translated_message` is absent:

```bash
curl -X POST http://localhost:8000/ml/predict/binary \
  -H "Content-Type: application/json" \
  -d '{
    "message": "The weather is nice today.",
    "genre": "direct"
  }'
```

**Expected response — no `translated_message` field:**
```json
{
  "is_disaster": false,
  "confidence": 0.04,
  "threshold": 0.41
}
```

---

## Response Field Reference

| Field | Present when |
|---|---|
| `label` / `is_disaster` / `active_categories` | Always |
| `confidence` | Always |
| `probabilities` | Urgency and binary endpoints |
| `translated_message` | **Only when input was Myanmar script** |

---

## Python requests equivalent

```python
import requests

myanmar_message = "ငလျင်ကြောင့် လူများသာသည်။ ချက်ချင်းကယ်ဆယ်ရေးလိုသည်။"

# Test all 8 endpoints
endpoints = [
    "http://localhost:8000/ml/predict/urgency",
    "http://localhost:8000/ml/predict/binary",
    "http://localhost:8000/ml/predict/essential",
    "http://localhost:8000/ml/predict/all",
    "http://localhost:8000/dl/predict/urgency",
    "http://localhost:8000/dl/predict/binary",
    "http://localhost:8000/dl/predict/essential",
    "http://localhost:8000/dl/predict/all",
]

payload = {"message": myanmar_message, "genre": "direct"}

for url in endpoints:
    resp = requests.post(url, json=payload)
    data = resp.json()
    print(f"\n{url.split('/')[-2]}/{url.split('/')[-1]}")
    print(f"  translated_message : {data.get('translated_message', '(none — not translated)')}")
    if "label" in data:
        print(f"  label              : {data['label']}")
    if "is_disaster" in data:
        print(f"  is_disaster        : {data['is_disaster']}")
    if "active_categories" in data:
        print(f"  active_categories  : {data['active_categories']}")
```
