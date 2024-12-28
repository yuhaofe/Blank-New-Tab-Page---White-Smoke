(function() {
    document.title = chrome.i18n.getMessage("new_tab_page");
    chrome.storage.onChanged.addListener(themeManager.applyTheme);
    themeManager.applyTheme();
})();