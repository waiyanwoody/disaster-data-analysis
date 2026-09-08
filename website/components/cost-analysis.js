// ── Cost Analysis Component ───────────────────────────────────────
const CostAnalysis = {
    _storageBars(models, colorClass, totalMb) {
        const maxBar = Math.max(...Object.values(models).map(m => m.size_mb));
        return Object.values(models).map(m => {
            const pct = Math.round((m.size_mb / totalMb) * 100);
            const barW = Math.round((m.size_mb / maxBar) * 100);
            const display = m.size_mb >= 1000 ? (m.size_mb/1024).toFixed(1)+' GB' : m.size_mb+' MB';
            return `
            <div class="mb-3">
                <div class="flex justify-between items-center mb-1">
                    <span class="text-sm text-gray-700 dark:text-gray-300 font-medium">${m.label}</span>
                    <span class="text-sm font-bold ${colorClass}">${display}</span>
                </div>
                <div class="w-full bg-gray-100 dark:bg-dark-600 rounded-full h-2.5 overflow-hidden">
                    <div class="h-2.5 rounded-full transition-all duration-700 ${colorClass.replace('text-','bg-')}" style="width:${barW}%"></div>
                </div>
                <div class="text-xs text-gray-400 mt-0.5">${m.file} · ${pct}% of stack</div>
            </div>`;
        }).join('');
    },

    _trainBar(sec, maxSec, colorClass, label) {
        const pct = Math.round((sec / maxSec) * 100);
        const display = sec >= 60 ? `${Math.floor(sec/60)}m ${sec%60}s` : `${sec}s`;
        return `
        <div class="mb-3">
            <div class="flex justify-between mb-1">
                <span class="text-sm font-semibold text-gray-700 dark:text-gray-300">${label}</span>
                <span class="text-sm font-bold ${colorClass}">${display}</span>
            </div>
            <div class="w-full bg-gray-100 dark:bg-dark-600 rounded-full h-3 overflow-hidden">
                <div class="h-3 rounded-full ${colorClass.replace('text-','bg-')} transition-all duration-700" style="width:${pct}%"></div>
            </div>
        </div>`;
    },

    _gauge(ms, maxMs, label) {
        const pct = Math.min(ms / maxMs, 1);
        const angle = pct * 180;
        const r = 54, cx = 70, cy = 70;
        const toRad = deg => deg * Math.PI / 180;
        const x1 = cx + r * Math.cos(Math.PI);
        const y1 = cy + r * Math.sin(Math.PI);
        const x2 = cx + r * Math.cos(Math.PI + toRad(angle));
        const y2 = cy + r * Math.sin(Math.PI + toRad(angle));
        const large = angle > 180 ? 1 : 0;
        const trackX2 = cx + r * Math.cos(0);
        const trackY2 = cy + r * Math.sin(0);
        const stroke = ms <= 30 ? '#22c55e' : ms <= 80 ? '#f59e0b' : '#ef4444';
        const tag = ms <= 30 ? 'Fast ⚡' : ms <= 80 ? 'Moderate' : 'Slower';
        return `
        <div class="flex flex-col items-center">
            <svg width="140" height="85" viewBox="0 0 140 85">
                <path d="M ${x1} ${y1} A ${r} ${r} 0 0 1 ${trackX2} ${trackY2}"
                      fill="none" stroke="#e5e7eb" stroke-width="10" stroke-linecap="round"/>
                <path d="M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}"
                      fill="none" stroke="${stroke}" stroke-width="10" stroke-linecap="round"/>
                <text x="${cx}" y="${cy-4}" text-anchor="middle" font-size="18" font-weight="bold" fill="${stroke}">${ms}ms</text>
                <text x="${cx}" y="${cy+12}" text-anchor="middle" font-size="9" fill="#9ca3af">avg inference</text>
            </svg>
            <span class="text-xs font-semibold text-gray-700 dark:text-gray-300 -mt-1">${label}</span>
            <span class="text-xs text-gray-400 mt-0.5">${tag}</span>
        </div>`;
    },

    render() {
        const ml = PROJECT.costs.ml;
        const dl = PROJECT.costs.dl;
        const total = ml.total_mb + dl.total_mb;

        return `
        <div class="max-w-7xl mx-auto px-4 py-12">
            <div class="mb-10">
                <h1 class="text-3xl font-bold mb-2 dark:text-white flex items-center gap-3">
                    <span class="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg">
                        <i data-lucide="gauge" class="w-5 h-5 text-white"></i>
                    </span>
                    Computation &amp; Storage Cost
                </h1>
                <p class="text-gray-500 dark:text-gray-400">Real measured costs — training time, inference latency, and model file sizes on disk</p>
            </div>

            <!-- SUMMARY CARDS -->
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div class="bg-white dark:bg-dark-800 rounded-2xl border border-gray-100 dark:border-dark-700 shadow p-5">
                    <div class="flex items-center gap-1.5 text-gray-400 text-xs uppercase tracking-wider mb-2"><i data-lucide="hard-drive" class="w-3.5 h-3.5"></i> ML Size</div>
                    <div class="text-3xl font-black text-gray-900 dark:text-white">${ml.total_mb} <span class="text-base font-medium text-gray-400">MB</span></div>
                    <div class="text-xs text-gray-400 mt-1">3 model files (.pkl)</div>
                </div>
                <div class="bg-white dark:bg-dark-800 rounded-2xl border border-gray-100 dark:border-dark-700 shadow p-5">
                    <div class="flex items-center gap-1.5 text-gray-400 text-xs uppercase tracking-wider mb-2"><i data-lucide="hard-drive" class="w-3.5 h-3.5"></i> DL Size</div>
                    <div class="text-3xl font-black text-blue-600 dark:text-blue-400">${dl.total_mb} <span class="text-base font-medium text-gray-400">MB</span></div>
                    <div class="text-xs text-gray-400 mt-1">3 × 255 MB safetensors</div>
                </div>
                <div class="bg-white dark:bg-dark-800 rounded-2xl border border-gray-100 dark:border-dark-700 shadow p-5">
                    <div class="flex items-center gap-1.5 text-gray-400 text-xs uppercase tracking-wider mb-2"><i data-lucide="clock" class="w-3.5 h-3.5"></i> ML Train</div>
                    <div class="text-3xl font-black text-gray-900 dark:text-white">42 <span class="text-base font-medium text-gray-400">sec</span></div>
                    <div class="text-xs text-gray-400 mt-1">CPU · 3 classifiers</div>
                </div>
                <div class="bg-white dark:bg-dark-800 rounded-2xl border border-gray-100 dark:border-dark-700 shadow p-5">
                    <div class="flex items-center gap-1.5 text-gray-400 text-xs uppercase tracking-wider mb-2"><i data-lucide="clock" class="w-3.5 h-3.5"></i> DL Train</div>
                    <div class="text-3xl font-black text-blue-600 dark:text-blue-400">54 <span class="text-base font-medium text-gray-400">min</span></div>
                    <div class="text-xs text-gray-400 mt-1">GPU · 3 epochs each</div>
                </div>
            </div>

            <!-- STORAGE BARS -->
            <div class="grid lg:grid-cols-2 gap-6 mb-6">
                <div class="bg-white dark:bg-dark-800 rounded-2xl border border-gray-100 dark:border-dark-700 shadow-lg p-6">
                    <div class="flex items-center gap-2 mb-5">
                        <div class="w-8 h-8 rounded-lg bg-gray-100 dark:bg-dark-700 flex items-center justify-center"><i data-lucide="package" class="w-4 h-4 text-gray-600 dark:text-gray-400"></i></div>
                        <div><div class="font-bold text-sm text-gray-900 dark:text-white">ML Model Files</div><div class="text-xs text-gray-400">TF-IDF + sklearn classifiers</div></div>
                        <span class="ml-auto px-3 py-1 rounded-full text-xs font-bold bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300">${ml.total_mb} MB total</span>
                    </div>
                    ${this._storageBars(ml.storage, 'text-gray-700 dark:text-gray-300', ml.total_mb)}
                    <div class="mt-4 pt-4 border-t border-gray-100 dark:border-dark-600 text-xs text-gray-400 flex items-center gap-2"><i data-lucide="cpu" class="w-3 h-3"></i> ${ml.training.note}</div>
                </div>
                <div class="bg-white dark:bg-dark-800 rounded-2xl border border-gray-100 dark:border-dark-700 shadow-lg p-6">
                    <div class="flex items-center gap-2 mb-5">
                        <div class="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center"><i data-lucide="brain" class="w-4 h-4 text-blue-600 dark:text-blue-400"></i></div>
                        <div><div class="font-bold text-sm text-gray-900 dark:text-white">DL Model Files</div><div class="text-xs text-gray-400">DistilBERT safetensors</div></div>
                        <span class="ml-auto px-3 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">${dl.total_mb} MB total</span>
                    </div>
                    ${this._storageBars(dl.storage, 'text-blue-600 dark:text-blue-400', dl.total_mb)}
                    <div class="mt-4 pt-4 border-t border-gray-100 dark:border-dark-600 text-xs text-gray-400 flex items-center gap-2"><i data-lucide="layers" class="w-3 h-3"></i> ${dl.training.note}</div>
                </div>
            </div>


            <!-- TRAINING TIME + INFERENCE GAUGES -->
            <div class="grid lg:grid-cols-2 gap-6 mb-6">
                <div class="bg-white dark:bg-dark-800 rounded-2xl border border-gray-100 dark:border-dark-700 shadow-lg p-6">
                    <div class="flex items-center gap-2 mb-5">
                        <div class="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center"><i data-lucide="timer" class="w-4 h-4 text-amber-600 dark:text-amber-400"></i></div>
                        <div><div class="font-bold text-sm text-gray-900 dark:text-white">Training Time</div><div class="text-xs text-gray-400">Wall-clock to train all 3 tasks</div></div>
                    </div>
                    ${this._trainBar(ml.training.time_sec, dl.training.time_sec, 'text-gray-600 dark:text-gray-400', 'TF-IDF + Classical ML')}
                    ${this._trainBar(dl.training.time_sec, dl.training.time_sec, 'text-blue-600 dark:text-blue-400', 'DistilBERT Fine-tuning')}
                    <div class="mt-4 grid grid-cols-2 gap-3">
                        <div class="p-3 bg-gray-50 dark:bg-dark-700 rounded-xl">
                            <div class="text-xs text-gray-400 mb-1">ML Peak RAM</div>
                            <div class="font-bold text-gray-900 dark:text-white">${ml.training.ram_gb} GB</div>
                        </div>
                        <div class="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                            <div class="text-xs text-gray-400 mb-1">DL Peak RAM</div>
                            <div class="font-bold text-blue-600 dark:text-blue-400">${dl.training.ram_gb} GB</div>
                        </div>
                    </div>
                </div>
                <div class="bg-white dark:bg-dark-800 rounded-2xl border border-gray-100 dark:border-dark-700 shadow-lg p-6">
                    <div class="flex items-center gap-2 mb-5">
                        <div class="w-8 h-8 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center"><i data-lucide="zap" class="w-4 h-4 text-green-600 dark:text-green-400"></i></div>
                        <div><div class="font-bold text-sm text-gray-900 dark:text-white">Inference Latency</div><div class="text-xs text-gray-400">Single message · /all endpoint</div></div>
                    </div>
                    <div class="grid grid-cols-2 gap-4 justify-items-center">
                        ${this._gauge(ml.inference.avg_ms, 120, 'TF-IDF + ML')}
                        ${this._gauge(dl.inference.avg_ms, 120, 'DistilBERT')}
                    </div>
                </div>
            </div>


            <!-- COMPARISON TABLE -->
            <div class="bg-white dark:bg-dark-800 rounded-2xl border border-gray-100 dark:border-dark-700 shadow-lg p-6 mb-6">
                <div class="flex items-center gap-2 mb-5">
                    <i data-lucide="table-2" class="w-4 h-4 text-gray-500"></i>
                    <h2 class="font-bold text-gray-900 dark:text-white">Side-by-Side Comparison</h2>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead>
                            <tr class="border-b border-gray-100 dark:border-dark-600">
                                <th class="text-left py-3 px-4 text-gray-500 dark:text-gray-400 font-medium">Dimension</th>
                                <th class="py-3 px-4 text-center font-bold text-gray-700 dark:text-gray-300">TF-IDF + ML</th>
                                <th class="py-3 px-4 text-center font-bold text-blue-600 dark:text-blue-400">DistilBERT</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-50 dark:divide-dark-700">
                            <tr class="hover:bg-gray-50 dark:hover:bg-dark-700/50 transition-colors">
                                <td class="py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">Total File Size</td>
                                <td class="py-3 px-4 text-center font-bold text-gray-900 dark:text-white">41.5 MB</td>
                                <td class="py-3 px-4 text-center font-bold text-blue-600 dark:text-blue-400">765 MB</td>
                            </tr>
                            <tr class="hover:bg-gray-50 dark:hover:bg-dark-700/50 transition-colors">
                                <td class="py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">Training Time</td>
                                <td class="py-3 px-4 text-center font-bold text-gray-900 dark:text-white">42 sec</td>
                                <td class="py-3 px-4 text-center font-bold text-blue-600 dark:text-blue-400">54 min</td>
                            </tr>
                            <tr class="hover:bg-gray-50 dark:hover:bg-dark-700/50 transition-colors">
                                <td class="py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">Training Hardware</td>
                                <td class="py-3 px-4 text-center text-gray-700 dark:text-gray-300">CPU only</td>
                                <td class="py-3 px-4 text-center text-blue-600 dark:text-blue-400">GPU required</td>
                            </tr>

                            <tr class="hover:bg-gray-50 dark:hover:bg-dark-700/50 transition-colors">
                                <td class="py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">Peak RAM</td>
                                <td class="py-3 px-4 text-center font-bold text-gray-900 dark:text-white">1.2 GB</td>
                                <td class="py-3 px-4 text-center font-bold text-blue-600 dark:text-blue-400">6.4 GB</td>
                            </tr>
                            <tr class="hover:bg-gray-50 dark:hover:bg-dark-700/50 transition-colors">
                                <td class="py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">Avg Inference</td>
                                <td class="py-3 px-4 text-center"><span class="px-2 py-0.5 rounded-full text-xs font-bold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">18 ms ⚡</span></td>
                                <td class="py-3 px-4 text-center"><span class="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">95 ms</span></td>
                            </tr>
                            <tr class="hover:bg-gray-50 dark:hover:bg-dark-700/50 transition-colors">
                                <td class="py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">Model Files</td>
                                <td class="py-3 px-4 text-center text-gray-700 dark:text-gray-300">3 × .pkl</td>
                                <td class="py-3 px-4 text-center text-blue-600 dark:text-blue-400">3 × .safetensors</td>
                            </tr>
                            <tr class="hover:bg-gray-50 dark:hover:bg-dark-700/50 transition-colors">
                                <td class="py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">Parameters</td>
                                <td class="py-3 px-4 text-center text-gray-700 dark:text-gray-300">sparse TF-IDF</td>
                                <td class="py-3 px-4 text-center text-blue-600 dark:text-blue-400">66M × 3</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- DISK FOOTPRINT STACKED BAR -->
            <div class="bg-white dark:bg-dark-800 rounded-2xl border border-gray-100 dark:border-dark-700 shadow-lg p-6">
                <div class="flex flex-wrap items-center gap-2 mb-5">
                    <i data-lucide="database" class="w-4 h-4 text-gray-500"></i>
                    <h2 class="font-bold text-gray-900 dark:text-white">Total Disk Footprint</h2>
                    <span class="ml-auto text-sm text-gray-400">Both models: <strong class="text-gray-700 dark:text-gray-200">${total.toLocaleString()} MB (~0.8 GB)</strong></span>
                </div>
                <div class="flex h-10 rounded-xl overflow-hidden gap-0.5 mb-4">
                    <div class="bg-gray-400 dark:bg-gray-500 flex items-center justify-center text-white text-xs font-bold" style="width:${((ml.total_mb/total)*100).toFixed(1)}%" title="ML: 41.5 MB">
                        <span class="hidden sm:block">ML</span>
                    </div>
                    <div class="bg-blue-500 flex items-center justify-center text-white text-xs font-bold flex-1" title="DL: 765 MB">
                        <span class="hidden sm:block">DL (DistilBERT)</span>
                    </div>
                </div>
                <div class="flex flex-wrap gap-5 text-sm">
                    <div class="flex items-center gap-2"><span class="w-3 h-3 rounded bg-gray-400 shrink-0"></span><span class="text-gray-600 dark:text-gray-400">ML <strong class="text-gray-900 dark:text-white">41.5 MB</strong> (${((ml.total_mb/total)*100).toFixed(1)}%)</span></div>
                    <div class="flex items-center gap-2"><span class="w-3 h-3 rounded bg-blue-500 shrink-0"></span><span class="text-gray-600 dark:text-gray-400">DL <strong class="text-blue-600 dark:text-blue-400">765 MB</strong> (${((dl.total_mb/total)*100).toFixed(1)}%)</span></div>
                </div>
            </div>
        </div>`;
    }
};

