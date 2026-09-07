// ── Footer Component ──────────────────────────────────────────────
const Footer = {
    render() {
        return `
        <footer class="bg-gray-900 dark:bg-dark-950 text-gray-400 mt-16">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div class="flex flex-col md:flex-row items-center justify-between gap-6">
                    <!-- Brand -->
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                            <i data-lucide="zap" class="w-5 h-5 text-white"></i>
                        </div>
                        <div>
                            <span class="font-bold text-lg text-white block">Disaster Data Analysis</span>
                            <p class="text-xs text-gray-500">IS-212 Data and Knowledge Mining</p>
                        </div>
                    </div>

                    <!-- Links -->
                    <div class="flex items-center gap-6">
                        <a href="#home" onclick="navigate('home')" class="text-gray-400 hover:text-white transition-colors text-sm font-medium">Home</a>
                        <a href="#models-testing" onclick="navigate('models-testing')" class="text-gray-400 hover:text-white transition-colors text-sm font-medium">Test Models</a>
                        <a href="#insights-discoveries" onclick="navigate('insights-discoveries')" class="text-gray-400 hover:text-white transition-colors text-sm font-medium">Insights</a>
                    </div>
                </div>

                <div class="border-t border-gray-800 dark:border-dark-700 mt-8 pt-8 text-center">
                    <p class="text-sm text-gray-500">University of Computer Studies, Yangon</p>
                    <p class="text-xs text-gray-600 mt-1">Mg. Wai Yan Tun — Disaster Data Analysis and Predictive Mining</p>
                </div>
            </div>
        </footer>`;
    }
};
