// ── Section Component ─────────────────────────────────────────────
const Section = {
    render(options = {}) {
        const { title, subtitle, icon, children = '' } = options;
        return `
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            ${title ? `
            <div class="mb-8">
                <div class="flex items-center gap-3 mb-2">
                    ${icon ? `<div class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/25"><i data-lucide="${icon}" class="w-5 h-5 text-white"></i></div>` : ''}
                    <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">${title}</h1>
                </div>
                ${subtitle ? `<p class="text-gray-600 dark:text-gray-400 ml-[52px]">${subtitle}</p>` : ''}
            </div>` : ''}
            ${children}
        </div>`;
    }
};

// ── Card Component ────────────────────────────────────────────────
const Card = {
    render(options = {}) {
        const { title, icon, color = 'gray', children = '', className = '' } = options;
        return `
        <div class="bg-white dark:bg-dark-800 rounded-2xl shadow-lg hover:shadow-xl overflow-hidden border border-gray-100 dark:border-dark-700 transition-all duration-300 ${className}">
            ${title ? `
            <div class="px-6 py-4 border-b border-gray-100 dark:border-dark-700">
                <div class="flex items-center gap-3">
                    ${icon ? `<div class="w-9 h-9 rounded-lg bg-${color}-100 dark:bg-${color}-900/30 flex items-center justify-center"><i data-lucide="${icon}" class="w-4 h-4 text-${color}-600 dark:text-${color}-400"></i></div>` : ''}
                    <h2 class="font-bold text-gray-900 dark:text-white">${title}</h2>
                </div>
            </div>` : ''}
            <div class="p-6">
                ${children}
            </div>
        </div>`;
    }
};

// ── Image Component ───────────────────────────────────────────────
const ImageBlock = {
    render(src, alt = '', caption = '') {
        return `
        <div class="bg-white dark:bg-dark-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-dark-700">
            ${caption ? `
            <div class="px-6 py-4 border-b border-gray-100 dark:border-dark-700">
                <h3 class="font-bold text-gray-900 dark:text-white">${caption}</h3>
            </div>` : ''}
            <div class="p-4">
                <img src="${src}" alt="${alt}" class="w-full rounded-xl" loading="lazy">
            </div>
        </div>`;
    }
};

// ── Stat Card Component ───────────────────────────────────────────
const StatCard = {
    render(value, label, color = 'blue') {
        return `
        <div class="bg-white dark:bg-dark-800 rounded-2xl shadow-xl p-6 text-center border border-gray-100 dark:border-dark-700 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <div class="text-3xl font-bold bg-gradient-to-r from-${color}-600 to-${color}-400 bg-clip-text text-transparent mb-1">${value}</div>
            <div class="text-sm text-gray-500 dark:text-gray-400 font-medium">${label}</div>
        </div>`;
    }
};

// ── Finding Card Component ────────────────────────────────────────
const FindingCard = {
    render(icon, title, value, desc, color = 'blue') {
        return `
        <div class="bg-white dark:bg-dark-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-dark-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div class="flex items-center gap-3 mb-3">
                <div class="w-10 h-10 rounded-xl bg-${color}-100 dark:bg-${color}-900/30 flex items-center justify-center">
                    <i data-lucide="${icon}" class="w-5 h-5 text-${color}-600 dark:text-${color}-400"></i>
                </div>
                <h3 class="font-bold text-gray-900 dark:text-white">${title}</h3>
            </div>
            <div class="text-2xl font-extrabold text-${color}-600 dark:text-${color}-400 mb-1">${value}</div>
            <div class="text-sm text-gray-500 dark:text-gray-400">${desc}</div>
        </div>`;
    }
};

// ── Models Modal Component ────────────────────────────────────────
const ModelsModal = {
    open() {
        document.getElementById('models-modal').classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        if (window.lucide) lucide.createIcons();
    },
    close() {
        document.getElementById('models-modal').classList.add('hidden');
        document.body.style.overflow = '';
    },
    render() {
        return `
        <div id="models-modal" class="hidden fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" onclick="ModelsModal.close()"></div>
            <div class="relative w-full max-w-3xl bg-white dark:bg-dark-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-dark-700">
                <div class="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-t-2xl">
                    <div class="flex items-center gap-3">
                        <div class="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                            <i data-lucide="cpu" class="w-5 h-5 text-white"></i>
                        </div>
                        <div>
                            <h2 class="text-lg font-bold text-white">3 Trained Models</h2>
                            <p class="text-violet-200 text-xs">Urgency · Binary · Essential Categories</p>
                        </div>
                    </div>
                    <button onclick="ModelsModal.close()" class="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                        <i data-lucide="x" class="w-4 h-4 text-white"></i>
                    </button>
                </div>
                <div class="p-6">
                    <div class="grid grid-cols-3 gap-4">
                        <div class="rounded-2xl border border-amber-200 dark:border-amber-900/40 p-5 flex flex-col gap-2">
                            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                                <i data-lucide="alert-triangle" class="w-5 h-5 text-white"></i>
                            </div>
                            <div class="font-bold text-gray-900 dark:text-white text-sm mt-1">Model 1 — Urgency Classifier</div>
                            <div class="text-xs text-gray-500 dark:text-gray-400">4-class · critical / high / medium / low</div>
                        </div>
                        <div class="rounded-2xl border border-emerald-200 dark:border-emerald-900/40 p-5 flex flex-col gap-2">
                            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                                <i data-lucide="shield-check" class="w-5 h-5 text-white"></i>
                            </div>
                            <div class="font-bold text-gray-900 dark:text-white text-sm mt-1">Model 2 — Binary Disaster Classifier</div>
                            <div class="text-xs text-gray-500 dark:text-gray-400">binary · disaster-related vs not-related</div>
                        </div>
                        <div class="rounded-2xl border border-blue-200 dark:border-blue-900/40 p-5 flex flex-col gap-2">
                            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                                <i data-lucide="layers" class="w-5 h-5 text-white"></i>
                            </div>
                            <div class="font-bold text-gray-900 dark:text-white text-sm mt-1">Model 3 — Essential Categories</div>
                            <div class="text-xs text-gray-500 dark:text-gray-400">multi-label · food / water / shelter / medical / ...</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    }
};

// ── Table Component ───────────────────────────────────────────────
const Table = {
    render(headers, rows) {
        return `
        <div class="overflow-x-auto rounded-xl border border-gray-200 dark:border-dark-600">
            <table class="w-full text-sm">
                <thead class="bg-gray-50 dark:bg-dark-700">
                    <tr>${headers.map(h => `<th class="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">${h}</th>`).join('')}</tr>
                </thead>
                <tbody class="divide-y divide-gray-200 dark:divide-dark-600">${rows.map(row => `
                    <tr class="bg-white dark:bg-dark-800 hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors">${row.map(cell => `<td class="px-4 py-3 text-gray-700 dark:text-gray-300">${cell}</td>`).join('')}</tr>
                `).join('')}</tbody>
            </table>
        </div>`;
    }
};
