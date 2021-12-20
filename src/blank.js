document.addEventListener('DOMContentLoaded', function () {
    document.title = chrome.i18n.getMessage("new_tab_page");
    chrome.storage.onChanged.addListener(loadOptions);
    loadOptions();
});

function loadOptions() {
    if (chrome.extension.inIncognitoContext) {
        document.body.className = 'theme-incognito';
        return;
    }
    chrome.storage.local.get(['theme'], result => {
        if (!result.theme) {
            result.theme = 'light';
            chrome.storage.local.set({ theme: result.theme });
        }
        document.body.className = 'theme-' + result.theme;
    });
}