<template>
    <q-page class="q-pa-lg">
        <h5 class="q-my-md">New Post</h5>
        <q-banner class="bg-grey-3 q-my-md" v-show="isLoggedIn && user.isAuthor == '0'">
            You are not an author yet! Apply to become an author so you can start creating amazing things.
            <template v-slot:action>
                <q-btn flat color="primary" label="Become an Author" /> <!-- todo: becomeAnAuthor -->
            </template>
        </q-banner>
        <div v-show="isLoggedIn && user.isAuthor == '1'">
            <q-input outlined v-model="newPost.title" label="Title" class="q-mb-md"></q-input>
            <div class="q-mt-md row no-wrap">
                <div class="col">
                    <h6 class="q-my-md">Content</h6>
                    <q-scroll-area class="composeScrollArea bordered">
                        <q-input type="textarea" v-model="newPost.content" input-class="postTextarea q-pa-md" borderless></q-input>
                    </q-scroll-area>
                </div>
                <div class="col">
                    <h6 class="q-my-md">Preview</h6>
                    <q-scroll-area class="composeScrollArea" :thumbStyle="scrollAreaThumbStyle">
                        <q-markdown class="q-pa-md" no-html :src="newPost.content"></q-markdown>
                    </q-scroll-area>
                </div>
            </div>
            <div class="q-mt-md">
                <q-btn color="primary" label="Submit" @click="submitPost"></q-btn>
            </div>
            <div class="q-mt-md text-caption">
                Posts made during <strong>alpha testing</strong> can be removed at any time without prior notice. Please do not post content you wish to keep until beta testing.
            </div>
        </div>
        <log-in :open="!isLoggedIn"></log-in>
    </q-page>
</template>

<script>
import { mapState } from 'vuex'
import LogIn from '../components/LogIn'
import api from '../api'
export default {
    name: 'Compose',
    components: {
        LogIn
    },
    data() {
        return {
            newPost: {
                title: '',
                content: ''
            },
            scrollAreaThumbStyle: {
                width: '4px',
                opacity: 0.5,
                backgroundColor: 'grey',
                borderRadius: '2px'
            }
        }
    },
    computed: mapState(['user', 'isLoggedIn']),
    methods: {
        submitPost() {
            if (this.newPost.title.length == 0 || this.newPost.content.length == 0) {
                this.$q.notify({
                    type: 'negative',
                    message: 'The post must have a title.',
                    position: 'top'
                })
                return
            }
            api('newpost', {
                title: this.newPost.title,
                content: this.newPost.content
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
                    this.$q.notify({
                        color: 'positive',
                        message: 'Post is published.',
                        position: 'top',
                        timeout: 2000
                    })
                    //after post publish
                }
            })
        }
    }
}
</script>

<style lang="scss">
.composeScrollArea {
    height: 70vh;
}
.composeScrollArea.bordered {
    border: 1px solid $grey-3;
}
textarea.postTextarea {
    min-height: calc( 70vh - 5px );
    height: calc( 70vh - 5px ) !important;
    resize: none !important;
}
</style>