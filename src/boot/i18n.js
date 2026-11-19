import { defineBoot } from "#q-app";
import { createI18n } from "vue-i18n";
import messages from "@/i18n";

const supportedLanguages = ["en-US", "en", "zh-CN", "zh"];
let userLanguage = "en";
if (navigator.languages && navigator.languages.length > 0) {
    for (let i of navigator.languages) {
        if (supportedLanguages.includes(i)) {
            userLanguage = i;
            break;
        }
        else if (supportedLanguages.includes(i.substr(0,2))) {
            userLanguage = i.substr(0,2);
        }
    }
}
else if (navigator.language && navigator.language != "") {
    if (supportedLanguages.includes(navigator.language)) {
        userLanguage = navigator.language;
    }
    else if (supportedLanguages.includes(navigator.language.substr(0,2))) {
        userLanguage = navigator.language.substr(0,2);
    }
}

const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: userLanguage,
    fallbackLocale: "en",
    messages
});

export default defineBoot(({ app }) => {
    // Set i18n instance on app
    app.use(i18n);
});

export { i18n };
