document.addEventListener('DOMContentLoaded', function () {
    document.title = chrome.i18n.getMessage("options");
    if (chrome.extension.inIncognitoContext) {
        let incognito = document.getElementById('in-incognito');
        incognito.innerText = chrome.i18n.getMessage("in_incognito");
        incognito.classList.remove('hide');
        let theme = document.getElementById('theme');
        theme.classList.add('hide');
        return;
    }
    document.querySelectorAll('[data-locale]').forEach(elem => {
        elem.innerText = chrome.i18n.getMessage(elem.dataset.locale);
    });
    document.querySelectorAll('input[type="radio"][name="theme"]').forEach(radio => {
        radio.addEventListener('change', event => {
            chrome.storage.local.set({ theme: event.target.value });
            localStorage.setItem('lastTheme', event.target.value);
        });
    });
    chrome.storage.local.get(['theme'], result => {
        if (!result.theme) {
            result.theme = 'light';
            chrome.storage.local.set({ theme: result.theme });
        }
        document.querySelector('input[type="radio"][name="theme"][value="' + result.theme + '"]').checked = true;
    });
});