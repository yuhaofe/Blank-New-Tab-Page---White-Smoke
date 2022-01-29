(function() {
    function ThemeManager(theme = 'light') {
        this.theme = theme;
        this.colors = {
            light: 'whitesmoke',
            dark: '#333333',
            incognito: '#222222'
        };
    }
    
    ThemeManager.prototype.loadTheme = async function() {
        if (chrome.extension.inIncognitoContext) { 
            this.theme = 'incognito';
        } else {
            const lastTheme = localStorage.getItem('lastTheme');
            if (lastTheme) {
                this.theme = lastTheme;
            }
            let result = await chrome.storage.local.get(['theme']);
            if (!result.theme) {
                result.theme = 'light';
                chrome.storage.local.set({ theme: result.theme });
            }
            if (result.theme != lastTheme) {
                localStorage.setItem('lastTheme', result.theme);
                this.theme = result.theme;
                this.apply();
            }
        }
    }
    
    ThemeManager.prototype.generateStyle = function() {
        let style = '';
        if (this.theme === 'system') {
            style += `body { background-color: ${this.colors.light}; }`
                    + ` @media (prefers-color-scheme: dark) { body { background-color: ${this.colors.dark}; } }`;
        } else {
            style += `body { background-color: ${this.colors[this.theme]}; }`;
        }
        return style;
    }
    
    ThemeManager.prototype.apply = function() {
        let style = document.getElementsByTagName('style')[0];
        if (!style) {
            style = document.createElement('style');
            document.head.appendChild(style);
        }
        if (style.lastChild) {
            style.removeChild(style.lastChild);
        }
        style.appendChild(document.createTextNode(this.generateStyle()));
    }

    function init() {
        document.title = chrome.i18n.getMessage("new_tab_page");

        const tm = new ThemeManager();
        const applyTheme = () => {
            tm.loadTheme();
            tm.apply();
        };
        chrome.storage.onChanged.addListener(applyTheme);
        applyTheme();
    }
    
    init();
})();