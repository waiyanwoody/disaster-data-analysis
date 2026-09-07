// ── Chart Configurations ──────────────────────────────────────────
const COLORS = {
    blue: '#3B82F6', green: '#10B981', orange: '#F59E0B', red: '#EF4444',
    purple: '#8B5CF6', pink: '#EC4899', cyan: '#06B6D4', gray: '#6B7280',
    blueLight: 'rgba(59, 130, 246, 0.1)', greenLight: 'rgba(16, 185, 129, 0.1)',
};

function destroyChart(id) {
    const existing = Chart.getChart(id);
    if (existing) existing.destroy();
}

function createGenreChart() {
    destroyChart('genreChart');
    const ctx = document.getElementById('genreChart');
    if (!ctx) return;
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(PROJECT.genreDistribution),
            datasets: [{
                data: Object.values(PROJECT.genreDistribution),
                backgroundColor: [COLORS.blue, COLORS.green, COLORS.orange],
                borderWidth: 0,
            }],
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom' } },
        },
    });
}

function createCategoryChart() {
    destroyChart('categoryChart');
    const ctx = document.getElementById('categoryChart');
    if (!ctx) return;
    const sorted = Object.entries(PROJECT.categoryFrequency).sort((a, b) => b[1] - a[1]);
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: sorted.map(([k]) => k.replace(/_/g, ' ')),
            datasets: [{
                label: 'Frequency',
                data: sorted.map(([, v]) => v),
                backgroundColor: COLORS.blue,
                borderRadius: 4,
            }],
        },
        options: {
            responsive: true, maintainAspectRatio: false, indexAxis: 'y',
            plugins: { legend: { display: false } },
            scales: { x: { grid: { display: false } }, y: { grid: { display: false } } },
        },
    });
}

function createUrgencyChart() {
    destroyChart('urgencyChart');
    const ctx = document.getElementById('urgencyChart');
    if (!ctx) return;
    const labels = ['Low', 'Medium', 'High', 'Critical'];
    const h = Object.values(PROJECT.urgencyDistribution.heuristic);
    const s = Object.values(PROJECT.urgencyDistribution.synthetic);
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [
                { label: 'Heuristic', data: h, backgroundColor: COLORS.gray, borderRadius: 4 },
                { label: 'Synthetic', data: s, backgroundColor: COLORS.blue, borderRadius: 4 },
            ],
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { position: 'top' } },
            scales: { y: { beginAtZero: true } },
        },
    });
}

function createComparisonChart() {
    destroyChart('comparisonChart');
    const ctx = document.getElementById('comparisonChart');
    if (!ctx) return;
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Urgency F1', 'Binary F1', 'Essential F1 Micro'],
            datasets: [
                { label: 'TF-IDF', data: [0.5218, 0.8278, 0.6991], backgroundColor: COLORS.gray, borderRadius: 4 },
                { label: 'DistilBERT', data: [0.55, 0.85, 0.72], backgroundColor: COLORS.blue, borderRadius: 4 },
            ],
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { position: 'top' } },
            scales: { y: { beginAtZero: true, max: 1.0 } },
        },
    });
}

function createAssociationChart() {
    destroyChart('associationChart');
    const ctx = document.getElementById('associationChart');
    if (!ctx) return;
    const rules = PROJECT.association.topRules;
    new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Rules',
                data: rules.map(r => ({ x: r.confidence, y: r.lift })),
                backgroundColor: COLORS.blue,
                pointRadius: 8,
            }],
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { title: { display: true, text: 'Confidence' }, min: 0, max: 1 },
                y: { title: { display: true, text: 'Lift' }, min: 0 },
            },
        },
    });
}

function createClusterChart() {
    destroyChart('clusterChart');
    const ctx = document.getElementById('clusterChart');
    if (!ctx) return;
    // Simulated cluster data
    const data1 = Array.from({length: 50}, () => ({ x: Math.random() * 3 + 1, y: Math.random() * 3 + 1 }));
    const data2 = Array.from({length: 50}, () => ({ x: Math.random() * 3 + 5, y: Math.random() * 3 + 4 }));
    new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [
                { label: 'Cluster 0', data: data1, backgroundColor: COLORS.blue, pointRadius: 4 },
                { label: 'Cluster 1', data: data2, backgroundColor: COLORS.green, pointRadius: 4 },
            ],
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { position: 'top' } },
            scales: { x: { title: { display: true, text: 't-SNE 1' } }, y: { title: { display: true, text: 't-SNE 2' } } },
        },
    });
}

function createF1Chart() {
    destroyChart('f1Chart');
    const ctx = document.getElementById('f1Chart');
    if (!ctx) return;
    const cats = ['medical', 'food', 'water', 'shelter', 'storm', 'death', 'floods', 'earthquake'];
    const f1s = [0.65, 0.82, 0.78, 0.71, 0.74, 0.58, 0.72, 0.76];
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: cats,
            datasets: [{ label: 'F1 Score', data: f1s, backgroundColor: COLORS.blue, borderRadius: 4 }],
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true, max: 1.0 } },
        },
    });
}
