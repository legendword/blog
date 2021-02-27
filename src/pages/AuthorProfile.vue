<template>
    <q-page class="q-pb-lg">
        <div v-if="authorNotFound">
            <q-banner class="q-pa-lg bg-deep-purple-6 text-white">
                <!--
                <template v-slot:avatar>
                    <q-icon name="account_circle" color="white" />
                </template>
                -->
                <div class="row">
                    <div class="col-12 text-body1 userName q-py-sm">
                        This author does not exist.
                    </div>
                </div>
            </q-banner>
        </div>
        <div v-else>
            <q-banner class="q-pa-lg bg-deep-purple-6 text-white">
                <!--
                <template v-slot:avatar>
                    <q-icon name="account_circle" color="white" />
                </template>
                -->
                <div class="row">
                    <div class="col-12 col-md-6 text-h6 userName q-py-sm">
                        {{ author.displayName }} <q-chip color="teal" text-color="white" icon="create">Author</q-chip>
                    </div>
                    <q-card class="col-12 col-md-6 userStats bg-transparent row text-center">
                        <q-card-section class="col">
                            <div class="text-subtitle1 text-bold">{{ author.followerCount }}</div>
                            <div class="text-body2">Followers</div>
                        </q-card-section>
                        <q-card-section class="col">
                            <div class="text-subtitle1 text-bold">{{ author.postCount }}</div>
                            <div class="text-body2">Posts</div>
                        </q-card-section>
                    </q-card>
                </div>
            </q-banner>
            <div class="q-pa-md">
                <q-card>
                    <q-tabs v-model="tab" align="left" ref="tab" @input="tabChange">
                        <q-tab name="profile" label="Profile" class="q-px-lg" />
                        <q-tab name="posts" label="Posts" class="q-px-lg" />
                    </q-tabs>
                    <q-tab-panels v-model="tab" animated>
                        <q-tab-panel name="profile">
                            <div class="text-h6 q-my-md">
                                Profile
                                <div class="float-right">
                                    <q-btn color="primary" v-show="isCurrentUser" @click="enterProfileEdit">Edit Profile</q-btn>
                                </div>
                            </div>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        </q-tab-panel>
                        <q-tab-panel name="posts">
                            <div class="text-h6 q-my-md">
                                Posts
                            </div>
                            <q-intersection transition="fade" class="col-12 wideCard" v-for="item in postList" :key="item.postId">
                                <post-card :post="item"></post-card>
                            </q-intersection>
                            <!-- <q-scroll-observer @scroll="scrollHandler" scroll-target="body" /> -->
                        </q-tab-panel>
                    </q-tab-panels>
                </q-card>
            </div>
        </div>
        <profile-edit profileMode="author" :data="author" :open="openProfileEdit" @closed="openProfileEdit = false"></profile-edit>
        <!-- place QPageScroller at end of page -->
        <q-page-scroller expand position="top" :scroll-offset="200" :offset="[0, 0]">
            <div class="col cursor-pointer q-pa-sm bg-deep-purple-6 text-white text-center">
                {{ author.displayName }}
            </div>
        </q-page-scroller>
    </q-page>
</template>

<script>
import api from '../api';
import { mapState } from 'vuex';
import ProfileEdit from '../components/ProfileEdit'
import PostCard from '../components/PostCard'
export default {
    name: 'AuthorProfile',
    components: {
        ProfileEdit,
        PostCard
    },
    data() {
        return {
            author: {},
            postList: [],
            isCurrentUser: false,
            authorNotFound: false,
            tab: 'profile',
            openProfileEdit: false
        }
    },
    computed: {
        authorId () {
            return this.$route.params.id
        }
    },
    methods: {
        tabChange(val) {
            console.log(val)
            if (val == 'posts') {
                api('listpost', {
                    type: 'author',
                    id: this.author.id
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
                    }
                })
            }
        },
        scrollHandler(details) {
            let el = this.$refs.tab.$el
            let offset = el.offsetTop
            let tabTop = el.getBoundingClientRect().top
        },
        enterProfileEdit() {
            this.openProfileEdit = true
        },
        setData(r) {
            this.author = {}
            this.isCurrentUser = false
            this.authorNotFound = false
            if (r.error) {
                if (r.errorType) {
                    if (r.errorType == 'AuthorNotFound') {
                        this.authorNotFound = true;
                    }
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
            else {
                this.author = r.author
                this.isCurrentUser = this.$store.state.isLoggedIn && r.author.userId == this.$store.state.user.id
                this.$store.commit('setBarTitle', 'Author / '+this.author.displayName)
            }
        }
    },
    beforeRouteEnter (to, from, next) {
        api('authorinfo', {
            id: to.params.id
        }).then(res => {
            next(vm => vm.setData(res.data))
        })
    },
    beforeRouteUpdate (to, from, next) {
        api('authorinfo', {
            id: to.params.id
        }).then(res => {
            this.setData(res.data)
            next()
        })
    }
}
</script>

<style>
/* copied some of the style from UserProfile.vue */
.userName {
    margin: auto;
}
.userStats {
    max-width: 400px;
}
.wideCard {
  height: 150px;
}
.wideCard .post-card {
  height: 140px;
}
</style>
