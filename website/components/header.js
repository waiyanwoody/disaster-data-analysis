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
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 40 40" fill="none" class="group-hover:scale-105 transition-transform">
                                <path d="M13.0964 20.3536L17.6262 22.4473L17.046 27.6527L8.94876 36.8282C4.2486 33.8023 0.898178 28.8615 0 23.108L13.0964 20.3536Z" fill="#15E3FF"/>
                                <path d="M25.183 25.94L31.2414 36.3789C27.992 38.6605 24.0331 40 19.7612 40C18.3744 40 17.0206 39.8587 15.7133 39.59L17.046 27.6527L20.4765 23.7656L25.183 25.94Z" fill="#348DFC"/>
                                <path d="M39.1022 14.881C39.5332 16.5143 39.763 18.2294 39.763 19.9982C39.763 24.1145 38.5192 27.9403 36.3874 31.1207L25.184 25.9405L22.5551 21.4123L25.8574 17.6692L39.1022 14.881Z" fill="#FD4873"/>
                                <path d="M20.132 0C26.1505 0.109415 31.5194 2.877 35.1148 7.17842L25.8561 17.6694L20.9792 18.6959L18.519 14.4574L20.132 0Z" fill="#FFC700"/>
                                <path d="M18.519 14.4574L17.9745 19.3269L13.0991 20.353L0.514709 14.5347C2.09964 8.94044 6.05794 4.3436 11.2327 1.9007L18.519 14.4574Z" fill="#00E7B9"/>
                            </svg>
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
