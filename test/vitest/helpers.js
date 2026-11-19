import { createPinia, setActivePinia } from "pinia";
import { createI18n } from "vue-i18n";
import { useMainStore } from "@/stores/main";
import messages from "@/i18n";

/**
 * Global mount options shared by the component tests: a fresh Pinia store
 * and the app's real translations.
 */
export function createGlobals({ isLoggedIn = false, user = null } = {}) {
    const pinia = createPinia();
    setActivePinia(pinia);
    const store = useMainStore();
    if (isLoggedIn) {
        store.userLogIn(user || { id: 1, username: "Tester", isAuthor: "1", settings: { locale: "en" } });
    }
    const i18n = createI18n({
        legacy: false,
        globalInjection: true,
        locale: "en",
        fallbackLocale: "en",
        messages
    });
    return {
        store,
        global: {
            plugins: [pinia, i18n],
            stubs: {
                RouterLink: { template: "<a><slot /></a>" }
            }
        }
    };
}
