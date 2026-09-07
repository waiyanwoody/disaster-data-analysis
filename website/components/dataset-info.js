// ── Dataset & Techniques Component ────────────────────────────────
const DatasetInfo = {
    render() {
        const d = PROJECT.dataset;
        return `
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div class="text-center mb-12">
                <span class="inline-block px-4 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-sm font-semibold rounded-full mb-4">ABOUT</span>
                <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">Dataset & Techniques</h2>
                <p class="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Understanding the data and methods behind our models</p>
            </div>

            <div class="grid lg:grid-cols-2 gap-8">
                <!-- Dataset Card -->
                <div class="bg-white dark:bg-dark-800 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-dark-700">
                    <div class="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-5">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                <i data-lucide="database" class="w-5 h-5 text-white"></i>
                            </div>
                            <div>
                                <h3 class="font-bold text-lg text-white">${d.name}</h3>
                                <p class="text-emerald-100 text-sm">Source: ${d.source}</p>
                            </div>
                        </div>
                    </div>
                    <div class="p-6">
                        <!-- Stats Grid -->
                        <div class="grid grid-cols-3 gap-4 mb-6">
                            <div class="text-center p-3 bg-gray-50 dark:bg-dark-700 rounded-xl">
                                <div class="text-2xl font-bold text-emerald-600 dark:text-emerald-400">${d.totalMessages.toLocaleString()}</div>
                                <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">Messages</div>
                            </div>
                            <div class="text-center p-3 bg-gray-50 dark:bg-dark-700 rounded-xl">
                                <div class="text-2xl font-bold text-emerald-600 dark:text-emerald-400">${d.categories}</div>
                                <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">Categories</div>
                            </div>
                            <div class="text-center p-3 bg-gray-50 dark:bg-dark-700 rounded-xl">
                                <div class="text-2xl font-bold text-emerald-600 dark:text-emerald-400">${d.genres.length}</div>
                                <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">Genres</div>
                            </div>
                        </div>

                        <!-- Genres -->
                        <div class="mb-5">
                            <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Message Genres</h4>
                            <div class="flex flex-wrap gap-2">
                                ${d.genres.map(g => `
                                    <span class="px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/30">${g}</span>
                                `).join('')}
                            </div>
                        </div>

                        <!-- Features -->
                        <div class="mb-5">
                            <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Original Features</h4>
                            <div class="flex flex-wrap gap-2">
                                ${d.features.map(f => `
                                    <span class="px-3 py-1.5 text-xs font-mono font-medium rounded-lg bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-400">${f}</span>
                                `).join('')}
                            </div>
                        </div>

                        <!-- Source Link -->
                        <a href="https://www.kaggle.com/datasets/sidharth178/disaster-response-messages" target="_blank" rel="noopener" class="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-sm font-semibold rounded-xl hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors border border-emerald-200 dark:border-emerald-800/30">
                            <i data-lucide="external-link" class="w-4 h-4"></i>
                            View on Kaggle
                        </a>
                    </div>
                </div>

                <!-- Techniques Card -->
                <div class="bg-white dark:bg-dark-800 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-dark-700">
                    <div class="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-5">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                <i data-lucide="cpu" class="w-5 h-5 text-white"></i>
                            </div>
                            <div>
                                <h3 class="font-bold text-lg text-white">Techniques Used</h3>
                                <p class="text-blue-100 text-sm">ML & DL approaches</p>
                            </div>
                        </div>
                    </div>
                    <div class="p-6">
                        <div class="space-y-4">
                            <!-- ML Technique -->
                            <div class="p-4 bg-gray-50 dark:bg-dark-700 rounded-xl">
                                <div class="flex items-center gap-3 mb-2">
                                    <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center">
                                        <i data-lucide="bar-chart" class="w-4 h-4 text-white"></i>
                                    </div>
                                    <h4 class="font-bold text-gray-900 dark:text-white text-sm">TF-IDF + Classical ML</h4>
                                </div>
                                <ul class="text-xs text-gray-600 dark:text-gray-400 space-y-1 ml-11">
                                    <li class="flex items-center gap-2"><span class="w-1 h-1 rounded-full bg-gray-400"></span> TF-IDF (word 1-3, char 2-6 n-grams)</li>
                                    <li class="flex items-center gap-2"><span class="w-1 h-1 rounded-full bg-gray-400"></span> Logistic Regression (urgency)</li>
                                    <li class="flex items-center gap-2"><span class="w-1 h-1 rounded-full bg-gray-400"></span> Calibrated LinearSVC (binary, essential)</li>
                                    <li class="flex items-center gap-2"><span class="w-1 h-1 rounded-full bg-gray-400"></span> Per-label threshold optimization</li>
                                </ul>
                            </div>

                            <!-- DL Technique -->
                            <div class="p-4 bg-gray-50 dark:bg-dark-700 rounded-xl">
                                <div class="flex items-center gap-3 mb-2">
                                    <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                                        <i data-lucide="brain" class="w-4 h-4 text-white"></i>
                                    </div>
                                    <h4 class="font-bold text-gray-900 dark:text-white text-sm">DistilBERT Transformer</h4>
                                </div>
                                <ul class="text-xs text-gray-600 dark:text-gray-400 space-y-1 ml-11">
                                    <li class="flex items-center gap-2"><span class="w-1 h-1 rounded-full bg-blue-400"></span> distilbert-base-uncased (66M params)</li>
                                    <li class="flex items-center gap-2"><span class="w-1 h-1 rounded-full bg-blue-400"></span> Fine-tuned for 3 tasks</li>
                                    <li class="flex items-center gap-2"><span class="w-1 h-1 rounded-full bg-blue-400"></span> Synthetic urgency labels (percentile)</li>
                                    <li class="flex items-center gap-2"><span class="w-1 h-1 rounded-full bg-blue-400"></span> Max length 128, batch 16, 3 epochs</li>
                                </ul>
                            </div>

                            <!-- Preprocessing -->
                            <div class="p-4 bg-gray-50 dark:bg-dark-700 rounded-xl">
                                <div class="flex items-center gap-3 mb-2">
                                    <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                                        <i data-lucide="settings" class="w-4 h-4 text-white"></i>
                                    </div>
                                    <h4 class="font-bold text-gray-900 dark:text-white text-sm">Preprocessing</h4>
                                </div>
                                <ul class="text-xs text-gray-600 dark:text-gray-400 space-y-1 ml-11">
                                    <li class="flex items-center gap-2"><span class="w-1 h-1 rounded-full bg-violet-400"></span> Text cleaning (lowercase, URLs, special chars)</li>
                                    <li class="flex items-center gap-2"><span class="w-1 h-1 rounded-full bg-violet-400"></span> Rare category removal</li>
                                    <li class="flex items-center gap-2"><span class="w-1 h-1 rounded-full bg-violet-400"></span> Synthetic label generation (weighted scoring)</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    }
};
