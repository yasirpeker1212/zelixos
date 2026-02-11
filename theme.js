/* ============================================
   ZelixOS — Theme System
   Supports: light / dark / system
   ============================================ */

(function () {
    const STORAGE_KEY = 'zelixos-theme';
    const html = document.documentElement;

    // Determine the effective theme based on system preference
    function getSystemTheme() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    // Apply theme to the document
    function applyTheme(mode) {
        if (mode === 'system') {
            html.setAttribute('data-theme', getSystemTheme());
        } else {
            html.setAttribute('data-theme', mode);
        }
        updateToggleButtons(mode);
    }

    // Highlight the correct toggle button
    function updateToggleButtons(mode) {
        document.querySelectorAll('.theme-toggle button').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.theme === mode);
        });
    }

    // Initialise on DOM ready
    function init() {
        const saved = localStorage.getItem(STORAGE_KEY) || 'system';
        applyTheme(saved);

        // Bind click events on toggle buttons
        document.querySelectorAll('.theme-toggle button').forEach(btn => {
            btn.addEventListener('click', () => {
                const mode = btn.dataset.theme;
                localStorage.setItem(STORAGE_KEY, mode);
                applyTheme(mode);
            });
        });

        // Listen for OS-level theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
            const current = localStorage.getItem(STORAGE_KEY) || 'system';
            if (current === 'system') {
                applyTheme('system');
            }
        });
    }

    // Apply theme ASAP to prevent flash
    const saved = localStorage.getItem(STORAGE_KEY) || 'system';
    applyTheme(saved);

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
