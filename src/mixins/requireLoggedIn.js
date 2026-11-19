import NeedToLogIn from "../components/NeedToLogIn.vue";
import { useMainStore } from "@/stores/main";

const requireLoggedIn = {
    components: { NeedToLogIn },
    computed: {
        isLoggedIn() {
            return useMainStore().isLoggedIn;
        }
    },
    watch: {
        isLoggedIn() {
            this.init();
        }
    }
};

export default requireLoggedIn;