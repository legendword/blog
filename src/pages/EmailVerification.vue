<template>
    <q-page class="q-pa-lg text-center">
        <div v-show="loaded && success">
            <h5>{{ $t('emailVerification.title') }}</h5>
            <p class="text-subtitle1">{{ $t('emailVerification.msg.before') }}<strong>{{ $route.query.email }}</strong>{{ $t('emailVerification.msg.after') }}</p>
        </div>
        <div v-show="loaded && !success">
            <h5>{{ $t('emailVerification.failedTitle') }}</h5>
            <p class="text-subtitle1">{{ $t('emailVerification.failedMsg') }}</p>
        </div>
        <q-separator></q-separator>
        <q-btn class="q-mt-lg" flat color="primary" :label="$t('newAccount.backToHome')" @click="backHome"></q-btn>
    </q-page>
</template>

<script>
import api from '../api'
export default {
    name: 'EmailVerification',
    data() {
        return {
            loaded: false,
            success: true
        }
    },
    methods: {
        backHome() {
            this.$router.push('/')
        }
    },
    created() {
        if (!this.$route.query.email || !this.$route.query.code) {
            this.success = false
            this.loaded = true
        }
        else {
            api.post('/user/verifyEmail', {
                email: this.$route.query.email,
                code: this.$route.query.code
            }).then(res => {
                let r = res.data
                console.log(r)
                if (r.success) {
                    this.success = true
                }
                else {
                    this.$q.notify({
                        color: 'negative',
                        message: r.msg,
                        position: 'top',
                        timeout: 2000
                    })
                    this.success = false
                }
                this.loaded = true
            })
        }
    }
}
</script>

<style>

</style>