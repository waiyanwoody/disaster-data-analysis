// ── Result View Component ─────────────────────────────────────────
const ResultView = {
    render() {
        return `
        <div id="testResult" class="mt-6 hidden">
            <!-- Human Readable View -->
            <div id="testReadable" class="bg-gradient-to-br from-gray-50 to-white dark:from-dark-700 dark:to-dark-800 border border-gray-200 dark:border-dark-600 rounded-2xl p-6">
                <div class="flex items-center justify-between mb-4">
                    <span class="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <i data-lucide="eye" class="w-4 h-4"></i> Result
                    </span>
                    <div class="flex gap-2">
                        <button onclick="toggleJsonView(false)" id="btnReadable" class="px-3 py-1 text-xs font-medium rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 flex items-center gap-1 transition-colors">
                            <i data-lucide="eye" class="w-3 h-3"></i> Readable
                        </button>
                        <button onclick="toggleJsonView(true)" id="btnJson" class="px-3 py-1 text-xs font-medium rounded-lg bg-gray-100 dark:bg-dark-600 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-dark-500 transition-colors flex items-center gap-1">
                            <i data-lucide="code" class="w-3 h-3"></i> JSON
                        </button>
                    </div>
                </div>
                <div id="testReadableContent"></div>
            </div>
            <!-- JSON View (hidden by default) -->
            <div id="testJson" class="hidden mt-4 relative">
                <div class="flex items-center justify-between mb-2">
                    <span class="text-sm font-semibold text-gray-600 dark:text-gray-400 flex items-center gap-2">
                        <i data-lucide="code" class="w-4 h-4"></i> JSON Response
                    </span>
                    <button onclick="toggleJsonView(false)" class="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center gap-1 transition-colors font-medium">
                        <i data-lucide="arrow-left" class="w-3 h-3"></i> Back to Readable
                    </button>
                </div>
                <pre id="testOutput" class="bg-gray-900 dark:bg-dark-950 text-green-400 p-4 pr-16 rounded-xl text-sm overflow-x-auto max-h-96 border border-gray-700 dark:border-dark-600 font-mono"></pre>
                <button onclick="copyResult()" class="absolute bottom-4 right-4 px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-700 dark:bg-dark-600 text-gray-300 hover:bg-gray-600 dark:hover:bg-dark-500 hover:text-white transition-colors flex items-center gap-1">
                    <i data-lucide="clipboard" class="w-3 h-3"></i> Copy
                </button>
            </div>
        </div>`;
    }
};
