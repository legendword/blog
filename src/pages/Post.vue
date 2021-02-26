<template>
    <q-page class="q-pa-lg">
        <div v-if="postNotFound">
            <h5>Oops..</h5>
            <h6>This post has been deleted or does not exist.</h6>
        </div>
        <div v-else>
            <h4>{{ post.title }}</h4>
            <q-markdown class="q-my-md" no-html :src="post.content"></q-markdown>
            <p class="text-caption">Post Id: {{ $route.params.id }}</p>
        </div>
    </q-page>
</template>

<script>
import api from '../api'
export default {
    name: 'Post',
    data() {
        return {
            post: {},
            postNotFound: false
        }
    },
    created() {
        if (this.$store.state.miniDrawerMode == false) {
            this.$store.commit('setMiniDrawerMode', true);
        }
    },
    methods: {
        setData(r) {
            if (r.error) {
                if (r.errorType && r.errorType == 'PostNotFound') {
                    this.postNotFound = true
                }
                else {
                    this.$q.notify({
                        color: 'negative',
                        message: r.msg,
                        position: 'top',
                        timeout: 2000
                    })
                }
            }
            else if (r.success) {
                console.log(r.post)
                this.post = r.post
            }
        }
    },
    beforeRouteEnter (to, from, next) {
        api('getpost', {
            id: to.params.id
        }).then(res => {
            next(vm => vm.setData(res.data))
        })
    },
    beforeRouteUpdate (to, from, next) {
        api('getpost', {
            id: to.params.id
        }).then(res => {
            this.setData(res.data)
            next()
        })
    },
    beforeRouteLeave (to, from, next) {
        if (!to.meta.miniDrawer) {
            this.$store.commit('setMiniDrawerMode', false);
        }
        next()
    }
}
</script>
