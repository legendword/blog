<template>
    <q-page class="q-pb-lg" v-show="loaded">
        <div v-if="authorNotFound">
            <q-banner class="q-pa-lg bg-primary text-white">
                <div class="row">
                    <div class="col-12 text-body1 userName q-py-sm">
                        {{ $t('authorProfile.notFoundMsg') }}
                    </div>
                </div>
            </q-banner>
        </div>
        <div v-else>
            <q-banner class="q-px-lg q-pt-lg">
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
                        <upcoming-feature version="0.2"></upcoming-feature>
                    </q-tab-panel>
                    <q-tab-panel name="posts">
                        <div class="text-h6 q-my-md">
                            {{ $t('authorProfile.posts') }}
                        </div>
                        <q-intersection class="col-12 wideCard" v-for="item in postList" :key="item.postId">
                            <post-card :post="item"></post-card>
                        </q-intersection>
                        <div class="flex flex-center q-mt-md" v-show="postCount > 0">
                            <q-pagination v-model="postPage" color="primary" :max="maxPages" :max-pages="6" :boundary-numbers="true" @input="changePage"></q-pagination>
                        </div>
                        <!-- <q-scroll-observer @scroll="scrollHandler" scroll-target="body" /> -->
                    </q-tab-panel>
                </q-tab-panels>
            </div>
        </div>
        <profile-edit profileMode="author" :data="author" :open="openProfileEdit" @closed="openProfileEdit = false"></profile-edit>
        <!-- place QPageScroller at end of page -->
        <q-page-scroller expand position="top" :scroll-offset="200" :offset="[0, 0]">
            <div class="col cursor-pointer q-pa-sm bg-secondary text-white text-center">
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
import UpcomingFeature from 'src/components/UpcomingFeature.vue';
export default {
    name: 'AuthorProfile',
    components: {
        ProfileEdit,
        PostCard,
        UpcomingFeature
    },
    data() {
        return {
            loaded: false,
            author: {},
            postList: [],
            postCount: 0,
            postPage: 1,
            postPerPage: 10,
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
        },
        maxPages () {
            return Math.floor(this.postCount / this.postPerPage) + (this.postCount % this.postPerPage == 0 ? 0 : 1)
        }
    },
    methods: {
        changePage(val) {
            this.tabChange(this.tab)
        },
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
            let newPath = '/author/'+this.$route.params.id+'/'+val
            if (this.$route.path != newPath) {
                this.$router.replace(newPath)
            }
            if (val == 'posts') {
                api('listpost', {
                    type: 'author',
                    id: this.author.id,
                    page: this.postPage
                }).then(res => {
                    let r = res.data
                    console.log(r)
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
                        if (r.postCount) {
                            this.postCount = parseInt(r.postCount)
                        }
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
        loadInfo() {
            api('authorinfo', {
                id: this.$route.params.id
            }).then(res => {
                let r = res.data
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
                    console.log(r.author)
                    this.author = r.author
                    this.isCurrentUser = this.$store.state.isLoggedIn && r.author.userId == this.$store.state.user.id
                    this.$store.commit('setBarTitle', this.$t('barTitle.author') + ' / ' + this.author.displayName)
                    this.tabChange(this.tab)
                    this.loaded = true
                }
            })
        }
    },
    created() {
        let tab = this.$route.params.tab
        if (['profile', 'posts'].includes(tab)) {
            this.tab = tab
        }
        this.loadInfo()
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
