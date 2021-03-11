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
                        {{ $t('authorProfile.notFoundMsg') }}
                    </div>
                </div>
            </q-banner>
        </div>
        <div v-else>
            <q-banner class="q-px-lg q-pt-lg">
                <!--
                <template v-slot:avatar>
                    <q-icon name="account_circle" color="white" />
                </template>
                -->
                <div class="text-h6 userName q-py-sm row items-center">
                    <div class="col-auto">
                        <q-avatar size="64px" color="deep-purple-6" text-color="white" class="q-my-auto">{{ author.displayName?author.displayName[0]:'' }}</q-avatar>
                    </div>
                    <div class="col q-mx-md">
                        <span class="q-mr-sm q-my-auto vertical-middle">{{ author.displayName }}</span>
                        <q-chip color="accent" text-color="white" icon="create">{{ $t('tag.author') }}</q-chip>
                    </div>
                    <div class="col-auto q-mx-md" v-if="isLoggedIn">
                        <q-btn class="q-px-md" :text-color="hoverUnfollow ? 'white' : 'black'" :color="hoverUnfollow ? 'negative' : 'white'" :label="$t('userAction.' + (hoverUnfollow ? 'unfollow' : 'following'))" @mouseenter="hoverUnfollow = true" @mouseleave="hoverUnfollow = false" @click="followAuthor" v-if="author.isFollowing"></q-btn>
                        <q-btn class="q-px-md" color="primary" :label="$t('userAction.follow')" @click="followAuthor" v-else></q-btn>
                    </div>
                </div>
                <div class="row q-my-md text-subtitle1 q-gutter-md">
                    <div class="col col-sm-auto"><span class="text-h6 text-primary">{{ author.followerCount }}</span> {{ $tc('computed.followers', author.followerCount) }}</div>
                    <div class="col col-sm-auto"><span class="text-h6 text-primary">{{ author.postCount }}</span> {{ $tc('computed.posts', author.postCount) }}</div>
                </div>
            </q-banner>
            <div class="q-pa-md">
                <q-tabs v-model="tab" align="left" ref="tab" @input="tabChange">
                    <q-tab name="profile" :label="$t('authorProfile.profile')" class="q-px-lg" />
                    <q-tab name="posts" :label="$t('authorProfile.posts')" class="q-px-lg" />
                </q-tabs>
                <q-tab-panels v-model="tab" animated>
                    <q-tab-panel name="profile">
                        <div class="text-h6 q-my-md">
                            {{ $t('authorProfile.profile') }}
                            <div class="float-right">
                                <q-btn color="primary" v-show="isCurrentUser" @click="enterProfileEdit">{{ $t('authorProfile.editProfile') }}</q-btn>
                            </div>
                        </div>
                        Profile is coming in a future release.
                    </q-tab-panel>
                    <q-tab-panel name="posts">
                        <div class="text-h6 q-my-md">
                            {{ $t('authorProfile.posts') }}
                        </div>
                        <q-intersection transition="fade" class="col-12 wideCard" v-for="item in postList" :key="item.postId">
                            <post-card :post="item"></post-card>
                        </q-intersection>
                        <!-- <q-scroll-observer @scroll="scrollHandler" scroll-target="body" /> -->
                    </q-tab-panel>
                </q-tab-panels>
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
            openProfileEdit: false,
            hoverUnfollow: false
        }
    },
    computed: {
        authorId () {
            return this.$route.params.id
        },
        isLoggedIn () {
            return this.$store.state.isLoggedIn
        }
    },
    methods: {
        followAuthor() {
            api('performaction', {
                type: 'followAuthor',
                to: this.author.id
            }).then(res => {
                let r = res.data
                console.log(r)
                if (r.error) {
                    this.$q.notify({ color: 'negative', message: r.msg, position: 'top', timeout: 2000 });
                }
                else if (r.success) {
                    this.author.followerCount = parseInt(this.author.followerCount) + parseInt(r.followerDelta)
                    this.author.isFollowing = !this.author.isFollowing
                }
            })
        },
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
                this.$store.commit('setBarTitle', this.$t('barTitle.author') + ' / ' + this.author.displayName)
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
</style>
