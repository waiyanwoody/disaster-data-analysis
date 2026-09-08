// ── FastAPI Backend Integration ───────────────────────────────────
// Use relative URLs so it works from any host/IP
const API_BASE = '';

async function post(endpoint, message, genre = 'direct') {
    try {
        const res = await fetch(`${API_BASE}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message, genre }),
        });
        if (!res.ok) {
            return { error: `HTTP ${res.status}: ${res.statusText}` };
        }
        return await res.json();
    } catch (err) {
        return { error: `API unavailable — ${err.message}` };
    }
}

// ML endpoints
function predictMLUrgency(msg, genre) { return post('/ml/predict/urgency', msg, genre); }
function predictMLBinary(msg, genre) { return post('/ml/predict/binary', msg, genre); }
function predictMLEssential(msg, genre) { return post('/ml/predict/essential', msg, genre); }
function predictMLAll(msg, genre) { return post('/ml/predict/all', msg, genre); }

// DL endpoints
function predictDLUrgency(msg, genre) { return post('/dl/predict/urgency', msg, genre); }
function predictDLBinary(msg, genre) { return post('/dl/predict/binary', msg, genre); }
function predictDLEssential(msg, genre) { return post('/dl/predict/essential', msg, genre); }
function predictDLAll(msg, genre) { return post('/dl/predict/all', msg, genre); }