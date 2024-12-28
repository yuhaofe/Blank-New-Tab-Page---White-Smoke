window.themeManager = (function() {
    return {
        applyTheme: async function () {
            let cachedTheme = getCachedTheme();
            appendStyle(generateStyle(cachedTheme));
    
            let originalTheme = await getOriginalTheme();
            appendStyle(generateStyle(originalTheme));
    
            if (cachedTheme != originalTheme) {
                setCachedTheme(originalTheme);
            }
        }
    };

    function getCachedTheme() {
        let theme = localStorage.getItem('lastTheme');
        if (!theme) {
            theme = 'light';
        }
        return theme;
    }

    function setCachedTheme(theme) {
        localStorage.setItem('lastTheme', theme);
    }

    async function getOriginalTheme() {
        let theme = (await chrome.storage.local.get(['theme'])).theme;
        if (!theme) {
            theme = 'light';
            chrome.storage.local.set({ theme: theme });
        }
        return theme;
    }

    function appendStyle(css) {
        let style = document.getElementById('theme-style');
        if (!style) {
            style = document.createElement('style');
            style.id = 'theme-style';
            document.head.appendChild(style);
        }
        if (style.lastChild) {
            style.removeChild(style.lastChild);
        }
        style.appendChild(document.createTextNode(css));
    }
    
    function generateStyle(theme) {
        let css = '';
        if (theme === 'system') {
            css += `body { background-color: ${getColor('light')}; }`
                    + ` @media (prefers-color-scheme: dark) { body { background-color: ${getColor('dark')}; } }`;
        } else {
            css += `body { background-color: ${getColor(theme)}; }`;
        }
        return css;
    }

    function getColor(theme) {
        const colors = {
            normal: {
                light: 'whitesmoke',
                dark: '#333333'
            },
            incognito: {
                light: '#999999',
                dark: '#222222'
            }
        }
        const mode = chrome.extension.inIncognitoContext ? 'incognito' : 'normal';
        return colors[mode][theme];
    }
})();