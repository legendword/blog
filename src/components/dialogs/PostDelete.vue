<template>
    <q-dialog ref="dialog" @hide="onHideDialog">
        <q-card class="q-dialog-plugin" style="width: 500px; max-width: 80vw;">
            <q-card-section class="row items-center q-pb-none">
                <div class="text-h6">{{$t("creator.removePostDialog.title")}}</div>
                <q-space />
                <q-btn icon="close" flat round dense @click="onClickCancel" />
            </q-card-section>
            <q-card-section>
                <div class="q-my-sm">
                    {{$t("creator.removePostDialog.msg")}}
                </div>
                <div class="text-weight-medium">
                    {{ post.title }}
                </div>
            </q-card-section>
            <q-card-actions align="right" class="q-pr-lg q-pb-lg">
                <q-btn flat :label="$t('general.cancel')" @click="onClickCancel" />
                <q-btn color="negative" :label="$t('general.yes')" @click="onClickOK" />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script>
import api from "src/api"
import { apiError } from "src/apiError"
// following template https://v1.quasar.dev/quasar-plugins/dialog#invoking-custom-component
export default {
    props: {
        post: Object
    },
    methods: {
        show() {
            this.$refs.dialog.show()
        },
        hide() {
            this.$refs.dialog.hide()
        },
        onHideDialog() {
            this.$emit("hide")
        },
        onClickCancel() {
            this.hide()
        },
        onClickOK() {
            this.onSubmit().then((msg) => {
                this.$emit("ok")
                this.hide()
                this.$q.notify({
                    color: "positive",
                    message: msg
                })
            }, (msg) => {
                this.$q.notify({
                    color: "negative",
                    message: msg
                })
            })
        },
        onSubmit() {
            return new Promise((resolve, reject) => {
                api.delete("/posts/"+this.post.postId).catch(err => {
                    apiError()
                }).then(res => {
                    let r = res.data
                    if (r.success) {
                        resolve(this.$t("creator.removePostDialog.success"))
                    }
                    else {
                        reject(r.msg)
                    }
                })
            })
        }
    }
}
</script>

<style>

</style>