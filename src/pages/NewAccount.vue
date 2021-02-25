<template>
    <q-page class="q-pa-lg text-center">
        <h4>Welcome aboard!</h4>
        <h5>You can now log in with <strong>{{ newAccount }}</strong></h5>
        <p>*Email verification is not deployed yet.</p>
        <q-separator></q-separator>
        <q-btn flat color="primary" label="Back To Home" @click="backHome"></q-btn>
    </q-page>
</template>

<script>
export default {
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