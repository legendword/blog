<template>
    <q-page class="q-pa-lg text-center">
        <h4>{{ $t('newAccount.welcome') }}</h4>
        <h5>{{ $t('newAccount.youCanNowLogIn.before') }}<strong>{{ newAccount }}</strong>{{ $t('newAccount.youCanNowLogIn.after') }}</h5>
        <p>{{ $t('newAccount.footnote') }}</p>
        <q-separator></q-separator>
        <q-btn class="q-mt-lg" flat color="primary" :label="$t('newAccount.backToHome')" @click="backHome"></q-btn>
    </q-page>
</template>

<script>
export default {
    name: 'NewAccount',
    methods: {
        backHome() {
            this.$router.push('/')
        }
    },
    computed: {
        newAccount () {
            return this.$store.state.newAccount
        }
    }
}
</script>

<style>

</style>