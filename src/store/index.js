import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default new Vuex.Store({
    /*
    modules: {

    }, */

    // enable strict mode (adds overhead!)
    // for dev mode and --debug builds only
    strict: process.env.DEBUGGING,
    state: {
        miniDrawerMode: true,
        user: null,
        isLoggedIn: false,
        newAccount: null,
        barTitle: "Legendword Blog",
        historyLength: 0,
        authorization: null
    },
    getters: {
    },
    mutations: {
        setAuthorization(state, val) {
            state.authorization = val
        },
        setHistoryLength(state, val) {
            state.historyLength = val
        },
        setBarTitle(state, val = "Legendword Blog") {
            state.barTitle = val
        },
        newAccount(state, val) {
            state.newAccount = val;
        },
        setMiniDrawerMode (state, val) {
            state.miniDrawerMode = val
        },
        userLogIn (state, val) {
            state.user = val
            state.isLoggedIn = true
        },
        userLogOut (state) {
            state.isLoggedIn = false
            state.user = null
        },
        userDataChange (state, val) {
            if (state.user != null) {
                for (let i in val) {
                    state.user[i] = val[i]
                }
            }
        }
    }
})
