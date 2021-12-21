<template>
    <q-dialog ref="dialog" @hide="onHideDialog">
        <q-card class="q-dialog-plugin" style="width: 800px; max-width: 80vw;">
            <q-card-section class="row items-center q-pb-none">
                <div class="text-h6">{{$t('userProfile.editProfile')}}</div>
                <q-space />
                <q-btn icon="close" flat round dense @click="onClickCancel" />
            </q-card-section>
            <q-card-section>
                <q-input class="q-mt-md" outlined debounce="500" v-model="values.username" lazy-rules :rules="rules.username" :label="$t('general.username')" ref="username"></q-input>
            </q-card-section>
            <q-card-actions align="right" class="q-pr-lg q-pb-lg">
                <q-btn flat :label="$t('general.submit')" color="primary" size="md" @click="onClickOK" />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script>
import api from 'src/api'
import { apiError } from 'src/apiError'
// following template https://v1.quasar.dev/quasar-plugins/dialog#invoking-custom-component
export default {
    props: {
        initialValues: Object
    },
    data() {
        return {
            values: {...this.initialValues},
            rules: {
                username: [
                    val => val && val.length > 0 || this.$t('forms.requiredField'),
                    val => val.length <= 20 || this.$t('forms.maxChar', ['20']),
                    val => /^[a-zA-Z ]+$/.test(val) || this.$t('forms.onlyLettersAndSpaces'),
                    this.checkUsername
                ],
            }
        }
    },
    methods: {
        checkUsername(val) {
            return new Promise((resolve, reject) => {
                api.get("/util/name/user", {
                    name: val
                }).then(res => {
                    let r = res.data
                    if (r.success) {
                        if (r.result == true) {
                            resolve(true)
                        }
                        else {
                            resolve(this.$t('forms.nameTaken'))
                        }
                    }
                    else {
                        apiError()
                        reject(r)
                    }
                })
            })
        },
        show() {
            this.$refs.dialog.show()
        },
        hide() {
            this.$refs.dialog.hide()
        },
        onHideDialog() {
            this.$emit('hide')
        },
        onClickCancel() {
            this.hide()
        },
        onClickOK() {
            let vld = this.$refs.username.validate()
            if (vld.then) {
                vld.then(outcome => {
                    if (outcome === true) {
                        this.realSubmit()
                    }
                })
            }
            else {
                if (vld === true) {
                    this.realSubmit()
                }
            }
        },
        realSubmit() {
            this.onSubmit().then((msg) => {
                this.$emit('ok', {...this.values})
                this.hide()
                this.$q.notify({
                    color: 'positive',
                    message: msg
                })
            }, (msg) => {
                this.$q.notify({
                    color: 'negative',
                    message: msg
                })
            })
        },
        onSubmit() {
            return new Promise((resolve, reject) => {
                api.put('/user/info', {
                    username: this.values.username
                }).catch(err => {
                    apiError()
                }).then(res => {
                    let r = res.data
                    if (r.success) {
                        resolve(this.$t('userProfile.profileUpdated'))
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