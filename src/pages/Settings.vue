<template>
    <q-page class="q-pa-lg">
        <div class="text-h4 q-mb-lg">{{$t("settings.title")}}</div>
        <q-list bordered>
            <q-item-label header>{{$t("settings.general.title")}}</q-item-label>
            <q-item>
                <q-item-section>
                    {{$t("settings.general.language")}}
                </q-item-section>
                <q-item-section side class="settingSelect">
                    <q-select dense v-model="language" outlined :options="options.languages" map-options emit-value />
                </q-item-section>
                <!-- todo miniDrawerMode -->
            </q-item>
            <!--
            <q-expansion-item expand-separator icon="settings" label="General">
            </q-expansion-item> -->
        </q-list>
        <div class="q-mt-md" v-show="false">Dev Info: {{ sts }}</div>
    </q-page>
</template>

<script>
import api from "../api";
import { mapState } from "vuex";
import { apiError } from "src/apiError";
export default {
    name: "Settings",
    meta: {
        title: "Settings"
    },
    data() {
        return {
            options: {
                languages: [
                    {value: "en", label: this.$t("settings.general.languages.English")},
                    {value: "zh", label: this.$t("settings.general.languages.Chinese")}
                ]
            },
            language: this.$root.$i18n.locale
        };
    },
    computed: {
        sts() {
            return this.$store.state.user ? this.$store.state.user.settings : "";
        },
        ...mapState(["isLoggedIn"]) //todo !isLoggedIn message
    },
    methods: {
        backHome() {
            this.$router.push("/");
        }
    },
    watch: {
        language(lang) {
            this.$root.$i18n.locale = lang;
            if (this.isLoggedIn) {
                api.put("/user/settings", {
                    column: "locale",
                    value: lang
                }).catch(err => {
                    apiError();
                }).then(res => {
                    let r = res.data;
                    if (r.success) {
                        //do nothing
                    }
                    else {
                        this.$q.notify({
                            color: "negative",
                            message: r.msg,
                            position: "top",
                            timeout: 2000
                        });
                    }
                });
            }
        }
    }
};
</script>

<style>
.settingSelect {
    width: max( 200px, 30vw );
}
.settingSelect > * {
    width: 100%
}
</style>