// ── Test Form Component ───────────────────────────────────────────
const TestForm = {
    demos: [
            // 🔴 CRITICAL urgency — disaster (mix eng + myanmar)
            { msg: "ဒီဘက်မှာ အစားအစာတွေ ပြတ်လပ်နေပါတယ်။ လူတွေ စားစရာနဲ့ သောက်ရေ အရေးပေါ်လိုအပ်နေပါတယ်။", genre: "direct", label: "Hunger Crisis 🔴", color: "red" },
            { msg: "လူများစွာ သေဆုံးနေကြသည်။ ဆေးဝါးနှင့် အစားအစာ ချက်ချင်းလိုအပ်သည်။", genre: "direct", label: "Myanmar: Death+Medical 🔴", color: "red" },
            { msg: "ငလျင်ဒဏ်ခံရသူများ အစားအသောက် ရေနှင့် ဆေးဝါး လိုအပ်နေသည်", genre: "direct", label: "Myanmar: Earthquake 🔴", color: "red" },
            { msg: "ရေကြီးပြီးနောက် ကလေး ၂ ယောက် ပျောက်ဆုံးနေ၍ မိဘများ အလွန်ပူပန်လျက် ရှာဖွေနေသည်", genre: "direct", label: "Myanmar: Missing People 🔴", color: "red" },
            // 🟠 HIGH urgency — disaster (mix eng + myanmar)
            { msg: "Rising floodwaters forcing hundreds to evacuate their homes", genre: "news", label: "Flood Rescue 🟠", color: "orange" },
            { msg: "ရေကြီးမှုကြောင့် လူထောင်ပေါင်းများစွာ အိမ်မဲ့ဖြစ်နေ၊ အရေးတကြီး နေရာထိုင်ခင်း လိုအပ်သည်", genre: "direct", label: "Myanmar: Flood Shelter 🟠", color: "orange" },
            { msg: "Storm damage to infrastructure affecting hundreds of homes in the area", genre: "news", label: "Storm Damage 🟠", color: "orange" },
            { msg: "မုန်တိုင်းကြောင့် မြို့နယ်တစ်ခုလုံး လျှပ်စစ်မီးနှင့် ရေပေးဝေမှု ပြတ်တောက်နေသည်", genre: "news", label: "Myanmar: Storm Outage 🟠", color: "orange" },
            { msg: "Families desperately searching for missing relatives after earthquake destroyed neighborhood", genre: "direct", label: "Missing People 🟠", color: "orange" },
            // 🟡 MEDIUM urgency — disaster (english)
            { msg: "Storm left 200 families without power or clean water for two days", genre: "news", label: "Storm Aftermath 🟡", color: "yellow" },
            { msg: "Flooding has cut off road access to three villages, supplies running low", genre: "news", label: "Villages Cut Off 🟡", color: "yellow" },
            // 🟢 LOW urgency — NOT disaster (mix eng + myanmar)
            { msg: "Weather forecast calls for sunny skies and mild temperatures this week", genre: "news", label: "Not Disaster 🟢", color: "green" },
            { msg: "မြို့လယ်တွင် ဈေးသစ်တစ်ခု ယနေ့နံနက် ဖွင့်လှစ်ခဲ့သည်", genre: "news", label: "Myanmar: City News 🟢", color: "green" },
            { msg: "အစိုးရသည် အခြေခံအဆောက်အဦ ဖွံ့ဖြိုးရေးအတွက် ဘတ်ဂျက်အသစ် ကြေညာသည်", genre: "news", label: "Myanmar: Budget News 🟢", color: "green" },
            { msg: "The president gave a speech about the economy today", genre: "news", label: "Not Disaster 🟢", color: "green" },
            { msg: "Annual disaster preparedness drill scheduled for next month in the city", genre: "news", label: "Drill Notice 🟢", color: "green" },
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
                    <textarea id="testMessage" rows="3" class="w-full px-4 py-3 bg-gray-50 dark:bg-dark-700 border border-gray-200 dark:border-dark-600 rounded-xl text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none" placeholder="Enter a disaster message...">we need water and food, children are dying</textarea>
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

                <!-- Urgency Classification Explanation -->
<!--                <div class="mt-8 pt-6 border-t border-gray-100 dark:border-dark-700">-->
<!--                    <div class="flex items-center gap-2 mb-4">-->
<!--                        <i data-lucide="info" class="w-5 h-5 text-blue-600 dark:text-blue-400"></i>-->
<!--                        <h3 class="font-semibold text-gray-700 dark:text-gray-300">Urgency Classification System</h3>-->
<!--                    </div>-->
<!--                    -->
<!--                    <div class="bg-gray-50 dark:bg-dark-800/50 rounded-xl p-4 mb-4">-->
<!--                        <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">-->
<!--                            Urgency levels are determined by category weights and scoring thresholds:-->
<!--                        </p>-->
<!--                        -->
<!--                        &lt;!&ndash; Weight Categories &ndash;&gt;-->
<!--                        <div class="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">-->
<!--                            &lt;!&ndash; Weight 4 &ndash;&gt;-->
<!--                            <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">-->
<!--                                <div class="flex items-center gap-2 mb-2">-->
<!--                                    <span class="w-2 h-2 rounded-full bg-red-500"></span>-->
<!--                                    <span class="text-xs font-bold text-red-700 dark:text-red-400">Weight 4 (Critical)</span>-->
<!--                                </div>-->
<!--                                <ul class="text-xs text-gray-600 dark:text-gray-400 space-y-1">-->
<!--                                    <li class="font-medium">death</li>-->
<!--                                </ul>-->
<!--                            </div>-->
<!--                            -->
<!--                            &lt;!&ndash; Weight 3 &ndash;&gt;-->
<!--                            <div class="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-3">-->
<!--                                <div class="flex items-center gap-2 mb-2">-->
<!--                                    <span class="w-2 h-2 rounded-full bg-orange-500"></span>-->
<!--                                    <span class="text-xs font-bold text-orange-700 dark:text-orange-400">Weight 3 (High)</span>-->
<!--                                </div>-->
<!--                                <ul class="text-xs text-gray-600 dark:text-gray-400 space-y-1">-->
<!--                                    <li>medical_help</li>-->
<!--                                    <li>medical_products</li>-->
<!--                                    <li>search_and_rescue</li>-->
<!--                                    <li>missing_people</li>-->
<!--                                </ul>-->
<!--                            </div>-->
<!--                            -->
<!--                            &lt;!&ndash; Weight 2 &ndash;&gt;-->
<!--                            <div class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">-->
<!--                                <div class="flex items-center gap-2 mb-2">-->
<!--                                    <span class="w-2 h-2 rounded-full bg-yellow-500"></span>-->
<!--                                    <span class="text-xs font-bold text-yellow-700 dark:text-yellow-400">Weight 2 (Medium)</span>-->
<!--                                </div>-->
<!--                                <ul class="text-xs text-gray-600 dark:text-gray-400 space-y-1">-->
<!--                                    <li>water</li>-->
<!--                                    <li>food</li>-->
<!--                                    <li>shelter</li>-->
<!--                                    <li>floods</li>-->
<!--                                    <li>earthquake</li>-->
<!--                                    <li>storm</li>-->
<!--                                    <li>fire</li>-->
<!--                                </ul>-->
<!--                            </div>-->
<!--                            -->
<!--                            &lt;!&ndash; Weight 1 &ndash;&gt;-->
<!--                            <div class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">-->
<!--                                <div class="flex items-center gap-2 mb-2">-->
<!--                                    <span class="w-2 h-2 rounded-full bg-green-500"></span>-->
<!--                                    <span class="text-xs font-bold text-green-700 dark:text-green-400">Weight 1 (Low)</span>-->
<!--                                </div>-->
<!--                                <ul class="text-xs text-gray-600 dark:text-gray-400 space-y-1">-->
<!--                                    <li>infrastructure_related</li>-->
<!--                                    <li>transport</li>-->
<!--                                    <li>buildings</li>-->
<!--                                    <li>electricity</li>-->
<!--                                    <li>other_aid</li>-->
<!--                                    <li>refugees</li>-->
<!--                                    <li>direct_report</li>-->
<!--                                </ul>-->
<!--                            </div>-->
<!--                        </div>-->
<!--                        -->
<!--                        &lt;!&ndash; Thresholds &ndash;&gt;-->
<!--                        <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">-->
<!--                            <h4 class="text-xs font-bold text-blue-700 dark:text-blue-400 mb-2">Urgency Thresholds</h4>-->
<!--                            <div class="grid grid-cols-2 md:grid-cols-4 gap-3">-->
<!--                                <div class="text-center">-->
<!--                                    <div class="text-lg font-bold text-green-600 dark:text-green-400">Low</div>-->
<!--                                    <div class="text-xs text-gray-600 dark:text-gray-400">Score ≤ 0</div>-->
<!--                                </div>-->
<!--                                <div class="text-center">-->
<!--                                    <div class="text-lg font-bold text-yellow-600 dark:text-yellow-400">Medium</div>-->
<!--                                    <div class="text-xs text-gray-600 dark:text-gray-400">Score 1-3</div>-->
<!--                                </div>-->
<!--                                <div class="text-center">-->
<!--                                    <div class="text-lg font-bold text-orange-600 dark:text-orange-400">High</div>-->
<!--                                    <div class="text-xs text-gray-600 dark:text-gray-400">Score 4-6</div>-->
<!--                                </div>-->
<!--                                <div class="text-center">-->
<!--                                    <div class="text-lg font-bold text-red-600 dark:text-red-400">Critical</div>-->
<!--                                    <div class="text-xs text-gray-600 dark:text-gray-400">Score ≥ 7</div>-->
<!--                                </div>-->
<!--                            </div>-->
<!--                        </div>-->
<!--                    </div>-->
<!--                    -->
<!--                    &lt;!&ndash; Essential Categories Note &ndash;&gt;-->
<!--                    <div class="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4">-->
<!--                        <div class="flex items-center gap-2 mb-2">-->
<!--                            <i data-lucide="list" class="w-4 h-4 text-purple-600 dark:text-purple-400"></i>-->
<!--                            <h4 class="text-sm font-semibold text-purple-700 dark:text-purple-400">Essential Categories Prediction</h4>-->
<!--                        </div>-->
<!--                        <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">-->
<!--                            Multi-label prediction uses 10 essential categories (rare categories removed):-->
<!--                        </p>-->
<!--                        <div class="flex flex-wrap gap-1.5">-->
<!--                            <span class="px-2 py-1 text-xs bg-white dark:bg-dark-700 text-purple-700 dark:text-purple-400 rounded border border-purple-200 dark:border-purple-800">medical_help</span>-->
<!--                            <span class="px-2 py-1 text-xs bg-white dark:bg-dark-700 text-purple-700 dark:text-purple-400 rounded border border-purple-200 dark:border-purple-800">medical_products</span>-->
<!--                            <span class="px-2 py-1 text-xs bg-white dark:bg-dark-700 text-purple-700 dark:text-purple-400 rounded border border-purple-200 dark:border-purple-800">death</span>-->
<!--                            <span class="px-2 py-1 text-xs bg-white dark:bg-dark-700 text-purple-700 dark:text-purple-400 rounded border border-purple-200 dark:border-purple-800">floods</span>-->
<!--                            <span class="px-2 py-1 text-xs bg-white dark:bg-dark-700 text-purple-700 dark:text-purple-400 rounded border border-purple-200 dark:border-purple-800">storm</span>-->
<!--                            <span class="px-2 py-1 text-xs bg-white dark:bg-dark-700 text-purple-700 dark:text-purple-400 rounded border border-purple-200 dark:border-purple-800">earthquake</span>-->
<!--                            <span class="px-2 py-1 text-xs bg-white dark:bg-dark-700 text-purple-700 dark:text-purple-400 rounded border border-purple-200 dark:border-purple-800">water</span>-->
<!--                            <span class="px-2 py-1 text-xs bg-white dark:bg-dark-700 text-purple-700 dark:text-purple-400 rounded border border-purple-200 dark:border-purple-800">food</span>-->
<!--                            <span class="px-2 py-1 text-xs bg-white dark:bg-dark-700 text-purple-700 dark:text-purple-400 rounded border border-purple-200 dark:border-purple-800">shelter</span>-->
<!--                            <span class="px-2 py-1 text-xs bg-white dark:bg-dark-700 text-purple-700 dark:text-purple-400 rounded border border-purple-200 dark:border-purple-800">aid_related</span>-->
<!--                        </div>-->
<!--                        <p class="text-xs text-gray-500 dark:text-gray-500 mt-2">-->
<!--                            <i>Removed rare categories: search_and_rescue, transport, missing_people</i>-->
<!--                        </p>-->
<!--                    </div>-->
<!--                </div>-->
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
