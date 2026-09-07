// ── Model Cards Component ─────────────────────────────────────────
const ModelCards = {
    render() {
        const ml = PROJECT.models.ml;
        const dl = PROJECT.models.dl;
        return `
        <div class="grid md:grid-cols-2 gap-6 mb-8">
            <!-- ML Card -->
            <div class="group bg-white dark:bg-dark-800 rounded-2xl shadow-lg hover:shadow-xl overflow-hidden border border-gray-100 dark:border-dark-700 transition-all duration-300 hover:-translate-y-1">
                <div class="bg-gradient-to-r from-gray-600 to-gray-700 px-6 py-4">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <i data-lucide="bar-chart" class="w-5 h-5 text-white"></i>
                        </div>
                        <div>
                            <h2 class="font-bold text-lg text-white">${ml.name}</h2>
                            <p class="text-gray-200 text-sm">Classical ML Pipeline</p>
                        </div>
                    </div>
                </div>
                <div class="p-6">
                    <p class="text-gray-500 dark:text-gray-400 text-sm mb-5">${ml.description}</p>
                    <div class="grid grid-cols-2 gap-3">
                        <div class="p-3 bg-gray-50 dark:bg-dark-700 rounded-xl">
                            <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">Binary F1</div>
                            <div class="text-xl font-bold text-gray-900 dark:text-white">${ml.binary.f1}</div>
                        </div>
                        <div class="p-3 bg-gray-50 dark:bg-dark-700 rounded-xl">
                            <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">Binary Recall</div>
                            <div class="text-xl font-bold text-gray-900 dark:text-white">${ml.binary.recall}</div>
                        </div>
                        <div class="p-3 bg-gray-50 dark:bg-dark-700 rounded-xl">
                            <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">Essential F1 μ</div>
                            <div class="text-xl font-bold text-gray-900 dark:text-white">${ml.essential.f1_micro}</div>
                        </div>
                        <div class="p-3 bg-gray-50 dark:bg-dark-700 rounded-xl">
                            <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">Urgency F1 M</div>
                            <div class="text-xl font-bold text-gray-900 dark:text-white">${ml.urgency.f1_macro}</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- DL Card -->
            <div class="group bg-white dark:bg-dark-800 rounded-2xl shadow-lg hover:shadow-xl overflow-hidden border border-gray-100 dark:border-dark-700 transition-all duration-300 hover:-translate-y-1">
                <div class="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <i data-lucide="brain" class="w-5 h-5 text-white"></i>
                        </div>
                        <div>
                            <h2 class="font-bold text-lg text-white">${dl.name}</h2>
                            <p class="text-blue-100 text-sm">Transformer Architecture</p>
                        </div>
                    </div>
                </div>
                <div class="p-6">
                    <p class="text-gray-500 dark:text-gray-400 text-sm mb-5">${dl.description}</p>
                    <div class="grid grid-cols-2 gap-3">
                        <div class="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                            <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">Binary F1</div>
                            <div class="text-xl font-bold text-blue-600 dark:text-blue-400">${dl.binary.f1}</div>
                        </div>
                        <div class="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                            <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">Binary Recall</div>
                            <div class="text-xl font-bold text-blue-600 dark:text-blue-400">${dl.binary.recall}</div>
                        </div>
                        <div class="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                            <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">Essential F1 μ</div>
                            <div class="text-xl font-bold text-blue-600 dark:text-blue-400">${dl.essential.f1_micro}</div>
                        </div>
                        <div class="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                            <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">Urgency F1 M</div>
                            <div class="text-xl font-bold text-blue-600 dark:text-blue-400">${dl.urgency.f1_macro}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    }
};
