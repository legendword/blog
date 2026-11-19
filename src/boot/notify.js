import { defineBoot } from "#q-app";
import { Notify } from "quasar";

export default defineBoot(() => {
    Notify.setDefaults({
        position: "top",
        timeout: 2500
    });
});
