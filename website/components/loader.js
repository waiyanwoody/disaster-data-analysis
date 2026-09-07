// ── Component Loader ──────────────────────────────────────────────
const Components = {
    templates: {},

    // Register a component
    register(name, html) {
        this.templates[name] = html;
    },

    // Render a component with optional data
    render(name, data = {}) {
        let html = this.templates[name] || '';
        // Replace {{key}} placeholders with data values
        Object.keys(data).forEach(key => {
            html = html.replace(new RegExp(`{{${key}}}`, 'g'), data[key]);
        });
        return html;
    },

    // Load all component files
    async loadAll() {
        const files = [
            'header', 'footer', 'hero', 'stats', 'pipeline',
            'model-cards', 'test-form', 'result-view',
        ];
        for (const file of files) {
            try {
                const res = await fetch(`components/${file}.js`);
                if (res.ok) {
                    const text = await res.text();
                    // Extract the HTML from the component file
                    const match = text.match(/`([\s\S]*?)`/);
                    if (match) {
                        this.register(file, match[1]);
                    }
                }
            } catch (e) {
                console.warn(`Component ${file} not loaded`);
            }
        }
    }
};
