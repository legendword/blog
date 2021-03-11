<template>
    <div class="text-center needToLogIn column justify-center content-center items-center">
        <div class="text-h6 q-my-lg text-primary">Legendword Blog</div>
        <div class="text-h5 q-mb-lg">Sign In To Access Full Functionalities</div>
        <div class="row justify-center items-center q-gutter-md">
            <q-btn color="primary" label="Sign In" @click="signInClick" />
            <q-btn color="white" text-color="black" label="Back To Home" to="/" exact />
        </div>
        <log-in :open="openLogIn" :noBackToHome="true" @closed="openLogIn = false" />
    </div>
</template>

<script>
import LogIn from './LogIn.vue'
export default {
    name: 'NeedToLogIn',
    components: { LogIn },
    data() {
        return {
            openLogIn: false
        }
    },
    methods: {
        signInClick() {
            this.openLogIn = true
        }
    }
}
</script>

<style>
.needToLogIn {
    height: calc( 100vh - 50px );
}
</style>