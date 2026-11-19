import { defineBoot } from "#q-app";
import { LocalStorage } from "quasar";
import api from "@/api";
import logger from "@/logger";
import { i18n } from "@/boot/i18n";
import { useMainStore } from "@/stores/main";

// more info on params: https://v2.quasar.dev/quasar-cli-vite/boot-files
export default defineBoot(({ router, store }) => {
    const mainStore = useMainStore(store);

    const isSessionAlive = async () => {
        const res = await api.get("/alive");
        let r = res.data;
        logger(r);
        return r.success ? !!r.isLoggedIn : false;
    };

    const signInWithToken = async () => {
        const identifier = LocalStorage.getItem("identifier");
        const token = LocalStorage.getItem("token");
        const res = await api.post("/user/tokenSignIn", {
            identifier: identifier,
            token: token
        });
        let r = res.data;
        logger("signInWithToken", r);
        if (r.success) {
            logger("signInWithToken Success");
            if (r.jwt) {
                mainStore.setAuthorization("Bearer " + r.jwt);
            }
            LocalStorage.setItem("token", r.token);
            mainStore.userLogIn(r.user);
            if (r.user.settings.locale != i18n.global.locale.value) { // #test
                i18n.global.locale.value = r.user.settings.locale;
            }
        }
        else {
            logger("signInWithToken Failed");
            LocalStorage.removeItem("identifier");
            LocalStorage.removeItem("token");
            mainStore.setAuthorization(null);
        }
    };

    router.beforeEach(async () => {
        const hasToken = LocalStorage.hasItem("identifier") && LocalStorage.hasItem("token");
        const hasUserInfo = mainStore.isLoggedIn;
        if (hasToken) {
            try {
                const isLoggedIn = hasUserInfo ? await isSessionAlive() : false;
                if (!isLoggedIn) {
                    await signInWithToken();
                }
            }
            catch (err) {
                // network/API failure must never block navigation
                logger(err);
            }
        }
        else if (hasUserInfo) {
            api.get("/alive").catch(() => {});
        }
    });
});
