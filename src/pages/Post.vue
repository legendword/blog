<template>
    <q-page class="q-pa-lg">
        <div v-if="postNotFound">
            <h5>Oops..</h5>
            <h6>This post has been deleted or does not exist.</h6>
        </div>
        <div v-else>
            <h4>{{ post.title }}</h4>
            <div class="row q-gutter-md q-mb-lg">
                <div class="col-12 col-sm-auto text-subtitle1">
                    <q-card>
                        <q-card-section>
                            <div class="row">
                                <div class="col-auto q-pr-md">
                                    <router-link :to="'/author/'+post.authorId" class="noLinkStyle">
                                        <q-avatar color="primary" text-color="white">{{ post.authorName ? post.authorName[0]:'' }}</q-avatar>
                                    </router-link>
                                </div>
                                <div class="col q-my-auto">
                                    <router-link :to="'/author/'+post.authorId" class="noLinkStyle"><strong>{{ post.authorName }}</strong></router-link>
                                    <div class="text-caption">{{ post.followerCount }} Followers</div>
                                </div>
                                <div class="col-auto q-my-auto q-ml-md" v-show="isLoggedIn">
                                    <q-btn flat :color="hoverUnfollow ? 'negative' : 'grey'" :label="hoverUnfollow ? 'Unfollow' : 'Following'" @mouseenter="hoverUnfollow = true" @mouseleave="hoverUnfollow = false" @click="followAuthor" v-if="post.isFollowing"></q-btn>
                                    <q-btn flat color="primary" label="Follow" @click="followAuthor" v-else></q-btn>
                                </div>
                            </div>
                        </q-card-section>
                    </q-card>
                </div>
                <div class="col-12 col-sm-auto text-subtitle1">
                    <q-card>
                        <q-card-section class="q-pb-xs q-pt-sm">
                            <div class="row">
                                <div class="col">
                                    <div class="row">
                                        <div class="col-auto">
                                            <q-icon name="schedule" size="18px" class="q-pr-sm"></q-icon>
                                        </div>
                                        <div class="col text-caption q-my-auto">
                                            {{ post.publishTimeStr }}
                                        </div>
                                    </div>
                                </div>
                                <!-- 
                                <div class="col q-pl-md">
                                    <div class="row">
                                        <div class="col-auto">
                                            <q-icon name="schedule" size="18px" class="q-pr-sm"></q-icon>
                                        </div>
                                        <div class="col text-caption q-my-auto">
                                            {{ post.publishTime }}
                                        </div>
                                    </div>
                                </div> -->
                            </div>
                        </q-card-section>
                        <q-card-section class="q-pt-xs q-pb-sm">
                            <div class="row">
                                <div class="col">
                                    <div class="row">
                                        <div class="col-auto">
                                            <q-icon name="auto_stories" size="18px" class="q-pr-sm"></q-icon>
                                        </div>
                                        <div class="col text-caption q-my-auto">
                                            {{ post.views }}
                                        </div>
                                    </div>
                                </div>
                                <!--
                                <div class="col q-pl-md">
                                    <div class="row">
                                        <div class="col-auto">
                                            <q-icon name="auto_stories" size="18px" class="q-pr-sm"></q-icon>
                                        </div>
                                        <div class="col text-caption q-my-auto">
                                            {{ post.views }}
                                        </div>
                                    </div>
                                </div> -->
                            </div>
                        </q-card-section>
                    </q-card>
                </div>
            </div>
            <q-markdown class="q-my-md" no-html :src="post.content"></q-markdown>
            <p class="text-caption">Post Id: {{ $route.params.id }}</p>
        </div>
    </q-page>
</template>

<script>
import api from '../api'
import { mapState } from 'vuex'
export default {
    name: 'Post',
    data() {
        return {
            post: {},
            postNotFound: false,
            hoverUnfollow: false
        }
    },
    computed: mapState(['isLoggedIn']),
    created() {
        if (this.$store.state.miniDrawerMode == false) {
            this.$store.commit('setMiniDrawerMode', true);
        }
    },
    methods: {
        followAuthor() {
            api('performaction', {
                type: 'followAuthor',
                to: this.post.authorId
            }).then(res => {
                let r = res.data
                console.log(r)
                if (r.error) {
                    this.$q.notify({ color: 'negative', message: r.msg, position: 'top', timeout: 2000 });
                }
                else if (r.success) {
                    this.post.followerCount = parseInt(this.post.followerCount) + parseInt(r.followerDelta)
                    this.post.isFollowing = !this.post.isFollowing
                }
            })
        },
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
                this.$store.commit('setBarTitle')
            }
            else if (r.success) {
                console.log(r.post)
                this.post = r.post
                this.$store.commit('setBarTitle', r.post.title)
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

<style scoped>
.noLinkStyle, .noLinkStyle:hover, .noLinkStyle:active, .noLinkStyle:visited {
  text-decoration: none;
  color: initial;
}
</style>