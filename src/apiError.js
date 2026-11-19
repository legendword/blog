import { Dialog } from "quasar";
import { i18n } from "@/boot/i18n";

const apiError = () => {
    Dialog.create({
        title: i18n.global.t("general.serverError.title"),
        message: i18n.global.t("general.serverError.message")
    });
};
export {
    apiError
};