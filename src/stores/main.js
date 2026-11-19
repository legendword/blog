import { defineStore } from "pinia";

export const useMainStore = defineStore("main", {
    state: () => ({
        miniDrawerMode: true,
        user: null,
        isLoggedIn: false,
        newAccount: null,
        barTitle: "Legendword Blog",
        historyLength: 0,
        authorization: null
    }),
    actions: {
        setAuthorization(val) {
            this.authorization = val;
        },
        setHistoryLength(val) {
            this.historyLength = val;
        },
        setBarTitle(val = "Legendword Blog") {
            this.barTitle = val;
        },
        setNewAccount(val) {
            this.newAccount = val;
        },
        setMiniDrawerMode(val) {
            this.miniDrawerMode = val;
        },
        userLogIn(val) {
            this.user = val;
            this.isLoggedIn = true;
        },
        userLogOut() {
            this.isLoggedIn = false;
            this.user = null;
        },
        userDataChange(val) {
            if (this.user != null) {
                for (let i in val) {
                    this.user[i] = val[i];
                }
            }
        }
    }
});
