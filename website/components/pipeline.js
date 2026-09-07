// ── Pipeline Component ────────────────────────────────────────────
const Pipeline = {
    render() {
        return `
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <div class="text-center mb-8 sm:mb-12">
                <span class="inline-block px-4 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-semibold rounded-full mb-4">PIPELINE</span>
                <h2 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">How It Works</h2>
                <p class="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">End-to-end disaster response classification pipeline</p>
            </div>

            <!-- 5-Step Pipeline: Mobile = 2-col grid, Desktop = horizontal -->
            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                <!-- Step 1 -->
                <div class="group bg-white dark:bg-dark-800 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl p-3 sm:p-4 lg:p-5 border border-gray-100 dark:border-dark-700 transition-all duration-300 hover:-translate-y-1">
                    <div class="flex sm:flex-row items-center sm:items-start gap-2.5 sm:gap-3">
                        <div class="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-shadow">
                            <i data-lucide="database" class="w-4 h-4 sm:w-5 sm:h-5 text-white"></i>
                        </div>
                        <div class="text-center sm:text-left">
                            <span class="text-[10px] sm:text-xs font-bold text-gray-400 dark:text-dark-500">01</span>
                            <h3 class="text-xs sm:text-sm font-bold text-gray-900 dark:text-white leading-tight">Data Collection</h3>
                            <p class="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 hidden sm:block">26,180 disaster messages</p>
                        </div>
                    </div>
                </div>

                <!-- Step 2 -->
                <div class="group bg-white dark:bg-dark-800 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl p-3 sm:p-4 lg:p-5 border border-gray-100 dark:border-dark-700 transition-all duration-300 hover:-translate-y-1">
                    <div class="flex sm:flex-row items-center sm:items-start gap-2.5 sm:gap-3">
                        <div class="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/25 group-hover:shadow-emerald-500/40 transition-shadow">
                            <i data-lucide="search" class="w-4 h-4 sm:w-5 sm:h-5 text-white"></i>
                        </div>
                        <div class="text-center sm:text-left">
                            <span class="text-[10px] sm:text-xs font-bold text-gray-400 dark:text-dark-500">02</span>
                            <h3 class="text-xs sm:text-sm font-bold text-gray-900 dark:text-white leading-tight">Descriptive Mining</h3>
                            <p class="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 hidden sm:block">Finding patterns & associations</p>
                        </div>
                    </div>
                </div>

                <!-- Step 3 -->
                <div class="group bg-white dark:bg-dark-800 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl p-3 sm:p-4 lg:p-5 border border-gray-100 dark:border-dark-700 transition-all duration-300 hover:-translate-y-1">
                    <div class="flex sm:flex-row items-center sm:items-start gap-2.5 sm:gap-3">
                        <div class="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center shadow-lg shadow-violet-500/25 group-hover:shadow-violet-500/40 transition-shadow">
                            <i data-lucide="settings" class="w-4 h-4 sm:w-5 sm:h-5 text-white"></i>
                        </div>
                        <div class="text-center sm:text-left">
                            <span class="text-[10px] sm:text-xs font-bold text-gray-400 dark:text-dark-500">03</span>
                            <h3 class="text-xs sm:text-sm font-bold text-gray-900 dark:text-white leading-tight">Preprocessing</h3>
                            <p class="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 hidden sm:block">Text cleaning & feature eng.</p>
                        </div>
                    </div>
                </div>

                <!-- Step 4 -->
                <div class="group bg-white dark:bg-dark-800 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl p-3 sm:p-4 lg:p-5 border border-gray-100 dark:border-dark-700 transition-all duration-300 hover:-translate-y-1">
                    <div class="flex sm:flex-row items-center sm:items-start gap-2.5 sm:gap-3">
                        <div class="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/25 group-hover:shadow-amber-500/40 transition-shadow">
                            <i data-lucide="brain" class="w-4 h-4 sm:w-5 sm:h-5 text-white"></i>
                        </div>
                        <div class="text-center sm:text-left">
                            <span class="text-[10px] sm:text-xs font-bold text-gray-400 dark:text-dark-500">04</span>
                            <h3 class="text-xs sm:text-sm font-bold text-gray-900 dark:text-white leading-tight">Training Models</h3>
                            <p class="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 hidden sm:block">TF-IDF & DistilBERT</p>
                        </div>
                    </div>
                </div>

                <!-- Step 5 -->
                <div class="group bg-white dark:bg-dark-800 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl p-3 sm:p-4 lg:p-5 border border-gray-100 dark:border-dark-700 transition-all duration-300 hover:-translate-y-1 col-span-2 sm:col-span-1">
                    <div class="flex sm:flex-row items-center sm:items-start gap-2.5 sm:gap-3">
                        <div class="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-lg shadow-rose-500/25 group-hover:shadow-rose-500/40 transition-shadow">
                            <i data-lucide="check-circle" class="w-4 h-4 sm:w-5 sm:h-5 text-white"></i>
                        </div>
                        <div class="text-center sm:text-left">
                            <span class="text-[10px] sm:text-xs font-bold text-gray-400 dark:text-dark-500">05</span>
                            <h3 class="text-xs sm:text-sm font-bold text-gray-900 dark:text-white leading-tight">Evaluation</h3>
                            <p class="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 hidden sm:block">F1 analysis & comparison</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    }
};
