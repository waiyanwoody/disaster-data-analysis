// ── Test Form Component ───────────────────────────────────────────
const TestForm = {
    demos: [
        { msg: "People are trapped under collapsed buildings, we need rescue teams now.", genre: "direct", label: "Rescue Request", color: "red" },
        { msg: "Weather update — a cold front from Cuba could pass over Haiti tomorrow.", genre: "news", label: "Weather Update", color: "blue" },
        { msg: "We have no food or water in our shelter. Children are sick.", genre: "direct", label: "Shelter Emergency", color: "orange" },
        { msg: "Government announces new relief fund for flood victims.", genre: "news", label: "Relief News", color: "green" },
        { msg: "Hospital completely destroyed by earthquake. Patients on the street.", genre: "direct", label: "Medical Emergency", color: "red" },
        { msg: "Storm approaching the northern coast. Residents advised to evacuate.", genre: "news", label: "Evacuation Alert", color: "yellow" },
        { msg: "We are dying of hunger — 500 people in Delmas 19 need immediate help.", genre: "direct", label: "Hunger Crisis", color: "red" },
        { msg: "Missing: my sister Maryani, last seen near Petionville on Tuesday.", genre: "direct", label: "Missing Person", color: "purple" },
    ],

    render() {
        return `
        <div class="bg-white dark:bg-dark-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-dark-700">
            <!-- Header -->
            <div class="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <i data-lucide="play-circle" class="w-5 h-5 text-white"></i>
                    </div>
                    <div>
                        <h2 class="font-bold text-lg text-white">Run Prediction</h2>
                        <p class="text-blue-100 text-sm">Test models with custom messages</p>
                    </div>
                </div>
            </div>

            <div class="p-6">
                <!-- Demo Templates -->
                <div class="mb-6">
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Quick Templates</label>
                    <div class="flex flex-wrap gap-2">
                        ${this.demos.map((d, i) => `
                            <button onclick="TestForm.selectDemo(${i})" class="demo-chip px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 dark:border-dark-600 text-gray-600 dark:text-gray-400 hover:border-blue-400 hover:text-blue-600 dark:hover:border-blue-500 dark:hover:text-blue-400 transition-all hover:shadow-sm" data-genre="${d.genre}">
                                <span class="inline-flex items-center gap-1">
                                    <span class="w-1.5 h-1.5 rounded-full bg-${d.color}-500"></span>
                                    ${d.label}
                                </span>
                            </button>
                        `).join('')}
                    </div>
                </div>

                <!-- Form Fields -->
                <div class="grid md:grid-cols-3 gap-4 mb-4">
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Model Type</label>
                        <select id="testModelType" class="w-full px-4 py-3 bg-gray-50 dark:bg-dark-700 border border-gray-200 dark:border-dark-600 rounded-xl text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors">
                            <option value="ml">TF-IDF + Classical ML</option>
                            <option value="dl">DistilBERT Transformer</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Endpoint</label>
                        <select id="testEndpoint" class="w-full px-4 py-3 bg-gray-50 dark:bg-dark-700 border border-gray-200 dark:border-dark-600 rounded-xl text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors">
                            <option value="all">All Predictions</option>
                            <option value="urgency">Urgency Level</option>
                            <option value="binary">Disaster Binary</option>
                            <option value="essential">Essential Categories</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Genre</label>
                        <select id="testGenre" class="w-full px-4 py-3 bg-gray-50 dark:bg-dark-700 border border-gray-200 dark:border-dark-600 rounded-xl text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors">
                            <option value="direct">direct</option>
                            <option value="news">news</option>
                            <option value="social">social</option>
                        </select>
                    </div>
                </div>

                <!-- Message -->
                <div class="mb-5">
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Message</label>
                    <textarea id="testMessage" rows="3" class="w-full px-4 py-3 bg-gray-50 dark:bg-dark-700 border border-gray-200 dark:border-dark-600 rounded-xl text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none" placeholder="Enter a disaster message...">We are dying of hunger - 500 people in Delmas 19 need immediate help</textarea>
                </div>

                <!-- Submit -->
                <div class="flex items-center gap-4">
                    <button onclick="runTestPrediction()" class="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 transform transition-all duration-200">
                        <i data-lucide="play" class="w-4 h-4"></i>
                        Run Prediction
                    </button>
                    <span id="testEndpointUrl" class="text-xs text-gray-400 dark:text-gray-500 font-mono bg-gray-100 dark:bg-dark-700 px-3 py-1.5 rounded-lg">POST /ml/predict/all</span>
                </div>

                ${ResultView.render()}
            </div>
        </div>`;
    },

    selectDemo(index) {
        const demo = this.demos[index];
        const msgEl = document.getElementById('testMessage');
        const genreEl = document.getElementById('testGenre');
        if (msgEl) msgEl.value = demo.msg;
        if (genreEl) genreEl.value = demo.genre;

        // Highlight active chip
        document.querySelectorAll('.demo-chip').forEach((chip, i) => {
            if (i === index) {
                chip.classList.add('border-blue-500', 'text-blue-600', 'dark:text-blue-400', 'bg-blue-50', 'dark:bg-blue-900/20');
            } else {
                chip.classList.remove('border-blue-500', 'text-blue-600', 'dark:text-blue-400', 'bg-blue-50', 'dark:bg-blue-900/20');
            }
        });
    }
};
