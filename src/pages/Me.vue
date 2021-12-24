<template>
    <q-page class="q-pb-lg">
        <need-to-log-in v-if="!isLoggedIn" />
        <div v-else>
            <!-- Profile Banner -->
            <q-banner class="q-px-lg p-pt-xl q-py-lg">
                <div class="text-h6 q-py-sm row items-center">
                    <div class="col-auto">
                        <q-avatar size="64px" color="deep-purple-6" text-color="white" class="q-my-auto">{{ author.displayName?author.displayName[0]:'' }}</q-avatar>
                    </div>
                    <div class="col q-mx-md">
                        <span class="q-mr-sm q-my-auto vertical-middle">{{ author.displayName }}</span>
                        <q-chip color="accent" text-color="white" icon="create">{{ $t('tag.author') }}</q-chip>
                    </div>
                    <div class="col-12 col-sm-auto q-mx-sm-md q-mt-lg q-mt-sm-none text-center" v-show="isLoggedIn">
                        <q-btn class="q-px-md bg-primary text-white">View Public Profile</q-btn>
                    </div>
                    <div class="col-12 col-sm-auto q-mx-sm-md q-mt-lg q-mt-sm-none text-center" v-show="isLoggedIn">
                        <q-btn class="q-px-md bg-primary text-white">Edit Profile</q-btn>
                    </div>
                </div>
                <!-- Follower,Post,Following Count -->
                <div class="row q-my-md text-subtitle1 q-gutter-md">
                    <div class="col-12 col-sm-auto q-my-none"><strong class="text-h6 text-primary">x</strong> {{ $t('general.followers')}}</div>
                    <div class="col-12 col-sm-auto q-my-none"><strong class="text-h6 text-primary">x</strong> {{ $t('general.following')}}</div>
                    <div class="col-12 col-sm-auto q-my-none"><strong class="text-h6 text-primary">x</strong> {{ $t('general.posts')}}</div>
                </div>
            </q-banner>

            <!-- Profile Tab -->
            <div class="q-pa-md">
                <q-tabs v-model="tab" align="left" ref="tab" @input="tabChange">
                    <q-tab name="profile" class="q-px-lg">Profile</q-tab>
                    <q-tab name="posts" class="q-px-lg">Posts</q-tab>
                    <q-tab name="commented" class="q-px-lg">Commented</q-tab>
                    <q-tab name="liked" class="q-px-lg">Liked</q-tab>
                    <q-tab name="saved" class="q-px-lg">Saved</q-tab>
                </q-tabs>
                <q-tab-panels v-model="tab" animated>
                    <q-tab-panel name="profile">
                        <div class="text-h6 q-my-md">Profile</div>
                        <upcoming-feature version="0.4"></upcoming-feature>
                    </q-tab-panel>
                    <q-tab-panel name="posts" class="q-px-sm q-px-sm-md">
                        <div class="text-h6 q-my-md">
                            {{ $t('general.posts') }}
                            <div class="float-right">
                                <q-btn color="primary" icon="add" :label="$t('me.newPost')" to="/compose" />
                            </div>
                        </div>
                        <div class="q-ma-sm q-mb-md" v-if="creatorPostLoading">
                            <q-card>
                                <q-card-section>
                                    <q-skeleton type="rect" class="q-mb-sm"></q-skeleton>
                                    <q-skeleton type="text"></q-skeleton>
                                </q-card-section>
                            </q-card>
                        </div>
                        <div class="q-ma-sm q-mb-md" v-for="post in creator.posts" :key="post.postId">
                            <q-card>
                                <q-card-section>
                                    <div class="row">
                                        <div class="col">
                                            <div class="text-h5 q-mb-sm">{{ post.title }}</div>
                                            <div class="xs text-body1">
                                                <div>{{ post.publishTimeStr }}</div>
                                                <div>{{ post.views }} {{$t('me.postViews')}}</div>
                                            </div>
                                            <div class="gt-xs text-body1">
                                                <span class="q-pr-md">
                                                    {{ post.publishTimeStr }}
                                                </span>
                                                <span>
                                                    {{ post.views }} {{$t('me.postViews')}}
                                                </span>
                                            </div>
                                        </div>
                                        <div class="col-auto q-my-auto">
                                            <q-btn-dropdown flat dense class="xs" color="primary" icon="pending">
                                                <q-list>
                                                    <q-item clickable v-close-popup @click="$router.push('/post/'+post.postId)">
                                                        <q-item-section>
                                                            <q-item-label>{{$t('me.viewPost')}}</q-item-label>
                                                        </q-item-section>
                                                    </q-item>
                                                    <q-item clickable v-close-popup @click="removePost(post.postId, post.title)">
                                                        <q-item-section>
                                                            <q-item-label>{{$t('me.removePost')}}</q-item-label>
                                                        </q-item-section>
                                                    </q-item>
                                                </q-list>
                                            </q-btn-dropdown>
                                            <q-btn-group class="gt-xs">
                                                <q-btn color="primary" :label="$t('me.viewPost')" :to="'/post/'+post.postId"></q-btn>
                                                <q-btn color="grey" :label="$t('me.removePost')" @click="removePost(post.postId, post.title)"></q-btn>
                                            </q-btn-group>
                                        </div>
                                    </div>
                                    
                                </q-card-section>
                            </q-card>
                            
                        </div>
                        <div class="flex flex-center q-mt-md" v-if="!creatorPostLoading">
                            <q-pagination v-model="creatorPagination.posts.current" :max="creatorPagination.posts.max" input @input="creatorPageChange" />
                        </div>
                    </q-tab-panel>
                    <q-tab-panel name="commented">
                        <div class="text-h6 q-my-md">Commented</div>
                        <upcoming-feature version="0.4"></upcoming-feature>
                    </q-tab-panel>
                    <q-tab-panel name="liked">
                        <div class="text-h6 q-my-md">Liked</div>
                        <upcoming-feature version="0.4"></upcoming-feature>
                    </q-tab-panel>
                    <q-tab-panel name="saved">
                        <div class="text-h6 q-my-md">Saved</div>
                        <upcoming-feature version="0.4"></upcoming-feature>
                    </q-tab-panel>
                </q-tab-panels>
            </div>
        </div>
    </q-page>
</template>

<script>
import AuthorCard from '../components/AuthorCard.vue'
import UserCard from '../components/UserCard.vue'
import { mapState } from 'vuex'
import api from '../api'
import NeedToLogIn from '../components/NeedToLogIn.vue'
import UpcomingFeature from '../components/UpcomingFeature.vue'
import { formatTimeElapsed } from '../util'
import { apiError } from 'src/apiError'
export default {
    name: 'Me',
    components: {
        NeedToLogIn,
        AuthorCard,
        UserCard,
        UpcomingFeature
    },
    data() {
        return {
            author: {},
            user: {},
            creatorTab: 'overview',
            creatorTabs: ['overview', 'posts', 'comments'],
            creatorBadges: {
                comments: 0
            },
            creator: {
                stats: [],
                posts: [],
                comments: []
            },
            creatorPagination: {
                posts: {
                    current: 1,
                    max: 0
                },
                comments: {
                    current: 1,
                    max: 0
                }
            },
            creatorPostLoading: false,
            creatorCommentLoading: false,
            loaded: false,
            author: {},
            postList: [],
            postCount: 0,
            postPage: 1,
            postPerPage: 10,
            isCurrentUser: false,
            authorNotFound: false,
            tab: 'profile',
            hoverUnfollow: false
        }
    },
    computed: {
        ...mapState(['isLoggedIn'])
    },
    watch: {
        creatorTab: function(val) {
            this.fetchCreatorTab(val)
        }
    },
    methods: {
        formatTime(n) {
            return formatTimeElapsed(parseInt(n))
        },
        creatorPageChange(val) {
            this.fetchCreatorTab(this.creatorTab)
        },
        fetchCreatorTab(val) {
            if (this.creatorBadges[val]) {
                this.creatorBadges[val] = 0
            }
            if (val == 'overview') {
                api.get('/authors/stats').catch(err => {
                    apiError()
                }).then(res => {
                    let r = res.data
                    console.log(r)
                    if (r.success) {
                        let stats = []
                        for (let i in r.stats) {
                            stats.push({
                                label: i,
                                value: parseInt(r.stats[i])
                            })
                        }
                        this.creator.stats = stats
                    }
                    else {
                        console.log(r)
                        this.$q.notify({
                            color: 'negative',
                            message: r.msg ? r.msg : r,
                            position: 'top',
                            timeout: 2000
                        })
                    }
                })
            }
            else if (val == 'posts') {
                this.creatorPostLoading = true
                api.get('/posts/author/'+this.author.id, {
                    page: this.creatorPagination.posts.current
                }).catch(err => {
                    apiError()
                }).then(res => {
                    let r = res.data
                    if (r.success) {
                        this.creator.posts = r.posts
                        if (r.postCount) {
                            let postCount = parseInt(r.postCount)
                            this.creatorPagination.posts.max = Math.floor(postCount / 10) + (postCount % 10 == 0 ? 0 : 1)
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
                    this.creatorPostLoading = false
                })
            }
            else if (val == 'comments') {
                this.creatorCommentLoading = true
                api.get('/comments/author', {
                    page: this.creatorPagination.comments.current
                }).catch(err => {
                    apiError()
                }).then(res => {
                    let r = res.data
                    console.log(r)
                    if (r.success) {
                        this.creator.comments = r.comments
                        if (r.commentCount) {
                            let commentCount = parseInt(r.commentCount)
                            this.creatorPagination.comments.max = Math.floor(commentCount / 10) + (commentCount % 10 == 0 ? 0 : 1)
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
                    this.creatorCommentLoading = false
                })
            }
        },
        removePost(postId, postTitle) {
            this.$q.dialog({
                title: this.$t('me.removePostDialog.title'),
                message: this.$t('me.removePostDialog.msg') + postTitle,
                cancel: true,
                persistent: true
            }).onOk(() => {
                api.delete('/posts/'+postId).catch(err => {
                    apiError()
                }).then(res => {
                    let r = res.data
                    if (r.success) {
                        this.$q.notify({
                            color: 'positive',
                            message: this.$t('me.removePostDialog.success'),
                            position: 'top',
                            timeout: 2000
                        })
                        this.fetchCreatorTab('posts')
                    }
                    else {
                        this.$q.notify({
                            color: 'negative',
                            message: r.msg,
                            position: 'top',
                            timeout: 2000
                        })
                    }
                })
            })
        },
        setData(r) {
            console.log(r)
            if (r.isLoggedIn) {
                this.user = r.user
                this.user.isAuthor = this.user.isAuthor == '1'
                if (this.user.isAuthor) {
                    this.author = r.author
                    this.fetchCreatorTab(this.creatorTab)

                    api.get('/badges').then(res => {
                        let r = res.data
                        if (r.success) {
                            this.creatorBadges.comments = r.badges.comments
                            console.log(this.creatorBadges['comments'])
                        }
                    })
                }
            }
            else {
                this.$q.notify({ color: 'negative', message: 'Not Logged In', position: 'top', timeout: 2000 });
            }
        }
    },
    beforeRouteEnter (to, from, next) {
        api.get('/user/info', {
            detailed: true
        }).catch(err => {
            apiError()
            next()
        }).then(res => {
            next(vm => vm.setData(res.data))
        })
    },
    beforeRouteUpdate (to, from, next) {
        api.get('/user/info', {
            detailed: true
        }).then(res => {
            this.setData(res.data)
            next()
        })
    }
}
</script>

<style>
.noLinkStyle, .noLinkStyle:hover, .noLinkStyle:active, .noLinkStyle:visited {
  text-decoration: none;
  color: initial;
}
.creatorTabs {
    width: 150px;
}
</style>