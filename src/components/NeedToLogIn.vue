<template>
    <div class="text-center needToLogIn column justify-center content-center items-center">
        <div class="text-h6 q-my-lg text-primary">Legendword Blog</div>
        <div class="text-h5 q-mb-lg">{{$t('needToLogIn.msg')}}</div>
        <div class="row justify-center items-center q-gutter-md">
            <q-btn color="primary" :label="$t('needToLogIn.signInBtn')" @click="signInClick" />
            <q-btn color="white" text-color="black" :label="$t('needToLogIn.backToHomeBtn')" to="/" exact />
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