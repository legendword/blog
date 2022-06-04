<template>
    <q-dialog ref="dialog" @hide="onHideDialog">
        <q-card class="q-dialog-plugin" style="width: 800px; max-width: 80vw;">
            <q-card-section class="row items-center q-pb-none">
                <div class="text-h6">{{$t("userProfile.editProfile")}}</div>
                <q-space />
                <q-btn icon="close" flat round dense @click="onClickCancel" />
            </q-card-section>
            <q-card-section>
                <q-input class="q-mt-md" outlined debounce="500" v-model="values.displayName" lazy-rules :rules="rules.displayName" :label="$t('general.displayName')" ref="displayName"></q-input>
                <q-input class="q-mt-xs" outlined autogrow v-model="values.description" maxlength="1000" counter :label="$t('general.description')"></q-input>
            </q-card-section>
            <q-card-actions align="right" class="q-pr-lg q-pb-lg">
                <q-btn flat :label="$t('general.submit')" color="primary" size="md" @click="onClickOK" />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script>
import api from "src/api";
import { apiError } from "src/apiError";
// following template https://v1.quasar.dev/quasar-plugins/dialog#invoking-custom-component
export default {
    props: {
        initialValues: Object
    },
    data() {
        return {
            values: {
                displayName: "",
                description: "",
                ...this.initialValues
            },
            rules: {
                displayName: [
                    val => val && val.length > 0 || this.$t("forms.requiredField"),
                    val => val.length <= 20 || this.$t("forms.maxChar", ["20"]),
                    val => /^[a-zA-Z ]+$/.test(val) || this.$t("forms.onlyLettersAndSpaces"),
                    this.checkDisplayName
                ],
            }
        };
    },
    methods: {
        checkDisplayName(val) {
            return new Promise((resolve, reject) => {
                if (this.initialValues && this.initialValues.displayName && val === this.initialValues.displayName) {
                    resolve(true);
                }
                api.get("/util/name/author", {
                    name: val
                }).then(res => {
                    let r = res.data;
                    if (r.success) {
                        if (r.result == true) {
                            resolve(true);
                        }
                        else {
                            resolve(this.$t("forms.nameTaken"));
                        }
                    }
                    else {
                        reject(r);
                    }
                });
            });
        },
        show() {
            this.$refs.dialog.show();
        },
        hide() {
            this.$refs.dialog.hide();
        },
        onHideDialog() {
            this.$emit("hide");
        },
        onClickCancel() {
            this.hide();
        },
        onClickOK() {
            let vld = this.$refs.displayName.validate();
            if (vld.then) {
                vld.then(outcome => {
                    if (outcome === true) {
                        this.realSubmit();
                    }
                });
            }
            else {
                if (vld === true) {
                    this.realSubmit();
                }
            }
        },
        realSubmit() {
            this.onSubmit().then((msg) => {
                this.$emit("ok", {...this.values});
                this.hide();
                this.$q.notify({
                    color: "positive",
                    message: msg
                });
            }, (msg) => {
                this.$q.notify({
                    color: "negative",
                    message: msg
                });
            });
        },
        onSubmit() {
            return new Promise((resolve, reject) => {
                api.put("/user/authorInfo", {
                    displayName: this.values.displayName,
                    description: this.values.description
                }).catch(err => {
                    apiError();
                }).then(res => {
                    let r = res.data;
                    if (r.success) {
                        resolve(this.$t("authorProfile.profileUpdated"));
                        // this.$q.notify({
                        //     color: "positive",
                        //     message: this.$t("authorProfile.profileUpdated"),
                        //     caption: this.$t("authorProfile.profileUpdatedCaption"),
                        //     position: "top",
                        //     timeout: 2000
                        // })
                    }
                    else {
                        reject(r.msg);
                    }
                });
            });
        }
    }
};
</script>

<style>

</style>