// ── Router & Page Rendering ───────────────────────────────────────
const SECTIONS = [
    {
        id: 'home', label: 'Home', icon: 'home',
        pages: [
            { id: 'home', label: 'Overview' },
            { id: 'home-dataset', label: 'Dataset Summary' },
            { id: 'home-findings', label: 'Key Findings' },
            { id: 'home-about', label: 'Model Building Strategies' },
        ]
    },
    {
        id: 'eda', label: 'EDA', icon: 'bar-chart-3',
        pages: [
            { id: 'eda-distributions', label: 'Data Distributions' },
            { id: 'eda-patterns', label: 'Patterns & Correlations' },
            { id: 'eda-visualizations', label: 'Visualizations' },
        ]
    },
    {
        id: 'models', label: 'Model Testing', icon: 'brain',
        pages: [
            { id: 'models-testing', label: 'Test Models' },
            { id: 'models-performance', label: 'Performance Metrics' },
            { id: 'models-evaluation', label: 'Evaluation Dashboards' },
            { id: 'models-cost', label: 'Computation & Storage' },
        ]
    },
    {
        id: 'insights', label: 'Insights', icon: 'lightbulb',
        pages: [
            { id: 'insights-discoveries', label: 'Results & Key Findings' },
            { id: 'insights-conclusions', label: 'Conclusions & Future Work' },
        ]
    },
];

let currentPage = 'home';

// ── Navigation ───────────────────────────────────────────────────
function renderNav() {
    const navLinks = document.getElementById('nav-links');
    const mobileMenu = document.getElementById('mobile-menu');

    navLinks.innerHTML = SECTIONS.map(sec => {
        const isActive = sec.pages.some(p => p.id === currentPage);
        return `
        <div class="relative group">
            <button class="px-4 py-2 text-sm font-semibold rounded-xl flex items-center gap-1.5 transition-all ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700 hover:text-gray-900 dark:hover:text-white'}">
                <i data-lucide="${sec.icon}" class="w-4 h-4"></i>
                ${sec.label}
                <i data-lucide="chevron-down" class="w-3 h-3 ${isActive ? 'text-blue-200' : 'text-gray-400'}"></i>
            </button>
            <div class="absolute left-0 mt-2 w-56 bg-white dark:bg-dark-800 rounded-xl shadow-2xl border border-gray-200 dark:border-dark-600 py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-1 group-hover:translate-y-0">
                ${sec.pages.map(p => `
                    <a href="#${p.id}" onclick="navigate('${p.id}')" class="block px-4 py-2.5 text-sm font-medium ${currentPage === p.id ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700'}">${p.label}</a>
                `).join('')}
            </div>
        </div>`;
    }).join('');

    mobileMenu.innerHTML = `
        <div class="px-4 py-3 space-y-1">
            ${SECTIONS.map(sec => `
                <div>
                    <div class="px-3 py-1.5 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider flex items-center gap-2">
                        <i data-lucide="${sec.icon}" class="w-3 h-3"></i> ${sec.label}
                    </div>
                    ${sec.pages.map(p => `
                        <a href="#${p.id}" onclick="navigate('${p.id}')" class="block px-4 py-2.5 text-sm font-medium rounded-lg ${currentPage === p.id ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-700'}">${p.label}</a>
                    `).join('')}
                </div>
            `).join('')}
        </div>
    `;
    lucide.createIcons();
}

function navigate(page) {
    currentPage = page;
    renderNav();
    renderPage();
    document.getElementById('mobile-menu').classList.add('hidden');
    window.scrollTo(0, 0);
}

function toggleMobileMenu() {
    document.getElementById('mobile-menu').classList.toggle('hidden');
}

// ── Page Templates ───────────────────────────────────────────────
function renderPage() {
    const app = document.getElementById('app');
    const renderer = {
        'home': renderHome, 'home-dataset': renderHomeDataset, 'home-findings': renderHomeFindings, 'home-about': renderHomeAbout,
        'eda-distributions': renderEdaDistributions, 'eda-patterns': renderEdaPatterns, 'eda-visualizations': renderEdaVisualizations,
        'models-testing': renderModelsTesting, 'models-performance': renderModelsPerformance, 'models-evaluation': renderModelsEvaluation, 'models-cost': renderModelsCost,
        'insights-discoveries': renderInsightsDiscoveries, 'insights-conclusions': renderInsightsConclusions,
    };
    app.innerHTML = `<div class="page-section active">${(renderer[currentPage] || renderer.home)()}</div>`;
    initPageCharts();
    lucide.createIcons();
}

// ── Render Header & Footer ────────────────────────────────────────
function renderShell() {
    document.getElementById('header').innerHTML = Header.render();
    document.getElementById('footer').innerHTML = Footer.render();
    // Inject modal into body once — stays in DOM across page navigations
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = ModelsModal.render();
    document.body.appendChild(modalContainer);
    // Close modal on Escape key
    document.addEventListener('keydown', e => { if (e.key === 'Escape') ModelsModal.close(); });
    lucide.createIcons();
}

// ══════════════════════════════════════════════════════════════════
//  HOME
// ══════════════════════════════════════════════════════════════════
function renderHome() {
    return `
    ${Hero.render()}
    ${Stats.render()}
    ${Pipeline.render()}
    ${DatasetInfo.render()}`;
}

function renderHomeDataset() {
    const messages = [
        { id: 2, message: "Weather update - a cold front from Cuba that could pass over Haiti", original: "Un front froid se retrouve sur Cuba ce matin...", genre: "direct" },
        { id: 7, message: "Is the Hurricane over or is it not over", original: "Cyclone nan fini osinon li pa fini", genre: "direct" },
        { id: 8, message: "Looking for someone but no name", original: "Patnm, di Maryani relem pou li banm nouvel...", genre: "direct" },
        { id: 9, message: "UN reports Leogane 80-90 destroyed. Only Hospital St. Croix functioning.", original: "UN reports Leogane 80-90 destroyed...", genre: "direct" },
        { id: 10, message: "I need info about the hospital in Hinche", original: "Mwen bezwen enfomasyon sou lopital la nan Hinche", genre: "direct" },
        { id: 13, message: "Twou nan pon Ti Charles la. Moun pa ka pase.", original: "Twou nan pon Ti Charles la. Moun pa ka pase.", genre: "direct" },
    ];

    const categories = [
        { id: 2, categories: { related: 1, request: 0, aid_related: 0, medical_help: 0, water: 0, food: 0, shelter: 0, earthquake: 0, storm: 0, floods: 0, death: 0, direct_report: 0 } },
        { id: 7, categories: { related: 1, request: 0, aid_related: 1, medical_help: 0, water: 0, food: 0, shelter: 0, earthquake: 0, storm: 1, floods: 0, death: 0, direct_report: 0 } },
        { id: 8, categories: { related: 1, request: 0, aid_related: 0, medical_help: 0, water: 0, food: 0, shelter: 0, earthquake: 0, storm: 0, floods: 0, death: 0, direct_report: 0 } },
        { id: 9, categories: { related: 1, request: 1, aid_related: 1, medical_help: 1, water: 0, food: 0, shelter: 1, earthquake: 1, storm: 0, floods: 0, death: 0, direct_report: 0 } },
        { id: 10, categories: { related: 1, request: 1, aid_related: 1, medical_help: 1, water: 0, food: 0, shelter: 0, earthquake: 0, storm: 0, floods: 0, death: 0, direct_report: 0 } },
        { id: 13, categories: { related: 1, request: 0, aid_related: 0, medical_help: 0, water: 0, food: 0, shelter: 0, earthquake: 0, storm: 0, floods: 0, death: 0, direct_report: 1 } },
    ];

    const catKeys = ["related", "request", "aid_related", "medical_help", "water", "food", "shelter", "earthquake", "storm", "floods", "death", "direct_report"];

    return `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <!-- Header -->
        <div class="text-center mb-12">
            <span class="inline-block px-4 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-semibold rounded-full mb-4">DATASET</span>
            <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">Dataset Summary</h1>
            <p class="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Disaster Response Messages from Figure Eight / Appen</p>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <div class="bg-white dark:bg-dark-800 rounded-2xl shadow-lg p-5 text-center border border-gray-100 dark:border-dark-700">
                <div class="text-3xl font-bold text-blue-600 dark:text-blue-400">${PROJECT.dataset.totalMessages.toLocaleString()}</div>
                <div class="text-sm text-gray-500 dark:text-gray-400 mt-1">Total Messages</div>
            </div>
            <div class="bg-white dark:bg-dark-800 rounded-2xl shadow-lg p-5 text-center border border-gray-100 dark:border-dark-700">
                <div class="text-3xl font-bold text-emerald-600 dark:text-emerald-400">${PROJECT.dataset.categories}</div>
                <div class="text-sm text-gray-500 dark:text-gray-400 mt-1">Category Labels</div>
            </div>
            <div class="bg-white dark:bg-dark-800 rounded-2xl shadow-lg p-5 text-center border border-gray-100 dark:border-dark-700">
                <div class="text-3xl font-bold text-violet-600 dark:text-violet-400">2</div>
                <div class="text-sm text-gray-500 dark:text-gray-400 mt-1">CSV Files</div>
            </div>
            <div class="bg-white dark:bg-dark-800 rounded-2xl shadow-lg p-5 text-center border border-gray-100 dark:border-dark-700">
                <div class="text-3xl font-bold text-amber-600 dark:text-amber-400">3</div>
                <div class="text-sm text-gray-500 dark:text-gray-400 mt-1">Genres</div>
            </div>
        </div>

        <!-- Two-Column Sheet Style -->
        <div class="grid lg:grid-cols-2 gap-6">
            <!-- Messages Sheet -->
            <div class="bg-white dark:bg-dark-800 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-dark-700">
                <div class="bg-gradient-to-r from-blue-500 to-blue-600 px-5 py-4">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <div class="w-9 h-9 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                <i data-lucide="message-square" class="w-4 h-4 text-white"></i>
                            </div>
                            <div>
                                <h2 class="font-bold text-white">disaster_messages.csv</h2>
                                <p class="text-blue-100 text-xs">5 columns · 26,180 rows</p>
                            </div>
                        </div>
                        <span class="px-2.5 py-1 bg-white/20 rounded-lg text-xs font-medium text-white">11.3 MB</span>
                    </div>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead class="bg-blue-50 dark:bg-blue-900/20">
                            <tr>
                                <th class="px-3 py-2.5 text-left text-xs font-bold text-blue-700 dark:text-blue-400">id</th>
                                <th class="px-3 py-2.5 text-left text-xs font-bold text-blue-700 dark:text-blue-400">message</th>
                                <th class="px-3 py-2.5 text-left text-xs font-bold text-blue-700 dark:text-blue-400">original</th>
                                <th class="px-3 py-2.5 text-left text-xs font-bold text-blue-700 dark:text-blue-400">genre</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100 dark:divide-dark-700">
                            ${messages.map((m, i) => `
                                <tr class="hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors ${i % 2 === 0 ? 'bg-white dark:bg-dark-800' : 'bg-gray-50/50 dark:bg-dark-750'}">
                                    <td class="px-3 py-2.5 font-mono text-xs text-gray-500 dark:text-gray-400">${m.id}</td>
                                    <td class="px-3 py-2.5 text-xs text-gray-900 dark:text-gray-200 max-w-[200px] truncate">${m.message}</td>
                                    <td class="px-3 py-2.5 text-xs text-gray-400 dark:text-gray-500 max-w-[150px] truncate italic">${m.original}</td>
                                    <td class="px-3 py-2.5"><span class="px-2 py-0.5 text-[10px] font-semibold rounded-md ${m.genre === 'direct' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' : m.genre === 'news' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'}">${m.genre}</span></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                <div class="px-5 py-3 bg-gray-50 dark:bg-dark-700 border-t border-gray-100 dark:border-dark-600 text-xs text-gray-400 dark:text-gray-500">
                    Showing 6 of 26,180 rows
                </div>
            </div>

            <!-- Categories Sheet -->
            <div class="bg-white dark:bg-dark-800 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-dark-700">
                <div class="bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-4">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <div class="w-9 h-9 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                <i data-lucide="tags" class="w-4 h-4 text-white"></i>
                            </div>
                            <div>
                                <h2 class="font-bold text-white">disaster_categories.csv</h2>
                                <p class="text-emerald-100 text-xs">2 columns · 26,180 rows</p>
                            </div>
                        </div>
                        <span class="px-2.5 py-1 bg-white/20 rounded-lg text-xs font-medium text-white">10.6 MB</span>
                    </div>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead class="bg-emerald-50 dark:bg-emerald-900/20">
                            <tr>
                                <th class="px-3 py-2.5 text-left text-xs font-bold text-emerald-700 dark:text-emerald-400">id</th>
                                ${catKeys.map(c => `<th class="px-2 py-2.5 text-center text-[10px] font-bold text-emerald-700 dark:text-emerald-400">${c.replace('_', '\n')}</th>`).join('')}
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100 dark:divide-dark-700">
                            ${categories.map((c, i) => `
                                <tr class="hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors ${i % 2 === 0 ? 'bg-white dark:bg-dark-800' : 'bg-gray-50/50 dark:bg-dark-750'}">
                                    <td class="px-3 py-2.5 font-mono text-xs text-gray-500 dark:text-gray-400">${c.id}</td>
                                    ${catKeys.map(k => `
                                        <td class="px-2 py-2.5 text-center">
                                            ${c.categories[k] === 1
                                                ? '<span class="inline-flex w-5 h-5 items-center justify-center rounded-md bg-emerald-500 text-white text-[10px] font-bold">1</span>'
                                                : '<span class="inline-flex w-5 h-5 items-center justify-center rounded-md bg-gray-100 dark:bg-dark-600 text-gray-400 dark:text-gray-500 text-[10px]">0</span>'
                                            }
                                        </td>
                                    `).join('')}
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                <div class="px-5 py-3 bg-gray-50 dark:bg-dark-700 border-t border-gray-100 dark:border-dark-600 text-xs text-gray-400 dark:text-gray-500">
                    Showing 6 of 26,180 rows · 36 binary category columns
                </div>
            </div>
        </div>

        <!-- Description -->
        <div class="mt-8 bg-white dark:bg-dark-800 rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-100 dark:border-dark-700">
            <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
                    <i data-lucide="info" class="w-5 h-5 text-white"></i>
                </div>
                <h3 class="font-bold text-lg text-gray-900 dark:text-white">About the Dataset</h3>
            </div>
            <div class="grid sm:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div class="p-4 bg-gray-50 dark:bg-dark-700 rounded-xl">
                    <h4 class="font-semibold text-gray-900 dark:text-white mb-2">Messages File</h4>
                    <p class="leading-relaxed">Contains the original disaster messages with their ID, original text (if available), and the genre classification (direct, news, social).</p>
                </div>
                <div class="p-4 bg-gray-50 dark:bg-dark-700 rounded-xl">
                    <h4 class="font-semibold text-gray-900 dark:text-white mb-2">Categories File</h4>
                    <p class="leading-relaxed">Binary labels for each message across 36 disaster-related categories including weather, medical, infrastructure, and aid-related tags.</p>
                </div>
            </div>
        </div>
    </div>`;
}

function renderHomeFindings() {
    return `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <!-- Header -->
        <div class="text-center mb-12">
            <span class="inline-block px-4 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-semibold rounded-full mb-4">RESULTS</span>
            <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">Key Findings</h1>
            <p class="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Summary of main results across all analyses</p>
        </div>

        <!-- Bento Grid -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8">
            <!-- Large Card - Binary -->
            <div class="col-span-2 row-span-2 group relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-blue-500/20 hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 hover:-translate-y-1">
                <div class="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20 blur-2xl"></div>
                <div class="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mb-16 blur-xl"></div>
                <div class="relative">
                    <div class="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-5">
                        <i data-lucide="target" class="w-7 h-7"></i>
                    </div>
                    <h3 class="text-lg font-bold mb-1 opacity-90">Binary Classification</h3>
                    <p class="text-5xl sm:text-6xl font-extrabold mb-3">84.9%</p>
                    <p class="text-blue-100 text-sm font-medium">F1 Score — DistilBERT</p>
                    <div class="mt-5 pt-5 border-t border-white/20 grid grid-cols-2 gap-4">
                        <div>
                            <div class="text-2xl font-bold">88.4%</div>
                            <div class="text-xs text-blue-200">Recall</div>
                        </div>
                        <div>
                            <div class="text-2xl font-bold">82.5%</div>
                            <div class="text-xs text-blue-200">Accuracy</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Card - Essential -->
            <div class="group relative overflow-hidden bg-white dark:bg-dark-800 rounded-3xl p-5 sm:p-6 border border-gray-100 dark:border-dark-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div class="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full -mr-8 -mt-8"></div>
                <div class="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/25">
                    <i data-lucide="layers" class="w-5 h-5 text-white"></i>
                </div>
                <h3 class="font-bold text-gray-900 dark:text-white mb-1 text-sm">Essential Categories</h3>
                <div class="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mb-1">75.0%</div>
                <p class="text-xs text-gray-500 dark:text-gray-400">F1 Micro — 10 labels</p>
            </div>

            <!-- Card - Urgency -->
            <div class="group relative overflow-hidden bg-white dark:bg-dark-800 rounded-3xl p-5 sm:p-6 border border-gray-100 dark:border-dark-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div class="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full -mr-8 -mt-8"></div>
                <div class="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mb-4 shadow-lg shadow-amber-500/25">
                    <i data-lucide="zap" class="w-5 h-5 text-white"></i>
                </div>
                <h3 class="font-bold text-gray-900 dark:text-white mb-1 text-sm">Urgency Detection</h3>
                <div class="text-3xl font-extrabold text-amber-600 dark:text-amber-400 mb-1">82.3%</div>
                <p class="text-xs text-gray-500 dark:text-gray-400">F1 Macro — 4 classes</p>
            </div>

            <!-- Card - Clustering -->
            <div class="group relative overflow-hidden bg-white dark:bg-dark-800 rounded-3xl p-5 sm:p-6 border border-gray-100 dark:border-dark-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div class="absolute top-0 right-0 w-24 h-24 bg-violet-500/5 rounded-full -mr-8 -mt-8"></div>
                <div class="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mb-4 shadow-lg shadow-violet-500/25">
                    <i data-lucide="git-branch" class="w-5 h-5 text-white"></i>
                </div>
                <h3 class="font-bold text-gray-900 dark:text-white mb-1 text-sm">Clustering</h3>
                <div class="text-3xl font-extrabold text-violet-600 dark:text-violet-400 mb-1">k=2</div>
                <p class="text-xs text-gray-500 dark:text-gray-400">Optimal split discovered</p>
            </div>
        </div>

        <!-- Insights List -->
        <div class="bg-white dark:bg-dark-800 rounded-3xl shadow-xl border border-gray-100 dark:border-dark-700 overflow-hidden">
            <div class="px-6 sm:px-8 py-5 border-b border-gray-100 dark:border-dark-700">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/25">
                        <i data-lucide="lightbulb" class="w-5 h-5 text-white"></i>
                    </div>
                    <h2 class="font-bold text-lg text-gray-900 dark:text-white">Top Insights</h2>
                </div>
            </div>
            <div class="p-6 sm:p-8">
                <div class="grid sm:grid-cols-2 gap-4">
                    ${PROJECT.insights.map((insight, i) => `
                        <div class="flex items-start gap-3 p-4 bg-gray-50 dark:bg-dark-700 rounded-2xl hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors">
                            <div class="flex-shrink-0 w-7 h-7 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-sm">
                                <span class="text-xs font-bold text-white">${i + 1}</span>
                            </div>
                            <p class="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">${insight}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    </div>`;
}
function renderHomeAbout() {
    return `<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="text-center mb-8">
            <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">Model Building Strategies</h1>
            <p class="text-gray-600 dark:text-gray-400">Detailed methodology for each classification model</p>
        </div>
        
        <!-- Urgency Classifier -->
        <div class="bg-white dark:bg-dark-800 rounded-2xl shadow-lg border border-gray-100 dark:border-dark-700 overflow-hidden mb-6">
            <div class="px-6 py-4 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border-b border-gray-100 dark:border-dark-700">
                <h2 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <i data-lucide="alert-circle" class="w-5 h-5 text-red-600"></i>
                    Urgency Level Classifier (4-class)
                </h2>
            </div>
            <div class="p-6">
                <div class="mb-4">
                    <h3 class="font-bold text-gray-900 dark:text-white mb-2">Strategy: Synthetic Label Generation</h3>
                    <p class="text-sm text-gray-700 dark:text-gray-300 mb-3">Uses weighted scoring + quantile-based thresholds to generate urgency labels from message content</p>
                </div>
                
                <div class="bg-gray-50 dark:bg-dark-700 rounded-xl p-4 mb-4">
                    <h4 class="font-semibold text-gray-900 dark:text-white mb-2 text-sm">Step 1: Category Weighting</h4>
                    <div class="grid grid-cols-2 gap-2 text-xs font-mono">
                        <div class="text-red-600 dark:text-red-400">death: 4 (critical)</div>
                        <div class="text-orange-600 dark:text-orange-400">medical_help: 3 (high)</div>
                        <div class="text-orange-600 dark:text-orange-400">search_and_rescue: 3</div>
                        <div class="text-orange-600 dark:text-orange-400">missing_people: 3</div>
                        <div class="text-yellow-600 dark:text-yellow-400">water, food, shelter: 2 (med)</div>
                        <div class="text-yellow-600 dark:text-yellow-400">floods, earthquake, storm: 2</div>
                        <div class="text-green-600 dark:text-green-400">transport, buildings: 1 (low)</div>
                        <div class="text-green-600 dark:text-green-400">electricity, refugees: 1</div>
                    </div>
                </div>
                
                <div class="bg-gray-50 dark:bg-dark-700 rounded-xl p-4 mb-4">
                    <h4 class="font-semibold text-gray-900 dark:text-white mb-2 text-sm">Step 2: Quantile Thresholds</h4>
                    <div class="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                        <div>• <strong>Low (0):</strong> score ≤ Q35 (35th percentile)</div>
                        <div>• <strong>Medium (1):</strong> Q35 < score ≤ Q65</div>
                        <div>• <strong>High (2):</strong> Q65 < score ≤ Q88</div>
                        <div>• <strong>Critical (3):</strong> score > Q88</div>
                    </div>
                </div>
                
                <div class="bg-gray-50 dark:bg-dark-700 rounded-xl p-4">
                    <h4 class="font-semibold text-gray-900 dark:text-white mb-2 text-sm">Step 3: ML Training</h4>
                    <div class="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                        <div>• <strong>Vectorization:</strong> TF-IDF (char n-grams 2-6, max 10k features)</div>
                        <div>• <strong>Algorithm:</strong> Logistic Regression with balanced class weights</div>
                        <div>• <strong>Boosting:</strong> High/Critical classes weighted ×1.4</div>
                        <div>• <strong>Hyperparameter:</strong> C ∈ {0.3, 0.5, 1.0} via grid search</div>
                        <div class="mt-2 text-xs text-gray-500 dark:text-gray-400">Baseline F1-Macro: 52.2% → Improved: 83.2%</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Binary Disaster Classifier -->
        <div class="bg-white dark:bg-dark-800 rounded-2xl shadow-lg border border-gray-100 dark:border-dark-700 overflow-hidden mb-6">
            <div class="px-6 py-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-b border-gray-100 dark:border-dark-700">
                <h2 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <i data-lucide="target" class="w-5 h-5 text-blue-600"></i>
                    Binary Disaster Classifier
                </h2>
            </div>
            <div class="p-6">
                <div class="mb-4">
                    <h3 class="font-bold text-gray-900 dark:text-white mb-2">Strategy: Meaningful Category Detection</h3>
                    <p class="text-sm text-gray-700 dark:text-gray-300 mb-3">Identifies disaster-related messages by filtering out noise categories</p>
                </div>
                
                <div class="bg-gray-50 dark:bg-dark-700 rounded-xl p-4 mb-4">
                    <h4 class="font-semibold text-gray-900 dark:text-white mb-2 text-sm">Label Generation Logic</h4>
                    <div class="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                        <div><strong>Noise Categories (excluded):</strong></div>
                        <div class="text-xs font-mono bg-white dark:bg-dark-800 p-2 rounded">
                            related, request, offer, direct_report, child_alone, tools, shops
                        </div>
                        <div class="mt-2"><strong>Disaster Detection:</strong></div>
                        <div class="text-xs">is_disaster = (related == 1) AND (meaningful_categories ≥ 1)</div>
                    </div>
                </div>
                
                <div class="bg-gray-50 dark:bg-dark-700 rounded-xl p-4">
                    <h4 class="font-semibold text-gray-900 dark:text-white mb-2 text-sm">ML Training</h4>
                    <div class="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                        <div>• <strong>Vectorization:</strong> TF-IDF (word n-grams 1-2, max 10k features)</div>
                        <div>• <strong>Algorithm:</strong> Logistic Regression with balanced class weights</div>
                        <div>• <strong>Optimization:</strong> L2 regularization, C=1.0</div>
                        <div class="mt-2 text-xs text-gray-500 dark:text-gray-400">Baseline F1: 82.8% → Improved: 84.9%</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Essential Categories Classifier -->
        <div class="bg-white dark:bg-dark-800 rounded-2xl shadow-lg border border-gray-100 dark:border-dark-700 overflow-hidden mb-6">
            <div class="px-6 py-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-b border-gray-100 dark:border-dark-700">
                <h2 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <i data-lucide="layers" class="w-5 h-5 text-green-600"></i>
                    Essential Categories Classifier (Multi-label)
                </h2>
            </div>
            <div class="p-6">
                <div class="mb-4">
                    <h3 class="font-bold text-gray-900 dark:text-white mb-2">Strategy: Filtered Multi-label Classification</h3>
                    <p class="text-sm text-gray-700 dark:text-gray-300 mb-3">Focuses on 10 essential resource categories, removing rare labels</p>
                </div>
                
                <div class="bg-gray-50 dark:bg-dark-700 rounded-xl p-4 mb-4">
                    <h4 class="font-semibold text-gray-900 dark:text-white mb-2 text-sm">Category Selection</h4>
                    <div class="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                        <div><strong>10 Essential Categories:</strong></div>
                        <div class="grid grid-cols-2 gap-1 text-xs font-mono">
                            <div>• medical_help</div>
                            <div>• medical_products</div>
                            <div>• death</div>
                            <div>• floods</div>
                            <div>• storm</div>
                            <div>• earthquake</div>
                            <div>• water</div>
                            <div>• food</div>
                            <div>• shelter</div>
                            <div>• aid_related</div>
                        </div>
                        <div class="mt-2 text-xs text-red-600 dark:text-red-400">
                            <strong>Removed (rare):</strong> search_and_rescue, transport, missing_people
                        </div>
                    </div>
                </div>
                
                <div class="bg-gray-50 dark:bg-dark-700 rounded-xl p-4">
                    <h4 class="font-semibold text-gray-900 dark:text-white mb-2 text-sm">ML Training</h4>
                    <div class="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                        <div>• <strong>Approach:</strong> One-vs-Rest (OvR) with 10 binary classifiers</div>
                        <div>• <strong>Vectorization:</strong> TF-IDF (word n-grams 1-2, max 10k features)</div>
                        <div>• <strong>Algorithm:</strong> Logistic Regression per category</div>
                        <div>• <strong>Threshold:</strong> Probability ≥ 0.5 for positive label</div>
                        <div class="mt-2 text-xs text-gray-500 dark:text-gray-400">Baseline F1-Macro: 59.8% → Improved: 68.9%</div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Deep Learning Models -->
        <div class="bg-white dark:bg-dark-800 rounded-2xl shadow-lg border border-gray-100 dark:border-dark-700 overflow-hidden mb-6">
            <div class="px-6 py-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-b border-gray-100 dark:border-dark-700">
                <h2 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <i data-lucide="brain" class="w-5 h-5 text-purple-600"></i>
                    Deep Learning Models (Transformer-based)
                </h2>
            </div>
            <div class="p-6">
                <div class="mb-4">
                    <h3 class="font-bold text-gray-900 dark:text-white mb-2">Strategy: DistilBERT Fine-tuning</h3>
                    <p class="text-sm text-gray-700 dark:text-gray-300 mb-3">Leverages pre-trained transformers for contextual understanding</p>
                </div>
                
                <div class="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 rounded-xl p-4 mb-4 border-2 border-purple-200 dark:border-purple-800">
                    <h4 class="font-semibold text-gray-900 dark:text-white mb-3 text-sm">Base Architecture: DistilBERT</h4>
                    <div class="grid grid-cols-3 gap-3 text-xs text-gray-700 dark:text-gray-300">
                        <div class="text-center p-2 bg-white dark:bg-dark-800 rounded">
                            <div class="font-bold text-purple-600 dark:text-purple-400">66M</div>
                            <div>Parameters</div>
                        </div>
                        <div class="text-center p-2 bg-white dark:bg-dark-800 rounded">
                            <div class="font-bold text-purple-600 dark:text-purple-400">6 Layers</div>
                            <div>Transformer</div>
                        </div>
                        <div class="text-center p-2 bg-white dark:bg-dark-800 rounded">
                            <div class="font-bold text-purple-600 dark:text-purple-400">128 Tokens</div>
                            <div>Max Length</div>
                        </div>
                    </div>
                </div>
                
                <div class="grid md:grid-cols-3 gap-4 mb-4">
                    <div class="bg-gray-50 dark:bg-dark-700 rounded-xl p-4">
                        <div class="flex items-center gap-2 mb-2">
                            <i data-lucide="alert-triangle" class="w-4 h-4 text-red-600"></i>
                            <h4 class="font-semibold text-gray-900 dark:text-white text-sm">Urgency DL</h4>
                        </div>
                        <div class="text-xs text-gray-700 dark:text-gray-300 space-y-1">
                            <div>4-class softmax</div>
                            <div class="font-bold text-red-600 dark:text-red-400">F1-Macro: 85.7%</div>
                        </div>
                    </div>
                    <div class="bg-gray-50 dark:bg-dark-700 rounded-xl p-4">
                        <div class="flex items-center gap-2 mb-2">
                            <i data-lucide="shield-check" class="w-4 h-4 text-blue-600"></i>
                            <h4 class="font-semibold text-gray-900 dark:text-white text-sm">Binary DL</h4>
                        </div>
                        <div class="text-xs text-gray-700 dark:text-gray-300 space-y-1">
                            <div>Binary sigmoid</div>
                            <div class="font-bold text-blue-600 dark:text-blue-400">F1-Score: 87.3%</div>
                        </div>
                    </div>
                    <div class="bg-gray-50 dark:bg-dark-700 rounded-xl p-4">
                        <div class="flex items-center gap-2 mb-2">
                            <i data-lucide="package" class="w-4 h-4 text-green-600"></i>
                            <h4 class="font-semibold text-gray-900 dark:text-white text-sm">Essential DL</h4>
                        </div>
                        <div class="text-xs text-gray-700 dark:text-gray-300 space-y-1">
                            <div>Multi-label sigmoid</div>
                            <div class="font-bold text-green-600 dark:text-green-400">10 categories</div>
                        </div>
                    </div>
                </div>
                
                <div class="bg-gray-50 dark:bg-dark-700 rounded-xl p-4">
                    <h4 class="font-semibold text-gray-900 dark:text-white mb-2 text-sm">Training Configuration</h4>
                    <div class="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                        <div>• <strong>Optimizer:</strong> AdamW (lr=2e-5, weight_decay=0.01)</div>
                        <div>• <strong>Epochs:</strong> 3-5 with early stopping</div>
                        <div>• <strong>Batch Size:</strong> 16 (with gradient accumulation)</div>
                        <div>• <strong>Augmentation:</strong> Synthetic data generation via GPT-4</div>
                        <div>• <strong>Deployment:</strong> HuggingFace Hub (waiyantun/disaster-*)</div>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
}





// ══════════════════════════════════════════════════════════════════
//  EDA
// ══════════════════════════════════════════════════════════════════
function renderEdaDistributions() {
    return `
    <div class="max-w-7xl mx-auto px-4 py-12">
        <h1 class="text-3xl font-bold mb-2 dark:text-white">Data Distributions</h1>
        <p class="text-gray-600 dark:text-gray-400 mb-8">Understanding the shape and structure of the dataset</p>
        <div class="grid md:grid-cols-2 gap-6">
            <div class="bg-white dark:bg-dark-800 rounded-2xl shadow-lg p-6 md:col-span-2">
                <h2 class="font-semibold mb-4 dark:text-white">Overview: Message Length, Genre & Urgency</h2>
                <img src="images/descriptive/new/overview_length_genre_urgency.png" alt="Overview Length Genre Urgency" class="w-full rounded-xl">
            </div>
            <div class="bg-white dark:bg-dark-800 rounded-2xl shadow-lg p-6">
                <h2 class="font-semibold mb-4 dark:text-white">Genre Distribution</h2>
                <img src="images/descriptive/genre_distribution.png" alt="Genre Distribution" class="w-full rounded-xl">
            </div>
            <div class="bg-white dark:bg-dark-800 rounded-2xl shadow-lg p-6">
                <h2 class="font-semibold mb-4 dark:text-white">Class Imbalance</h2>
                <img src="images/descriptive/new/class_imbalance.png" alt="Class Imbalance" class="w-full rounded-xl">
            </div>
            <div class="bg-white dark:bg-dark-800 rounded-2xl shadow-lg p-6">
                <h2 class="font-semibold mb-4 dark:text-white">Message Length vs Urgency</h2>
                <img src="images/descriptive/new/length_vs_urgency.png" alt="Length vs Urgency" class="w-full rounded-xl">
            </div>
            <div class="bg-white dark:bg-dark-800 rounded-2xl shadow-lg p-6">
                <h2 class="font-semibold mb-4 dark:text-white">Length vs Urgency by Category</h2>
                <img src="images/descriptive/new/length_vs_urgency_category.png" alt="Length vs Urgency by Category" class="w-full rounded-xl">
            </div>
            <div class="bg-white dark:bg-dark-800 rounded-2xl shadow-lg p-6">
                <h2 class="font-semibold mb-4 dark:text-white">Category Frequency</h2>
                <img src="images/descriptive/category_frequency.png" alt="Category Frequency" class="w-full rounded-xl">
            </div>
            <div class="bg-white dark:bg-dark-800 rounded-2xl shadow-lg p-6">
                <h2 class="font-semibold mb-4 dark:text-white">Urgency Distribution</h2>
                <img src="images/descriptive/urgency_distribution.png" alt="Urgency Distribution" class="w-full rounded-xl">
            </div>
        </div>
    </div>`;
}

function renderEdaPatterns() {
    return `
    <div class="max-w-7xl mx-auto px-4 py-12">
        <h1 class="text-3xl font-bold mb-2 dark:text-white">Patterns & Correlations</h1>
        <p class="text-gray-600 dark:text-gray-400 mb-8">Co-occurrence and association patterns between categories</p>
        <div class="grid md:grid-cols-2 gap-6">
            <div class="bg-white dark:bg-dark-800 rounded-2xl shadow-lg p-6 md:col-span-2">
                <h2 class="font-semibold mb-4 dark:text-white">Category Co-occurrence Heatmap</h2>
                <img src="images/descriptive/cooccurrence_heatmap.png" alt="Co-occurrence Heatmap" class="w-full rounded-xl">
            </div>
            <div class="bg-white dark:bg-dark-800 rounded-2xl shadow-lg p-6">
                <h2 class="font-semibold mb-4 dark:text-white">Association Rules (Bar Chart)</h2>
                <img src="images/descriptive/association_rules.png" alt="Association Rules" class="w-full rounded-xl">
            </div>
            <div class="bg-white dark:bg-dark-800 rounded-2xl shadow-lg p-6">
                <h2 class="font-semibold mb-4 dark:text-white">Association Rule Network</h2>
                <img src="images/descriptive/new/association_rule_network.png" alt="Association Rule Network" class="w-full rounded-xl">
            </div>
            <div class="bg-white dark:bg-dark-800 rounded-2xl shadow-lg p-6">
                <h2 class="font-semibold mb-4 dark:text-white">Genre × Category Heatmap</h2>
                <img src="images/descriptive/new/genre_category_heatmap.png" alt="Genre Category Heatmap" class="w-full rounded-xl">
            </div>
            <div class="bg-white dark:bg-dark-800 rounded-2xl shadow-lg p-6">
                <h2 class="font-semibold mb-4 dark:text-white">Numeric Correlation Matrix</h2>
                <img src="images/descriptive/new/numeric_correlation.png" alt="Numeric Correlation" class="w-full rounded-xl">
            </div>
            <div class="bg-white dark:bg-dark-800 rounded-2xl shadow-lg p-6 md:col-span-2">
                <h2 class="font-semibold mb-4 dark:text-white">Frequent Itemsets</h2>
                <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead class="bg-gray-50 dark:bg-dark-700 rounded-xl overflow-hidden"><tr><th class="px-4 py-2 text-left dark:text-white">Itemset</th><th class="px-4 py-2 dark:text-white">Support</th></tr></thead>
                        <tbody>${PROJECT.association.frequentItemsets.map(item => `
                            <tr class="border-t dark:border-dark-600"><td class="px-4 py-3 font-medium dark:text-white">{${item.items.join(', ')}}</td>
                            <td class="px-4 py-3 text-center dark:text-white">${item.support}</td></tr>
                        `).join('')}</tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>`;
}

function renderEdaVisualizations() {
    return `
    <div class="max-w-7xl mx-auto px-4 py-12">
        <h1 class="text-3xl font-bold mb-2 dark:text-white">Visualizations</h1>
        <p class="text-gray-600 dark:text-gray-400 mb-8">Clustering analysis, word clouds, and dimensionality reduction</p>
        <div class="grid md:grid-cols-2 gap-6">
            <div class="bg-white dark:bg-dark-800 rounded-2xl shadow-lg p-6">
                <h2 class="font-semibold mb-4 dark:text-white">Word Cloud by Urgency Level</h2>
                <img src="images/descriptive/new/wordcloud_urgency.png" alt="Word Cloud Urgency" class="w-full rounded-xl">
            </div>
            <div class="bg-white dark:bg-dark-800 rounded-2xl shadow-lg p-6">
                <h2 class="font-semibold mb-4 dark:text-white">Word Cloud by Cluster</h2>
                <img src="images/descriptive/new/wordcloud_clusters.png" alt="Word Cloud Clusters" class="w-full rounded-xl">
            </div>
            <div class="bg-white dark:bg-dark-800 rounded-2xl shadow-lg p-6">
                <h2 class="font-semibold mb-4 dark:text-white">Clustering: Elbow & Silhouette</h2>
                <img src="images/descriptive/clustering_elbow.png" alt="Clustering Elbow" class="w-full rounded-xl">
            </div>
            <div class="bg-white dark:bg-dark-800 rounded-2xl shadow-lg p-6">
                <h2 class="font-semibold mb-4 dark:text-white">DBSCAN Noise Analysis</h2>
                <img src="images/descriptive/new/dbscan_noise_analysis.png" alt="DBSCAN Noise Analysis" class="w-full rounded-xl">
            </div>
            <div class="bg-white dark:bg-dark-800 rounded-2xl shadow-lg p-6">
                <h2 class="font-semibold mb-4 dark:text-white">Label Cardinality Distribution</h2>
                <img src="images/descriptive/new/label_cardinality.png" alt="Label Cardinality" class="w-full rounded-xl">
            </div>
            <div class="bg-white dark:bg-dark-800 rounded-2xl shadow-lg p-6">
                <h2 class="font-semibold mb-4 dark:text-white">t-SNE: Cluster Visualization</h2>
                <img src="images/descriptive/tsne_clusters.png" alt="t-SNE Clusters" class="w-full rounded-xl">
            </div>
            <div class="bg-white dark:bg-dark-800 rounded-2xl shadow-lg p-6 md:col-span-2">
                <h2 class="font-semibold mb-4 dark:text-white">Cluster Profile: Category Distribution</h2>
                <img src="images/descriptive/cluster_profile.png" alt="Cluster Profile" class="w-full rounded-xl">
            </div>
        </div>
    </div>`;
}

// ══════════════════════════════════════════════════════════════════
//  MODEL TESTING
// ══════════════════════════════════════════════════════════════════
function renderModelsTesting() {
    return Section.render({
        title: 'Test Models',
        subtitle: 'Run predictions on any model endpoint',
        icon: 'brain',
        children: `
            ${ModelCards.render()}
            ${TestForm.render()}
        `
    });
}

function renderModelsPerformance() {
    return `
    <div class="max-w-7xl mx-auto px-4 py-12">
        <h1 class="text-3xl font-bold mb-2 dark:text-white">Performance Metrics</h1>
        <p class="text-gray-600 dark:text-gray-400 mb-8">Detailed evaluation across all classification tasks</p>

        <div class="bg-white dark:bg-dark-800 rounded-2xl shadow-lg p-6 mb-6">
            <h2 class="font-semibold mb-4 dark:text-white">Performance Comparison</h2>
            <div class="chart-container"><canvas id="comparisonChart"></canvas></div>
        </div>

        <div class="bg-white dark:bg-dark-800 rounded-2xl shadow-lg p-6 mb-6">
            <h2 class="font-semibold mb-4 dark:text-white">Essential Categories — Per-Label F1</h2>
            <div class="chart-container"><canvas id="f1Chart"></canvas></div>
        </div>

        <div class="bg-white dark:bg-dark-800 rounded-2xl shadow-lg p-6">
            <h2 class="font-semibold mb-4 dark:text-white">Model Details</h2>
            <div class="overflow-x-auto">
                <table class="w-full text-sm">
                    <thead class="bg-gray-50 dark:bg-dark-700 rounded-xl overflow-hidden">
                        <tr><th class="px-4 py-3 text-left dark:text-white">Model</th><th class="px-4 py-3 dark:text-white">Type</th><th class="px-4 py-3 dark:text-white">Task</th><th class="px-4 py-3 dark:text-white">Metric</th><th class="px-4 py-3 dark:text-white">Value</th></tr>
                    </thead>
                    <tbody>
                        <tr class="border-t dark:border-dark-600"><td class="px-4 py-3 font-medium dark:text-white" rowspan="3">ML Urgency</td><td class="px-4 py-3 dark:text-white">LogReg</td><td class="px-4 py-3 dark:text-white">4-class</td><td class="px-4 py-3 dark:text-white">F1 Macro</td><td class="px-4 py-3 font-bold dark:text-white">0.7010</td></tr>
                        <tr class="border-t dark:border-dark-600"><td class="px-4 py-3 dark:text-white">LogReg</td><td class="px-4 py-3 dark:text-white">4-class</td><td class="px-4 py-3 dark:text-white">Accuracy</td><td class="px-4 py-3 dark:text-white">0.7620</td></tr>
                        <tr class="border-t dark:border-dark-600"><td class="px-4 py-3 dark:text-white">TF-IDF</td><td class="px-4 py-3 dark:text-white">Features</td><td class="px-4 py-3 dark:text-white">word 1-3, char 2-6</td><td class="px-4 py-3 dark:text-white">—</td></tr>
                        <tr class="border-t dark:border-dark-600"><td class="px-4 py-3 font-medium dark:text-white" rowspan="4">ML Binary</td><td class="px-4 py-3 dark:text-white">CalibratedSVC</td><td class="px-4 py-3 dark:text-white">Binary</td><td class="px-4 py-3 dark:text-white">F1</td><td class="px-4 py-3 font-bold dark:text-white">0.8268</td></tr>
                        <tr class="border-t dark:border-dark-600"><td class="px-4 py-3 dark:text-white">CalibratedSVC</td><td class="px-4 py-3 dark:text-white">Binary</td><td class="px-4 py-3 dark:text-white">Recall</td><td class="px-4 py-3 dark:text-white">0.8890</td></tr>
                        <tr class="border-t dark:border-dark-600"><td class="px-4 py-3 dark:text-white">CalibratedSVC</td><td class="px-4 py-3 dark:text-white">Binary</td><td class="px-4 py-3 dark:text-white">Precision</td><td class="px-4 py-3 dark:text-white">0.7728</td></tr>
                        <tr class="border-t dark:border-dark-600"><td class="px-4 py-3 dark:text-white">CalibratedSVC</td><td class="px-4 py-3 dark:text-white">Binary</td><td class="px-4 py-3 dark:text-white">Threshold</td><td class="px-4 py-3 dark:text-white">0.4093</td></tr>
                        <tr class="border-t dark:border-dark-600"><td class="px-4 py-3 font-medium dark:text-white" rowspan="3">ML Essential</td><td class="px-4 py-3 dark:text-white">Per-label</td><td class="px-4 py-3 dark:text-white">13 labels</td><td class="px-4 py-3 dark:text-white">F1 Micro</td><td class="px-4 py-3 font-bold dark:text-white">0.6991</td></tr>
                        <tr class="border-t dark:border-dark-600"><td class="px-4 py-3 dark:text-white">Per-label</td><td class="px-4 py-3 dark:text-white">13 labels</td><td class="px-4 py-3 dark:text-white">F1 Macro</td><td class="px-4 py-3 dark:text-white">0.5987</td></tr>
                        <tr class="border-t dark:border-dark-600"><td class="px-4 py-3 dark:text-white">Per-label</td><td class="px-4 py-3 dark:text-white">13 labels</td><td class="px-4 py-3 dark:text-white">Jaccard</td><td class="px-4 py-3 dark:text-white">0.3652</td></tr>
                        <tr class="border-t bg-blue-50 dark:bg-blue-900/20 dark:border-dark-600"><td class="px-4 py-3 font-medium dark:text-white" rowspan="3">DL All</td><td class="px-4 py-3 dark:text-white">DistilBERT</td><td class="px-4 py-3 dark:text-white">4-class</td><td class="px-4 py-3 dark:text-white">F1 Macro</td><td class="px-4 py-3 font-bold dark:text-white">0.8228</td></tr>
                        <tr class="border-t bg-blue-50 dark:bg-blue-900/20 dark:border-dark-600"><td class="px-4 py-3 dark:text-white">DistilBERT</td><td class="px-4 py-3 dark:text-white">Binary</td><td class="px-4 py-3 dark:text-white">F1</td><td class="px-4 py-3 font-bold dark:text-white">0.8491</td></tr>
                        <tr class="border-t bg-blue-50 dark:bg-blue-900/20 dark:border-dark-600"><td class="px-4 py-3 dark:text-white">DistilBERT</td><td class="px-4 py-3 dark:text-white">10 labels</td><td class="px-4 py-3 dark:text-white">F1 Micro</td><td class="px-4 py-3 font-bold dark:text-white">0.7502</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>`;
}

function renderModelsCost() {
    return CostAnalysis.render();
}

function renderModelsEvaluation() {
    return `
    <div class="max-w-7xl mx-auto px-4 py-12">
        <h1 class="text-3xl font-bold mb-2 dark:text-white">Evaluation Dashboards</h1>
        <p class="text-gray-600 dark:text-gray-400 mb-8">Confusion matrices, F1 analysis, and comparison dashboards from model training</p>

        <h2 class="text-xl font-bold mb-4 flex items-center gap-2 dark:text-white">
            <span class="w-3 h-3 rounded-full bg-blue-500"></span> Deep Learning (DistilBERT) Evaluation
        </h2>
        <div class="grid md:grid-cols-2 gap-6 mb-10">
            <div class="bg-white dark:bg-dark-800 rounded-2xl shadow-lg p-6">
                <h3 class="font-semibold mb-3 dark:text-white">Urgency Confusion Matrix</h3>
                <img src="images/outputs/DL/transformer_confusion_urgency.png" alt="DL Urgency Confusion Matrix" class="w-full rounded-xl">
            </div>
            <div class="bg-white dark:bg-dark-800 rounded-2xl shadow-lg p-6">
                <h3 class="font-semibold mb-3 dark:text-white">Essential Categories — Per-Label F1</h3>
                <img src="images/outputs/DL/transformer_label_f1_essential.png" alt="DL Essential F1" class="w-full rounded-xl">
            </div>
            <div class="bg-white dark:bg-dark-800 rounded-2xl shadow-lg p-6 md:col-span-2">
                <h3 class="font-semibold mb-3 dark:text-white">Transformer Comparison Dashboard</h3>
                <img src="images/outputs/DL/transformer_comparison_dashboard.png" alt="DL Comparison Dashboard" class="w-full rounded-xl">
            </div>
        </div>

        <h2 class="text-xl font-bold mb-4 flex items-center gap-2 dark:text-white">
            <span class="w-3 h-3 rounded-full bg-gray-500"></span> Machine Learning (TF-IDF) Evaluation
        </h2>
        <div class="grid md:grid-cols-2 gap-6">
            <div class="bg-white dark:bg-dark-800 rounded-2xl shadow-lg p-6">
                <h3 class="font-semibold mb-3 dark:text-white">Urgency Confusion Matrix</h3>
                <img src="images/outputs/ML/improved_confusion_urgency.png" alt="ML Urgency Confusion Matrix" class="w-full rounded-xl">
            </div>
            <div class="bg-white dark:bg-dark-800 rounded-2xl shadow-lg p-6">
                <h3 class="font-semibold mb-3 dark:text-white">Essential Categories — Per-Label F1</h3>
                <img src="images/outputs/ML/improved_label_f1_essential.png" alt="ML Essential F1" class="w-full rounded-xl">
            </div>
            <div class="bg-white dark:bg-dark-800 rounded-2xl shadow-lg p-6">
                <h3 class="font-semibold mb-3 dark:text-white">Binary: Threshold & ROC Analysis</h3>
                <img src="images/outputs/ML/improved_binary_analysis.png" alt="ML Binary Analysis" class="w-full rounded-xl">
            </div>
            <div class="bg-white dark:bg-dark-800 rounded-2xl shadow-lg p-6">
                <h3 class="font-semibold mb-3 dark:text-white">ML Comparison Dashboard</h3>
                <img src="images/outputs/ML/improved_comparison_dashboard.png" alt="ML Comparison Dashboard" class="w-full rounded-xl">
            </div>
        </div>
    </div>`;
}

// ══════════════════════════════════════════════════════════════════
//  INSIGHTS
// ══════════════════════════════════════════════════════════════════
function renderInsightsDiscoveries() {
    return `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <!-- Header -->
        <div class="text-center mb-12">
            <span class="inline-block px-4 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-sm font-semibold rounded-full mb-4">DISCOVERIES</span>
            <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">Key Discoveries</h1>
            <p class="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Most important findings from the analysis</p>
        </div>

        <!-- Discovery Cards - Stacked Timeline Style -->
        <div class="relative">
            <!-- Vertical Line -->
            <div class="absolute left-6 sm:left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-green-500 via-orange-500 to-purple-500 hidden sm:block"></div>

            <div class="space-y-6 sm:space-y-8">
                <!-- Discovery 1 -->
                <div class="relative flex items-start gap-6 group">
                    <div class="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-xl shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-shadow z-10">
                        <i data-lucide="alert-triangle" class="w-6 h-6 sm:w-7 sm:h-7 text-white"></i>
                    </div>
                    <div class="flex-1 bg-white dark:bg-dark-800 rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-100 dark:border-dark-700 group-hover:shadow-2xl transition-all duration-300">
                        <div class="flex items-center gap-3 mb-3">
                            <span class="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-full uppercase">Discovery #1</span>
                        </div>
                        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">Disaster vs Non-Disaster is Highly Imbalanced</h3>
                        <p class="text-gray-600 dark:text-gray-400 leading-relaxed">The dataset has ~75% disaster-related messages. DistilBERT achieves 84.9% F1 with 88.4% recall, catching most disaster messages while accepting some false positives.</p>
                        <div class="mt-5 pt-5 border-t border-gray-100 dark:border-dark-700 flex items-center gap-4">
                            <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                <i data-lucide="brain" class="w-4 h-4"></i>
                                <span>DistilBERT</span>
                            </div>
                            <div class="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 font-semibold">
                                <i data-lucide="trending-up" class="w-4 h-4"></i>
                                <span>84.9% F1</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Discovery 2 -->
                <div class="relative flex items-start gap-6 group">
                    <div class="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-xl shadow-green-500/25 group-hover:shadow-green-500/40 transition-shadow z-10">
                        <i data-lucide="link" class="w-6 h-6 sm:w-7 sm:h-7 text-white"></i>
                    </div>
                    <div class="flex-1 bg-white dark:bg-dark-800 rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-100 dark:border-dark-700 group-hover:shadow-2xl transition-all duration-300">
                        <div class="flex items-center gap-3 mb-3">
                            <span class="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-bold rounded-full uppercase">Discovery #2</span>
                        </div>
                        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">Co-occurrence Reveals Core Need Bundles</h3>
                        <p class="text-gray-600 dark:text-gray-400 leading-relaxed">{food, water, shelter} co-occur frequently — these are the essential survival needs in disaster scenarios. This pattern was confirmed by association rules with lift > 2.0.</p>
                        <div class="mt-5 pt-5 border-t border-gray-100 dark:border-dark-700 flex items-center gap-4">
                            <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                <i data-lucide="git-merge" class="w-4 h-4"></i>
                                <span>Association Rules</span>
                            </div>
                            <div class="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 font-semibold">
                                <i data-lucide="trending-up" class="w-4 h-4"></i>
                                <span>Lift > 2.0</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Discovery 3 -->
                <div class="relative flex items-start gap-6 group">
                    <div class="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-xl shadow-orange-500/25 group-hover:shadow-orange-500/40 transition-shadow z-10">
                        <i data-lucide="sparkles" class="w-6 h-6 sm:w-7 sm:h-7 text-white"></i>
                    </div>
                    <div class="flex-1 bg-white dark:bg-dark-800 rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-100 dark:border-dark-700 group-hover:shadow-2xl transition-all duration-300">
                        <div class="flex items-center gap-3 mb-3">
                            <span class="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-xs font-bold rounded-full uppercase">Discovery #3</span>
                        </div>
                        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">Synthetic Labels Outperform Heuristic</h3>
                        <p class="text-gray-600 dark:text-gray-400 leading-relaxed">The heuristic urgency scoring (based on category presence) has poor calibration. Synthetic labels using content-aware scoring + percentile thresholds provide better class separation.</p>
                        <div class="mt-5 pt-5 border-t border-gray-100 dark:border-dark-700 flex items-center gap-4">
                            <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                <i data-lucide="cpu" class="w-4 h-4"></i>
                                <span>Label Engineering</span>
                            </div>
                            <div class="flex items-center gap-2 text-sm text-orange-600 dark:text-orange-400 font-semibold">
                                <i data-lucide="trending-up" class="w-4 h-4"></i>
                                <span>+0.30 F1 Δ</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Discovery 4 -->
                <div class="relative flex items-start gap-6 group">
                    <div class="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-xl shadow-violet-500/25 group-hover:shadow-violet-500/40 transition-shadow z-10">
                        <i data-lucide="git-fork" class="w-6 h-6 sm:w-7 sm:h-7 text-white"></i>
                    </div>
                    <div class="flex-1 bg-white dark:bg-dark-800 rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-100 dark:border-dark-700 group-hover:shadow-2xl transition-all duration-300">
                        <div class="flex items-center gap-3 mb-3">
                            <span class="px-3 py-1 bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 text-xs font-bold rounded-full uppercase">Discovery #4</span>
                        </div>
                        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">k=2 Natural Cluster Split</h3>
                        <p class="text-gray-600 dark:text-gray-400 leading-relaxed">K-Means clustering with k=2 gives the best silhouette score (0.14). The two clusters roughly correspond to disaster-related vs informational messages.</p>
                        <div class="mt-5 pt-5 border-t border-gray-100 dark:border-dark-700 flex items-center gap-4">
                            <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                <i data-lucide="hash" class="w-4 h-4"></i>
                                <span>K-Means</span>
                            </div>
                            <div class="flex items-center gap-2 text-sm text-violet-600 dark:text-violet-400 font-semibold">
                                <i data-lucide="trending-up" class="w-4 h-4"></i>
                                <span>Silhouette: 0.14</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
}

function renderInsightsConclusions() {
    return `
    <div class="max-w-7xl mx-auto px-4 py-12">
        <div class="text-center mb-12">
            <span class="inline-block px-4 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-sm font-semibold rounded-full mb-4">CONCLUSIONS</span>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-3">Conclusions & Future Work</h1>
            <p class="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Project outcomes, limitations, and next steps</p>
        </div>

        <!-- Project Summary -->
        <div class="bg-white dark:bg-dark-800 rounded-2xl shadow-lg p-8 mb-6">
            <h2 class="text-xl font-semibold mb-4 dark:text-white">Project Summary</h2>
            <p class="text-gray-700 dark:text-gray-300 mb-6">Complete ML pipeline for disaster response message classification, covering the full KDD process from data preparation to model deployment.</p>
            <div class="grid md:grid-cols-2 gap-6">
                <div>
                    <h3 class="font-semibold mb-3 dark:text-white flex items-center gap-2">
                        <i data-lucide="layers" class="w-5 h-5 text-blue-600"></i>
                        Techniques Applied
                    </h3>
                    <ul class="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                        <li class="flex items-center gap-2"><i data-lucide="check-circle" class="w-4 h-4 text-green-500"></i> KDD Process — Data cleaning, transformation</li>
                        <li class="flex items-center gap-2"><i data-lucide="check-circle" class="w-4 h-4 text-green-500"></i> Association Rules — Apriori algorithm</li>
                        <li class="flex items-center gap-2"><i data-lucide="check-circle" class="w-4 h-4 text-green-500"></i> Clustering — K-Means, Hierarchical, DBSCAN</li>
                        <li class="flex items-center gap-2"><i data-lucide="check-circle" class="w-4 h-4 text-green-500"></i> Classification — TF-IDF + LogReg/SVC</li>
                        <li class="flex items-center gap-2"><i data-lucide="check-circle" class="w-4 h-4 text-green-500"></i> Deep Learning — DistilBERT fine-tuning</li>
                        <li class="flex items-center gap-2"><i data-lucide="check-circle" class="w-4 h-4 text-green-500"></i> Deployment — FastAPI REST endpoints</li>
                    </ul>
                </div>
                <div>
                    <h3 class="font-semibold mb-3 dark:text-white flex items-center gap-2">
                        <i data-lucide="trophy" class="w-5 h-5 text-yellow-600"></i>
                        Key Results
                    </h3>
                    <ul class="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                        <li class="flex items-center gap-2"><i data-lucide="check-circle" class="w-4 h-4 text-green-500"></i> Binary: 87.3% F1 (DistilBERT)</li>
                        <li class="flex items-center gap-2"><i data-lucide="check-circle" class="w-4 h-4 text-green-500"></i> Urgency: 85.7% F1-Macro (4 classes)</li>
                        <li class="flex items-center gap-2"><i data-lucide="check-circle" class="w-4 h-4 text-green-500"></i> Essential: 68.9% F1-Macro (10 labels)</li>
                        <li class="flex items-center gap-2"><i data-lucide="check-circle" class="w-4 h-4 text-green-500"></i> DistilBERT: 3-5% improvement over TF-IDF</li>
                        <li class="flex items-center gap-2"><i data-lucide="check-circle" class="w-4 h-4 text-green-500"></i> Myanmar language support (Azure API)</li>
                    </ul>
                </div>
            </div>
        </div>

        <!-- Limitations & Future Work Grid -->
        <div class="grid md:grid-cols-2 gap-6 mb-6">
            <div class="bg-white dark:bg-dark-800 rounded-2xl shadow-lg p-6">
                <h2 class="font-semibold mb-4 text-red-600 dark:text-red-400 flex items-center gap-2">
                    <i data-lucide="alert-triangle" class="w-5 h-5"></i> 
                    Limitations
                </h2>
                <div class="space-y-3">
                    <div class="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">
                        <div class="font-medium text-sm dark:text-white">Synthetic Urgency Labels</div>
                        <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">No human-annotated ground truth for urgency validation</div>
                    </div>
                    <div class="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">
                        <div class="font-medium text-sm dark:text-white">Class Imbalance</div>
                        <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">Some categories very rare (86.9:1 ratio)</div>
                    </div>
                    <div class="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">
                        <div class="font-medium text-sm dark:text-white">Short Message Performance</div>
                        <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">Accuracy drops for messages under 5 words</div>
                    </div>
                    <div class="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">
                        <div class="font-medium text-sm dark:text-white">Computational Cost</div>
                        <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">DistilBERT requires GPU for real-time inference</div>
                    </div>
                </div>
            </div>
            
            <div class="bg-white dark:bg-dark-800 rounded-2xl shadow-lg p-6">
                <h2 class="font-semibold mb-4 text-green-600 dark:text-green-400 flex items-center gap-2">
                    <i data-lucide="rocket" class="w-5 h-5"></i> 
                    Future Work
                </h2>
                <div class="space-y-3">
                    <div class="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                        <div class="font-medium text-sm dark:text-white">Active Learning</div>
                        <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">Incorporate feedback from emergency responders</div>
                    </div>
                    <div class="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                        <div class="font-medium text-sm dark:text-white">Multi-Modal Analysis</div>
                        <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">Add image/video classification for social media</div>
                    </div>
                    <div class="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                        <div class="font-medium text-sm dark:text-white">Geo-Tagging</div>
                        <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">Extract location info for rapid response mapping</div>
                    </div>
                    <div class="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                        <div class="font-medium text-sm dark:text-white">Ensemble Models</div>
                        <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">Combine ML + DL for better robustness</div>
                    </div>
                </div>
            </div>
        </div>


        <!-- References -->
        <div class="bg-white dark:bg-dark-800 rounded-2xl shadow-lg p-6">
            <h2 class="font-semibold mb-4 flex items-center gap-2 dark:text-white">
                <i data-lucide="book-open" class="w-5 h-5"></i> References
            </h2>
            <ul class="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <li>• Han, J., Kamber, M., Pei, J. <em>Data Mining: Concepts and Techniques</em>. 4th Ed. Morgan Kaufmann, 2022.</li>
                <li>• Tan, P., Steinbach, M., Kumar, V. <em>Introduction to Data Mining</em>. 2nd Ed. Pearson, 2018.</li>
                <li>• Sanh, V., et al. "DistilBERT, a distilled version of BERT." <em>arXiv:1910.01108</em>, 2019.</li>
                <li>• Figure Eight (Appen). "Disaster Response Messages." <em>Multilingual Dataset</em>, 2018.</li>
                <li>• HuggingFace Transformers. <em>State-of-the-art NLP</em>. https://huggingface.co/transformers</li>
            </ul>
        </div>
    </div>`;
}

// ══════════════════════════════════════════════════════════════════
//  PREDICTION FUNCTIONS
// ══════════════════════════════════════════════════════════════════
function updateEndpointUrl() {
    const modelType = document.getElementById('testModelType')?.value || 'ml';
    const endpoint = document.getElementById('testEndpoint')?.value || 'all';
    const urlEl = document.getElementById('testEndpointUrl');
    if (urlEl) urlEl.textContent = `POST /${modelType}/predict/${endpoint}`;
}

let lastResult = null;

async function runTestPrediction() {
    const modelType = document.getElementById('testModelType').value;
    const endpoint = document.getElementById('testEndpoint').value;
    const genre = document.getElementById('testGenre').value;
    const message = document.getElementById('testMessage').value;
    const resultDiv = document.getElementById('testResult');
    const readableContent = document.getElementById('testReadableContent');
    const output = document.getElementById('testOutput');

    resultDiv.classList.remove('hidden');
    readableContent.innerHTML = '<div class="flex items-center gap-2 text-gray-500"><div class="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div> Running prediction...</div>';

    const fnMap = {
        'ml-urgency': predictMLUrgency, 'ml-binary': predictMLBinary,
        'ml-essential': predictMLEssential, 'ml-all': predictMLAll,
        'dl-urgency': predictDLUrgency, 'dl-binary': predictDLBinary,
        'dl-essential': predictDLEssential, 'dl-all': predictDLAll,
    };
    const result = await fnMap[`${modelType}-${endpoint}`](message, genre);
    lastResult = result;

    output.textContent = JSON.stringify(result, null, 2);
    readableContent.innerHTML = renderReadableResult(result, modelType, endpoint);
    toggleJsonView(false);
    lucide.createIcons();
}

function renderReadableResult(result, modelType, endpoint) {
    if (result.error) {
        return `<div class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-sm flex items-center gap-2"><i data-lucide="alert-circle" class="w-4 h-4"></i> ${result.error}</div>`;
    }

    let html = '';

    // Message (only in /all responses)
    if (result.message) {
        html += `
        <div class="mb-4 p-3 bg-white dark:bg-dark-700 rounded-xl border border-gray-100 dark:border-dark-600">
            <div class="text-xs text-gray-400 uppercase tracking-wider mb-1">Input Message</div>
            <div class="text-sm text-gray-700 dark:text-gray-300">"${result.message}"</div>
            ${result.translated_message ? `
            <div class="mt-2 pt-2 border-t border-gray-100 dark:border-dark-600 flex items-start gap-2">
                <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 shrink-0 mt-0.5">
                    <i data-lucide="languages" class="w-3 h-3"></i> Translated
                </span>
                <div class="text-sm text-gray-500 dark:text-gray-400 italic">"${result.translated_message}"</div>
            </div>` : ''}
        </div>`;
    }

    // Urgency — handle both wrapped (result.urgency) and flat (result.label from /urgency endpoint)
    const urg = result.urgency || (result.label && result.probabilities ? result : null);
    if (urg) {
        const label = urg.label;
        const confidence = urg.confidence;
        const probabilities = urg.probabilities;
        const labelColors = { low: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400', medium: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400', high: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400', critical: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' };
        const labelIcons = { low: 'shield-check', medium: 'alert-triangle', high: 'alert-octagon', critical: 'flame' };
        html += `
        <div class="mb-4 p-4 bg-white dark:bg-dark-700 rounded-xl border border-gray-100 dark:border-dark-600">
            <div class="text-xs text-gray-400 uppercase tracking-wider mb-2">Urgency Level</div>
            <div class="flex items-center gap-3">
                <i data-lucide="${labelIcons[label] || 'circle'}" class="w-6 h-6 ${label === 'critical' ? 'text-red-500' : label === 'high' ? 'text-orange-500' : label === 'medium' ? 'text-yellow-500' : 'text-green-500'}"></i>
                <span class="px-3 py-1 rounded-full text-sm font-semibold ${labelColors[label] || 'bg-gray-100 dark:bg-dark-600'}">${label?.toUpperCase()}</span>
                ${confidence ? `<span class="text-sm text-gray-500 dark:text-gray-400">Confidence: <strong>${(confidence * 100).toFixed(1)}%</strong></span>` : ''}
            </div>
            ${probabilities ? `
            <div class="mt-3 grid grid-cols-4 gap-2">
                ${Object.entries(probabilities).map(([k, v]) => `
                    <div class="text-center p-2 bg-gray-50 dark:bg-dark-600 rounded-lg">
                        <div class="text-xs text-gray-500 dark:text-gray-400">${k}</div>
                        <div class="font-bold text-sm ${k === label ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}">${(v * 100).toFixed(1)}%</div>
                    </div>
                `).join('')}
            </div>` : ''}
        </div>`;
    }

    // Binary — handle both wrapped (result.disaster) and flat (result.is_disaster from /binary endpoint)
    const bin = result.disaster || (typeof result.is_disaster === 'boolean' ? result : null);
    if (bin) {
        const isDisaster = bin.is_disaster;
        const confidence = bin.confidence;
        html += `
        <div class="mb-4 p-4 bg-white dark:bg-dark-700 rounded-xl border border-gray-100 dark:border-dark-600">
            <div class="text-xs text-gray-400 uppercase tracking-wider mb-2">Disaster Classification</div>
            <div class="flex items-center gap-3">
                <i data-lucide="${isDisaster ? 'alert-triangle' : 'shield-check'}" class="w-6 h-6 ${isDisaster ? 'text-red-500' : 'text-green-500'}"></i>
                <span class="px-3 py-1 rounded-full text-sm font-semibold ${isDisaster ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'}">${isDisaster ? 'DISASTER' : 'NOT DISASTER'}</span>
                ${confidence ? `<span class="text-sm text-gray-500 dark:text-gray-400">Confidence: <strong>${(confidence * 100).toFixed(1)}%</strong></span>` : ''}
            </div>
        </div>`;
    }

    // Essential Categories — handle both wrapped and flat
    const cats = result.essential_categories || result.active_categories;
    const details = result.details || result.probabilities;
    if (cats) {
        html += `
        <div class="mb-4 p-4 bg-white dark:bg-dark-700 rounded-xl border border-gray-100 dark:border-dark-600">
            <div class="text-xs text-gray-400 uppercase tracking-wider mb-2">Essential Categories (${cats.length} active)</div>
            <div class="flex flex-wrap gap-2">
                ${cats.length > 0 ? cats.map(c => `<span class="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 flex items-center gap-1"><i data-lucide="tag" class="w-3 h-3"></i> ${c.replace(/_/g, ' ')}</span>`).join('') : '<span class="text-gray-400 dark:text-gray-500 text-sm">No categories detected</span>'}
            </div>
            ${details ? `
            <div class="mt-3 grid grid-cols-2 gap-2">
                ${Object.entries(details).map(([k, v]) => {
                    const prob = typeof v === 'object' ? v.probability : v;
                    const active = typeof v === 'object' ? v.active : v > 0.5;
                    if (prob === undefined) return '';
                    return `
                    <div class="flex justify-between items-center p-2 bg-gray-50 dark:bg-dark-600 rounded-lg">
                        <span class="text-sm text-gray-700 dark:text-gray-300">${k.replace(/_/g, ' ')}</span>
                        <span class="text-sm font-medium ${active ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}">${(prob * 100).toFixed(1)}%</span>
                    </div>`;
                }).join('')}
            </div>` : ''}
        </div>`;
    }

    return html || '<div class="text-gray-500 dark:text-gray-400 text-sm">No results to display</div>';
}

function toggleJsonView(showJson) {
    const readable = document.getElementById('testReadable');
    const json = document.getElementById('testJson');
    const btnReadable = document.getElementById('btnReadable');
    const btnJson = document.getElementById('btnJson');

    if (showJson) {
        readable.classList.add('hidden');
        json.classList.remove('hidden');
        btnReadable.classList.remove('bg-blue-100', 'text-blue-700');
        btnReadable.classList.add('bg-gray-100', 'text-gray-600');
        btnJson.classList.remove('bg-gray-100', 'text-gray-600');
        btnJson.classList.add('bg-blue-100', 'text-blue-700');
    } else {
        readable.classList.remove('hidden');
        json.classList.add('hidden');
        btnReadable.classList.remove('bg-gray-100', 'text-gray-600');
        btnReadable.classList.add('bg-blue-100', 'text-blue-700');
        btnJson.classList.remove('bg-blue-100', 'text-blue-700');
        btnJson.classList.add('bg-gray-100', 'text-gray-600');
    }
}

function copyResult() {
    const output = document.getElementById('testOutput');
    navigator.clipboard.writeText(output.textContent);
    const btn = document.querySelector('#testJson button:last-child');
    if (!btn) return;
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<i data-lucide="check" class="w-3 h-3"></i> Copied!';
    btn.classList.add('bg-green-600', 'text-white');
    btn.classList.remove('bg-gray-700', 'dark:bg-dark-600', 'text-gray-300');
    lucide.createIcons();
    setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.classList.remove('bg-green-600', 'text-white');
        btn.classList.add('bg-gray-700', 'dark:bg-dark-600', 'text-gray-300');
        lucide.createIcons();
    }, 1500);
}

// ── Init Page Charts & Event Listeners ────────────────────────────
function initPageCharts() {
    setTimeout(() => {
        const chartInit = {
            'models-performance': () => { createComparisonChart(); createF1Chart(); },
        };
        if (chartInit[currentPage]) chartInit[currentPage]();

        if (currentPage === 'models-testing') {
            const modelTypeEl = document.getElementById('testModelType');
            const endpointEl = document.getElementById('testEndpoint');
            if (modelTypeEl) modelTypeEl.addEventListener('change', updateEndpointUrl);
            if (endpointEl) endpointEl.addEventListener('change', updateEndpointUrl);
        }
    }, 100);
}

// ── Boot ─────────────────────────────────────────────────────────
window.addEventListener('hashchange', () => {
    const page = location.hash.slice(1) || 'home';
    const allPages = SECTIONS.flatMap(s => s.pages);
    if (allPages.find(p => p.id === page)) navigate(page);
});

document.addEventListener('DOMContentLoaded', () => {
    renderShell();
    const page = location.hash.slice(1) || 'home';
    const allPages = SECTIONS.flatMap(s => s.pages);
    navigate(allPages.find(p => p.id === page) ? page : 'home');
    initImageModal();
});

// ── Image Modal ─────────────────────────────────────────────────
function initImageModal() {
    document.addEventListener('click', (e) => {
        const img = e.target.closest('img');
        if (img && img.src && !img.closest('#imageModal') && !img.closest('#header') && !img.closest('#footer')) {
            e.preventDefault();
            openImageModal(img.src, img.alt || '');
        }
    });
}

function openImageModal(src, alt) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    if (!modal || !modalImg) return;
    modalImg.src = src;
    modalImg.alt = alt;
    modalCaption.textContent = alt;
    modal.classList.remove('hidden');
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeImageModal(e) {
    if (e && e.target !== e.currentTarget && !e.target.closest('[onclick*="closeImageModal"]')) return;
    const modal = document.getElementById('imageModal');
    if (!modal) return;
    modal.classList.add('hidden');
    modal.classList.remove('show');
    document.body.style.overflow = '';
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeImageModal();
});
