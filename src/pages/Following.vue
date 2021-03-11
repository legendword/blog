<template>
    <q-page>
        <need-to-log-in v-if="!isLoggedIn" />
        <div v-else class="q-pa-lg">
            <h4 class="q-mb-lg">{{ $t('followingPage.newPosts') }}</h4>
            <q-intersection transition="fade" class="wideCard" v-for="item in postList" :key="item.postId">
                <post-card :post="item"></post-card>
            </q-intersection>
        </div>
    </q-page>
</template>

<script>
import NeedToLogIn from '../components/NeedToLogIn.vue'
import api from '../api'
import PostCard from '../components/PostCard'
export default {
    name: 'Following',
    components: {
        PostCard,
        NeedToLogIn
    },
    data() {
        return {
            postList: [],
            postCount: 0
        }
    },
    computed: {
        isLoggedIn() {
            return this.$store.state.isLoggedIn
        }
    },
    mounted() {
        if (this.isLoggedIn) {
            api('listpost', {
                type: 'following'
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
                    this.postList = r.posts
                    this.postCount = r.postCount
                }
            })
        }
    }
}
</script>

<style>

</style>