// ── Footer Component ──────────────────────────────────────────────
const Footer = {
    render() {
        return `
        <footer class="bg-gray-900 dark:bg-dark-950 text-gray-400 mt-16">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div class="flex flex-col md:flex-row items-center justify-between gap-6">
                    <!-- Brand -->
                    <div class="flex items-center gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 40 40" fill="none">
                            <path d="M13.0964 20.3536L17.6262 22.4473L17.046 27.6527L8.94876 36.8282C4.2486 33.8023 0.898178 28.8615 0 23.108L13.0964 20.3536Z" fill="#15E3FF"/>
                            <path d="M25.183 25.94L31.2414 36.3789C27.992 38.6605 24.0331 40 19.7612 40C18.3744 40 17.0206 39.8587 15.7133 39.59L17.046 27.6527L20.4765 23.7656L25.183 25.94Z" fill="#348DFC"/>
                            <path d="M39.1022 14.881C39.5332 16.5143 39.763 18.2294 39.763 19.9982C39.763 24.1145 38.5192 27.9403 36.3874 31.1207L25.184 25.9405L22.5551 21.4123L25.8574 17.6692L39.1022 14.881Z" fill="#FD4873"/>
                            <path d="M20.132 0C26.1505 0.109415 31.5194 2.877 35.1148 7.17842L25.8561 17.6694L20.9792 18.6959L18.519 14.4574L20.132 0Z" fill="#FFC700"/>
                            <path d="M18.519 14.4574L17.9745 19.3269L13.0991 20.353L0.514709 14.5347C2.09964 8.94044 6.05794 4.3436 11.2327 1.9007L18.519 14.4574Z" fill="#00E7B9"/>
                        </svg>
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
