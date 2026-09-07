// ── Header Component ──────────────────────────────────────────────
const Header = {
    render() {
        return `
        <nav class="fixed top-0 w-full bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-dark-700/50 z-50 transition-colors">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between h-16">
                    <!-- Logo -->
                    <div class="flex items-center gap-3">
                        <a href="#home" onclick="navigate('home')" class="flex items-center gap-3 group">
                            <div class="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-shadow">
                                <i data-lucide="zap" class="w-5 h-5 text-white"></i>
                            </div>
                            <span class="font-bold text-lg text-gray-900 dark:text-white hidden sm:block">Disaster Data Analysis</span>
                        </a>
                    </div>

                    <!-- Desktop Nav -->
                    <div class="hidden md:flex items-center gap-1" id="nav-links"></div>

                    <!-- Actions -->
                    <div class="flex items-center gap-2">
                        <button onclick="toggleTheme()" class="p-2.5 rounded-xl bg-gray-100 dark:bg-dark-700 hover:bg-gray-200 dark:hover:bg-dark-600 transition-colors" id="theme-toggle" title="Toggle dark mode">
                            <i data-lucide="sun" class="w-5 h-5 hidden dark:block text-yellow-400"></i>
                            <i data-lucide="moon" class="w-5 h-5 block dark:hidden text-gray-600"></i>
                        </button>
                        <button class="md:hidden p-2.5 rounded-xl bg-gray-100 dark:bg-dark-700 hover:bg-gray-200 dark:hover:bg-dark-600 transition-colors" onclick="toggleMobileMenu()">
                            <i data-lucide="menu" class="w-5 h-5 text-gray-600 dark:text-gray-300"></i>
                        </button>
                    </div>
                </div>
            </div>
            <div class="md:hidden hidden border-t border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-800" id="mobile-menu"></div>
        </nav>`;
    }
};

// ── Theme Toggle ──────────────────────────────────────────────────
function toggleTheme() {
    const html = document.documentElement;
    if (html.classList.contains('dark')) {
        html.classList.remove('dark');
        html.classList.add('light');
        localStorage.setItem('theme', 'light');
    } else {
        html.classList.remove('light');
        html.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    }
    lucide.createIcons();
}
