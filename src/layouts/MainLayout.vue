<template>
    <q-layout view="hHh LpR fFf">

        <q-header reveal elevated class="bg-white text-primary">
            <q-toolbar>
                <q-btn @click="toggleDrawer" flat round dense icon="menu" class="q-mr-sm" />
                <q-btn @click="routerGoBack" v-if="canGoBack" flat round dense icon="chevron_left" class="q-mr-sm" />
                <q-toolbar-title @click="scrollBackTop">
                    {{ barTitle }}
                </q-toolbar-title>
                <q-item clickable v-ripple v-if="isLoggedIn">
                    <q-item-section class="row">
                        <q-avatar color="primary" text-color="white" size="md">{{ user.username[0] }}</q-avatar>
                    </q-item-section>
                    <q-menu fit anchor="bottom right" self="top right" content-class="bg-white text-primary text-weight-medium">
                        <q-list style="min-width: 100px">
                            <q-item clickable v-close-popup to="/settings" exact>
                                <q-item-section>{{ $t("layoutDrawer.settings") }}</q-item-section>
                            </q-item>
                            <q-item clickable v-close-popup @click="signOut">
                                <q-item-section>{{ $t("layoutDrawer.signOut") }}</q-item-section>
                            </q-item>
                        </q-list>
                    </q-menu>
                </q-item>
                <q-btn v-else @click="signIn" flat color="primary" :label="$t('layoutDrawer.signIn')" />
            </q-toolbar>
        </q-header>

        <q-drawer content-class="bg-shade-light" show-if-above v-model="leftDrawer" :width="200" side="left" mini>
            <q-scroll-area class="fit">
                <q-list padding class="menu-list">
                    <q-item v-for="item in menuItems.filter(v => (!v.requireLogin || isLoggedIn) && (!v.requireAuthor || user.isAuthor == 1) )" :key="item.link" clickable v-ripple :to="item.link" :exact="item.exact ? true : false">
                        <q-item-section avatar>
                            <q-icon :name="item.icon">
                                <q-badge v-if="item.badge && menuBadges[item.badge] != 0" floating rounded class="badge">{{ menuBadges[item.badge] }}</q-badge>
                            </q-icon>
                        </q-item-section>

                        <q-tooltip content-class="bg-primary" anchor="center right" self="center left" :offset="[5, 0]">
                            {{ $t(item.name) }}
                        </q-tooltip>

                        <q-item-section>
                            {{ $t(item.name) }}
                        </q-item-section>
                    </q-item>
                </q-list>
            </q-scroll-area>
        </q-drawer>

        <q-page-container>
            <router-view />
        </q-page-container>

        <log-in :open="logInDialog" @closed="logInDialog = false"></log-in>

    </q-layout>
</template>

<script>
import SearchBar from "src/components/SearchBar.vue";
import { mapState } from "vuex";
import api from "../api";
import { apiError } from "../apiError";
import LogIn from "../components/LogIn";
import mainMenuItems from "../mainMenu";
export default {
    name: "MainLayout",
    components: {
        LogIn,
        SearchBar
    },
    meta: {
        title: "Legendword Blog",
        titleTemplate: title => title === "Legendword Blog" ? title : `${title} - Legendword Blog`,
        meta: {
            description: { name: "description", content: "Distraction-free blogging experience. Made for everyone." }
        }
    },
    data () {
        return {
            leftDrawer: false,
            miniDrawer: false,
            tab: "tab1",
            logInDialog: false,
            menuItems: mainMenuItems,
            menuLinks: [],
            menuBadges: {
                following: 0
            }
        };
    },
    computed: {
        barTitle() {
            return this.$route.meta.customBarTitle ? this.$store.state.barTitle : "Legendword Blog";
        },
        canGoBack() {
            return !this.menuLinks.includes(this.$route.path);
        },
        ...mapState(["user","isLoggedIn","miniDrawerMode"])
    },
    methods: {
        scrollBackTop() {
            window.scrollTo({top:0,left:0,behavior:"smooth"});
        },
        signIn() {
            this.logInDialog = true;
        },
        signOut() {
            let params = {};
            if (this.$q.localStorage.has("identifier") && this.$q.localStorage.has("token")) {
                params = {
                    token: this.$q.localStorage.getItem("token"),
                    identifier: this.$q.localStorage.getItem("identifier")
                };
            }
            api.post("/user/signOut", params).then(res => {
                let r = res.data;
                if (r.success) {
                    this.$q.notify({
                        color: "primary",
                        message: this.$t("logIn.signOutSuccessMsg"),
                        position: "top",
                        timeout: 2000
                    });
                    this.$store.commit("setAuthorization", null);
                    // delete api.instance.defaults.headers.common["Authorization"]
                    this.$store.commit("userLogOut");
                }
                else {
                    this.$q.notify({
                        color: "negative",
                        message: r.msg,
                        position: "top",
                        timeout: 2000
                    });
                }
                this.$store.commit("setAuthorization", null);
                // delete api.instance.defaults.headers.common["Authorization"]
                this.$q.localStorage.remove("identifier");
                this.$q.localStorage.remove("token");
            });
        },
        routerGoBack() {
            this.$router.go(-1);
        },
        drawerMouseOver() {
            this.miniDrawer = false;
        },
        drawerMouseOut() {
            this.miniDrawer = this.miniDrawerMode;
        },
        toggleDrawer() {
            this.leftDrawer = !this.leftDrawer;
        }
    },
    watch: {
        miniDrawerMode: "drawerMouseOut"
    },
    created() {
        if (window.history && window.history.length) {
            this.$store.commit("setHistoryLength", window.history.length);
        }
        this.menuLinks = mainMenuItems.map(v => v.link);
        api.get("/badges").then(res => {
            let r = res.data;
            if (r.success) {
                this.menuBadges = r.badges;
                //clear badge of current path
                let itm = this.menuItems.find(v => v.link == this.$route.path);
                if (itm && itm.badge) {
                    this.menuBadges[itm.badge] = 0;
                }
            }
        });
    },
    beforeRouteEnter (to, from, next) {
        next();
        /*
        api.get("/user/info", {
            detailed: true
        }).catch(err => {
            // apiError()
            next()
        }).then(res => {
            next(vm => vm.setData(res.data))
        })
        */
    },
    beforeRouteUpdate(to, from, next) {
        let itm = this.menuItems.find(v => v.link == to.path);
        if (itm && itm.badge) {
            this.menuBadges[itm.badge] = 0;
        }
        next();
    }
};
</script>

<style scoped>
.drawerUserInfo {
    opacity: 1;
    transition: opacity 300ms;
}
.q-drawer--mini .drawerUserInfo {
    display: none;
    opacity: 0;
}
.badge {
    font-style: normal;
}
/*
.menu-list .q-item {
    border-radius: 0 32px 32px 0;
} */
</style>