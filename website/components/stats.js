// ── Stats Component ───────────────────────────────────────────────
const Stats = {
    render() {
        const d = PROJECT.dataset;
        return `
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-12 relative z-10">
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <!-- Stat 1 -->
                <div class="group bg-white dark:bg-dark-800 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl p-3 sm:p-5 transform hover:-translate-y-1 transition-all duration-300 border border-gray-100 dark:border-dark-700">
                    <div class="flex items-center gap-2.5 sm:gap-3">
                        <div class="flex-shrink-0 w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-shadow">
                            <i data-lucide="message-square" class="w-4 h-4 sm:w-5 sm:h-5 text-white"></i>
                        </div>
                        <div class="min-w-0">
                            <p class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white leading-tight">${d.totalMessages.toLocaleString()}</p>
                            <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">Total Messages</p>
                        </div>
                    </div>
                </div>

                <!-- Stat 2 -->
                <div class="group bg-white dark:bg-dark-800 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl p-3 sm:p-5 transform hover:-translate-y-1 transition-all duration-300 border border-gray-100 dark:border-dark-700">
                    <div class="flex items-center gap-2.5 sm:gap-3">
                        <div class="flex-shrink-0 w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/25 group-hover:shadow-emerald-500/40 transition-shadow">
                            <i data-lucide="layers" class="w-4 h-4 sm:w-5 sm:h-5 text-white"></i>
                        </div>
                        <div class="min-w-0">
                            <p class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white leading-tight">${d.categories}</p>
                            <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">Categories</p>
                        </div>
                    </div>
                </div>

                <!-- Stat 3 -->
                <div class="group bg-white dark:bg-dark-800 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl p-3 sm:p-5 transform hover:-translate-y-1 transition-all duration-300 border border-gray-100 dark:border-dark-700">
                    <div class="flex items-center gap-2.5 sm:gap-3">
                        <div class="flex-shrink-0 w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center shadow-lg shadow-violet-500/25 group-hover:shadow-violet-500/40 transition-shadow">
                            <i data-lucide="cpu" class="w-4 h-4 sm:w-5 sm:h-5 text-white"></i>
                        </div>
                        <div class="min-w-0">
                            <p class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white leading-tight">3</p>
                            <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">Models Trained</p>
                        </div>
                    </div>
                </div>

                <!-- Stat 4 -->
                <div class="group bg-white dark:bg-dark-800 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl p-3 sm:p-5 transform hover:-translate-y-1 transition-all duration-300 border border-gray-100 dark:border-dark-700">
                    <div class="flex items-center gap-2.5 sm:gap-3">
                        <div class="flex-shrink-0 w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/25 group-hover:shadow-amber-500/40 transition-shadow">
                            <i data-lucide="brain" class="w-4 h-4 sm:w-5 sm:h-5 text-white"></i>
                        </div>
                        <div class="min-w-0">
                            <p class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white leading-tight">2</p>
                            <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">Architectures</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    }
};
