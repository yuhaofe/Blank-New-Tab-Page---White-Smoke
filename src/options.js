document.addEventListener('DOMContentLoaded', function () {
    document.title = chrome.i18n.getMessage("options");
    document.querySelectorAll('[data-locale]').forEach(elem => {
        elem.innerText = chrome.i18n.getMessage(elem.dataset.locale);
    });
});