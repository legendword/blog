<template>
    <q-dialog v-model="open" persistent transition-show="scale" transition-hide="scale">
        <q-card class="loginDialog" v-if="signUp">
            <q-card-section>
                <div class="text-h6">{{ $t('logIn.newAccount') }}</div>
            </q-card-section>
            <q-card-section>
                <q-form class="q-gutter-md q-px-md">
                    <q-input type="email" v-model="email" lazy-rules :rules="emailRules" :label="$t('general.email')"></q-input>
                    <q-input v-model="password" type="password" lazy-rules :rules="passwordRules" :label="$t('general.password')"></q-input>
                    <p><span style="line-height: 36px;padding-right: 5px;">{{ $t('logIn.alreadyAccountPrompt') }}</span> <q-btn :label="$t('logIn.alreadyAccountSignIn')" color="primary" flat @click="toggleSignUp"></q-btn>.</p>
                </q-form>
            </q-card-section>
            <q-card-actions align="right" class="q-pa-lg">
                <q-btn flat :label="$t('general.cancel')" size="md" @click="backToHome" />
                <q-btn flat :label="$t('general.submit')" color="primary" size="md" @click="submitSignUp" />
            </q-card-actions>
        </q-card>
        <q-card class="loginDialog" v-else>
            <q-card-section>
                <div class="text-h6">{{ $t('logIn.signIn') }}</div>
            </q-card-section>
            <q-card-section>
                <q-form class="q-gutter-md q-px-md">
                    <q-input v-model="email" lazy-rules :rules="emailRules" :label="$t('general.email')"></q-input>
                    <q-input v-model="password" type="password" lazy-rules :rules="passwordRules" :label="$t('general.password')"></q-input>
                    <p><span style="line-height: 36px;padding-right: 5px;">{{ $t('logIn.noAccountPrompt') }}</span> <q-btn :label="$t('logIn.noAccountSignUp')" color="primary" flat @click="toggleSignUp"></q-btn>.</p>
                </q-form>
            </q-card-section>
            <q-card-actions align="right" class="q-pa-lg">
                <q-btn flat :label="$t('general.cancel')" size="md" @click="backToHome" />
                <q-btn flat :label="$t('general.submit')" color="primary" size="md" @click="submitLogIn" />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script>
import api from '../api'
export default {
    name: 'LogIn',
    props: {
        open: {
            type: Boolean,
            required: true
        },
        noBackToHome: {
            type: Boolean
        }
    },
    data() {
        return {
            signUp: false,
            email: '',
            password: '',
            emailRules: [
                val => val && val.length > 0 || this.$t('forms.requiredField')
            ],
            passwordRules: [
                val => val && val.length > 0 || this.$t('forms.requiredField')
            ]
        }
    },
    methods: {
        toggleSignUp() {
            this.signUp = !this.signUp
        },
        resetFields() {
            this.password = this.email = ''
            this.signUp = false
        },
        backToHome() {
            this.resetFields()
            if (this.noBackToHome) {
                this.$emit('closed')
            }
            else {
                if (this.$route.path!='/') this.$router.push('/')
                this.$emit('closed')
            }
        },
        submitSignUp() {
            api('signup', {
                email: this.email,
                password: this.password
            }).then(res => {
                let r = res.data
                if (r.error) {
                    this.$q.notify({
                        color: 'negative',
                        message: r.msg,
                        position: 'top',
                        timeout: 2000
                    })
                }
                else if (r.success) {
                    this.$store.commit('newAccount', this.email)
                    this.resetFields()
                    this.$emit('closed')
                    this.$router.push('/newAccount')
                }
            })
        },
        submitLogIn() {
            api('signin', {
                email: this.email,
                password: this.password
            }).then(res => {
                let r = res.data
                console.log(r);
                if (r.error) {
                    this.$q.notify({
                        color: 'negative',
                        message: r.msg,
                        position: 'top',
                        timeout: 2000
                    })
                }
                else if (r.invalid) {
                    this.$q.notify({
                        color: 'negative',
                        message: this.$t('logIn.incorrect'),
                        position: 'top',
                        timeout: 2000
                    })
                }
                else if (r.success) {
                    this.$store.commit('userLogIn', r.user)
                    this.resetFields()
                    this.$emit('closed')
                    this.$router.go(0)
                }
            })
        }
    }
}
</script>

<style scoped>
.loginDialog {
    width: 800px;
    max-width: 80vw;
}
</style>