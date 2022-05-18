<template>
    <q-page class="q-pa-lg text-center">
        <div v-if="finished">
            <h5>{{ $t("passwordRecovery.title") }}</h5>
            <p class="text-subtitle1">{{ $t("passwordRecovery.finishedMsg") }}</p>
            <div>
                <q-btn class="q-mt-lg" flat color="primary" :label="$t('newAccount.backToHome')" @click="backHome"></q-btn>
            </div>
        </div>
        <div v-else-if="loaded">
            <div v-if="success">
                <h5>{{ $t("passwordRecovery.title") }}</h5>
                <p class="text-subtitle1">{{ $t("passwordRecovery.msg.before") }}<strong>{{ $route.query.email }}</strong>{{ $t("passwordRecovery.msg.after") }}</p>
                <div>
                    <q-input :type="showPass?'text':'password'" v-model="pass" :label="$t('passwordRecovery.input.password')" lazy-rules :rules="passRules">
                        <template v-slot:append>
                            <q-btn round dense flat :icon="'visibility'+(showPass?'':'_off')" @click="showPass = !showPass" />
                        </template>
                    </q-input>
                </div>
                <div>
                    <q-input :type="showPass?'text':'password'" v-model="passConfirm" :label="$t('passwordRecovery.input.passwordConfirm')" lazy-rules :rules="passConfirmRules">
                        <template v-slot:append>
                            <q-btn round dense flat :icon="'visibility'+(showPass?'':'_off')" @click="showPass = !showPass" />
                        </template>
                    </q-input>
                </div>
                <div>
                    <q-btn color="primary" :label="$t('general.submit')" @click="submitPass" />
                </div>
            </div>
            <div v-else>
                <h5>{{ $t("passwordRecovery.failedTitle") }}</h5>
                <p class="text-subtitle1">{{ $t("passwordRecovery.failedMsg") }}</p>
            </div>
        </div>
    </q-page>
</template>

<script>
import { apiError } from "src/apiError";
import api from "../api";
import logger from "src/logger";
export default {
    name: "PasswordRecovery",
    meta: {
        title: "Recover Password"
    },
    data() {
        return {
            loaded: false,
            success: true,
            finished: false,
            pass: "",
            passConfirm: "",
            showPass: false,
            passRules: [
                val => val && val.length > 0 || this.$t("forms.requiredField")
            ],
            passConfirmRules: [
                val => val && val.length > 0 || this.$t("forms.requiredField"),
                val => val == this.pass || this.$t("passwordRecovery.passwordsDontMatch")
            ]
        };
    },
    methods: {
        submitPass() {
            if (this.pass.length == 0 || this.passConfirm.length == 0) return;
            if (this.pass != this.passConfirm) {
                this.$q.notify({
                    color: "negative",
                    message: this.$t("passwordRecovery.passwordsDontMatch"),
                    position: "top",
                    timeout: 2000
                });
                return;
            }
            api.put("/user/recoverPassword", {
                email: this.$route.query.email,
                code: this.$route.query.code,
                password: this.pass
            }).catch(err => {
                apiError();
            }).then(res => {
                let r = res.data;
                logger(r);
                if (r.success) {
                    this.finished = true;
                }
                else {
                    this.$q.notify({
                        color: "negative",
                        message: r.msg,
                        position: "top",
                        timeout: 2000
                    });
                    this.finished = false;
                }
            });
        },
        backHome() {
            this.$router.push("/");
        }
    },
    created() {
        if (!this.$route.query.email || !this.$route.query.code) {
            this.success = false;
            this.loaded = true;
        }
        else {
            api.get("/user/recoverPassword", {
                email: this.$route.query.email,
                code: this.$route.query.code
            }).catch(err => {
                apiError();
            }).then(res => {
                let r = res.data;
                logger(r);
                if (r.success) {
                    this.success = true;
                }
                else {
                    this.$q.notify({
                        color: "negative",
                        message: r.msg,
                        position: "top",
                        timeout: 2000
                    });
                    this.success = false;
                }
                this.loaded = true;
            });
        }
    }
};
</script>

<style>

</style>