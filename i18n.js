// Serviciu de traducere pentru scripturi clasice (funcționează și prin file://).
window.I18n = (() => {
  let language = "ro";

  function t(key) {
    return (
      window.TRANSLATIONS[language]?.[key] ?? window.TRANSLATIONS.ro[key] ?? key
    );
  }

  function apply(lang) {
    language = Object.hasOwn(window.TRANSLATIONS, lang) ? lang : "ro";
    document.documentElement.lang = language;
    document.querySelectorAll("[data-i18n]").forEach((element) => {
      element.textContent = t(element.dataset.i18n);
    });
    // Doar traducerile locale, controlate de autor, pot conține markup.
    document.querySelectorAll("[data-i18n-html]").forEach((element) => {
      element.innerHTML = t(element.dataset.i18nHtml);
    });
  }

  return { t, apply };
})();
