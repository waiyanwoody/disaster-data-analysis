// ── Pipeline Component ────────────────────────────────────────────
const Pipeline = {
    render() {
        return `
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <div class="text-center mb-8 sm:mb-12">
                <span class="inline-block px-4 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-semibold rounded-full mb-4">PIPELINE</span>
                <h2 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">How It Works</h2>
                <p class="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">End-to-end KDD process from data collection to deployment</p>
            </div>

            <!-- Flow Diagram -->
            <div class="relative bg-gradient-to-br from-gray-50 to-blue-50 dark:from-dark-800 dark:to-dark-700 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 overflow-hidden border border-gray-200 dark:border-dark-600">
                <!-- Background Pattern -->
                <div class="absolute inset-0 opacity-5">
                    <svg width="100%" height="100%">
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <circle cx="20" cy="20" r="1" fill="currentColor"/>
                        </pattern>
                        <rect width="100%" height="100%" fill="url(#grid)"/>
                    </svg>
                </div>

                <!-- Flow Steps - Stacked on small, horizontal on large -->
                <div class="relative space-y-6 lg:space-y-0 lg:grid lg:grid-cols-9 lg:gap-2 items-center">
                    <!-- Step 1: Data Collection -->
                    <div class="lg:col-span-1 flex flex-row lg:flex-col items-center gap-3 lg:gap-0">
                        <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-xl shadow-cyan-500/30 lg:mb-3 transform hover:scale-110 transition-transform flex-shrink-0">
                            <i data-lucide="database" class="w-8 h-8 sm:w-10 sm:h-10 text-white"></i>
                        </div>
                        <div class="text-left lg:text-center">
                            <div class="font-bold text-sm sm:text-base text-gray-900 dark:text-white mb-0.5">Data Collection</div>
                            <div class="text-xs text-gray-500 dark:text-gray-400">26,180 messages</div>
                            <div class="text-xs text-gray-500 dark:text-gray-400">36 categories</div>
                        </div>
                    </div>

                    <!-- Arrow 1 -->
                    <div class="hidden lg:flex lg:col-span-1 justify-center">
                        <svg width="40" height="30" viewBox="0 0 40 30" fill="none" class="opacity-60">
                            <path d="M5 15 H32 M32 15 L26 11 M32 15 L26 19" stroke="url(#gradient1)" stroke-width="2.5" stroke-linecap="round"/>
                            <defs>
                                <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" style="stop-color:#06b6d4;stop-opacity:1" />
                                    <stop offset="100%" style="stop-color:#10b981;stop-opacity:1" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>

                    <!-- Step 2: Descriptive Mining -->
                    <div class="lg:col-span-1 flex flex-row lg:flex-col items-center gap-3 lg:gap-0">
                        <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-xl shadow-emerald-500/30 lg:mb-3 transform hover:scale-110 transition-transform flex-shrink-0">
                            <i data-lucide="search" class="w-8 h-8 sm:w-10 sm:h-10 text-white"></i>
                        </div>
                        <div class="text-left lg:text-center">
                            <div class="font-bold text-sm sm:text-base text-gray-900 dark:text-white mb-0.5">Descriptive Mining</div>
                            <div class="text-xs text-gray-500 dark:text-gray-400">EDA, Clustering</div>
                            <div class="text-xs text-gray-500 dark:text-gray-400">Association Rules</div>
                        </div>
                    </div>

                    <!-- Arrow 2 -->
                    <div class="hidden lg:flex lg:col-span-1 justify-center">
                        <svg width="40" height="30" viewBox="0 0 40 30" fill="none" class="opacity-60">
                            <path d="M5 15 H32 M32 15 L26 11 M32 15 L26 19" stroke="url(#gradient2)" stroke-width="2.5" stroke-linecap="round"/>
                            <defs>
                                <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" style="stop-color:#10b981;stop-opacity:1" />
                                    <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:1" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>

                    <!-- Step 3: Preprocessing -->
                    <div class="lg:col-span-1 flex flex-row lg:flex-col items-center gap-3 lg:gap-0">
                        <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-xl shadow-violet-500/30 lg:mb-3 transform hover:scale-110 transition-transform flex-shrink-0">
                            <i data-lucide="settings" class="w-8 h-8 sm:w-10 sm:h-10 text-white"></i>
                        </div>
                        <div class="text-left lg:text-center">
                            <div class="font-bold text-sm sm:text-base text-gray-900 dark:text-white mb-0.5">Preprocessing</div>
                            <div class="text-xs text-gray-500 dark:text-gray-400">Text cleaning</div>
                            <div class="text-xs text-gray-500 dark:text-gray-400">Feature eng.</div>
                        </div>
                    </div>

                    <!-- Arrow 3 -->
                    <div class="hidden lg:flex lg:col-span-1 justify-center">
                        <svg width="40" height="30" viewBox="0 0 40 30" fill="none" class="opacity-60">
                            <path d="M5 15 H32 M32 15 L26 11 M32 15 L26 19" stroke="url(#gradient3)" stroke-width="2.5" stroke-linecap="round"/>
                            <defs>
                                <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" style="stop-color:#8b5cf6;stop-opacity:1" />
                                    <stop offset="100%" style="stop-color:#f59e0b;stop-opacity:1" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>

                    <!-- Step 4: Training Models -->
                    <div class="lg:col-span-1 flex flex-row lg:flex-col items-center gap-3 lg:gap-0">
                        <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-xl shadow-amber-500/30 lg:mb-3 transform hover:scale-110 transition-transform flex-shrink-0">
                            <i data-lucide="brain" class="w-8 h-8 sm:w-10 sm:h-10 text-white"></i>
                        </div>
                        <div class="text-left lg:text-center">
                            <div class="font-bold text-sm sm:text-base text-gray-900 dark:text-white mb-0.5">Training Models</div>
                            <div class="text-xs text-gray-500 dark:text-gray-400">TF-IDF + ML</div>
                            <div class="text-xs text-gray-500 dark:text-gray-400">DistilBERT</div>
                        </div>
                    </div>

                    <!-- Arrow 4 -->
                    <div class="hidden lg:flex lg:col-span-1 justify-center">
                        <svg width="40" height="30" viewBox="0 0 40 30" fill="none" class="opacity-60">
                            <path d="M5 15 H32 M32 15 L26 11 M32 15 L26 19" stroke="url(#gradient4)" stroke-width="2.5" stroke-linecap="round"/>
                            <defs>
                                <linearGradient id="gradient4" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" style="stop-color:#f59e0b;stop-opacity:1" />
                                    <stop offset="100%" style="stop-color:#ec4899;stop-opacity:1" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>

                    <!-- Step 5: Evaluation -->
                    <div class="lg:col-span-1 flex flex-row lg:flex-col items-center gap-3 lg:gap-0">
                        <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-xl shadow-pink-500/30 lg:mb-3 transform hover:scale-110 transition-transform flex-shrink-0">
                            <i data-lucide="check-circle" class="w-8 h-8 sm:w-10 sm:h-10 text-white"></i>
                        </div>
                        <div class="text-left lg:text-center">
                            <div class="font-bold text-sm sm:text-base text-gray-900 dark:text-white mb-0.5">Evaluation</div>
                            <div class="text-xs text-gray-500 dark:text-gray-400">F1: 84.9%</div>
                            <div class="text-xs text-gray-500 dark:text-gray-400">Deployment</div>
                        </div>
                    </div>
                </div>

                
                        </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    }
};
