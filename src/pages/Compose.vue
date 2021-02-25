<template>
    <q-page class="q-pa-lg">
        <h5>New Post</h5>
        <q-input outlined v-model="newPost.title" label="Title" class="q-mb-md"></q-input>
        <q-editor v-model="newPost.content" min-height="10rem"></q-editor>
        <div class="q-mt-md">
            <q-btn color="primary" label="Post" />
        </div>
        <log-in :open="!isLoggedIn"></log-in>
    </q-page>
</template>

<script>
import { mapState } from 'vuex'
import LogIn from '../components/LogIn'
export default {
    components: {
        LogIn
    },
    data() {
        return {
            newPost: {
                title: '',
                content: ''
            }
        }
    },
    computed: mapState(['user', 'isLoggedIn'])
}
</script>

<style>

</style>