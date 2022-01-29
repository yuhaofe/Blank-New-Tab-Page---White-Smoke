(function() {
    function ThemeManager(theme = 'light') {
        this.theme = theme;
        this.colorsNormal = {
            light: 'whitesmoke',
            dark: '#333333'
        };
        this.colorsIncognito = {
            light: '#999999',
            dark: '#222222'
        };
    }
    
    ThemeManager.prototype.loadTheme = async function() {
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
    
    ThemeManager.prototype.generateStyle = function() {
        let colors = this.colorsNormal;
        if (chrome.extension.inIncognitoContext) { 
            colors = this.colorsIncognito;
        }

        let style = '';
        if (this.theme === 'system') {
            style += `body { background-color: ${colors.light}; }`
                    + ` @media (prefers-color-scheme: dark) { body { background-color: ${colors.dark}; } }`;
        } else {
            style += `body { background-color: ${colors[this.theme]}; }`;
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