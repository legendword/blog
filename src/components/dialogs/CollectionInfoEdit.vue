<template>
    <q-dialog ref="dialog" @hide="onHideDialog">
        <q-card class="q-dialog-plugin" style="width: 700px; max-width: 80vw;">
            <q-card-section class="row items-center q-pb-none">
                <div class="text-h6">{{$t("collection.editInfo")}}</div>
                <q-space />
                <q-btn icon="close" flat round dense @click="onClickCancel" />
            </q-card-section>
            <q-card-section>
                <q-input class="q-my-md" outlined v-model="values.title" :label="$t('collection.editInfoDialog.title')" maxlength="50" />
                <q-input class="q-mb-md" outlined v-model="values.description" :label="$t('collection.editInfoDialog.description')" maxlength="200" autogrow />
                <div class="q-mb-md">
                    <q-toggle v-model="values.isPublic" color="primary" :label="$t('collection.editInfoDialog.public')" />
                </div>
                <q-btn color="primary" :label="$t('general.save')" @click="onClickOK" />
            </q-card-section>
        </q-card>
    </q-dialog>
</template>

<script>
import api from "src/api";
import { apiError } from "src/apiError";
// following template https://v1.quasar.dev/quasar-plugins/dialog#invoking-custom-component
export default {
    props: {
        initialValues: Object,
        id: Number
    },
    data() {
        return {
            values: {...this.initialValues}
        };
    },
    methods: {
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
                if (this.values.title.length == 0) {
                    reject(this.$t("collection.editInfoDialog.mustHaveTitle"));
                }
                api.put("/collections/"+this.id, {
                    title: this.values.title,
                    description: this.values.description ? this.values.description : "",
                    isPublic: this.values.isPublic ? 1 : 0
                }).catch(err => {
                    apiError();
                }).then(res => {
                    let r = res.data;
                    if (r.success) {
                        resolve(this.$t("collection.editInfoDialog.updated"));
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