<template>
    <q-page class="q-pb-lg">
        <need-to-log-in v-if="!isLoggedIn" />
        <div v-else>
            <div class="row">
                <div class="col-12 col-sm-8 col-md-6">
                    <router-link :to="'/user/'+user.id" class="noLinkStyle">
                        <q-card class="q-ma-lg">
                            <q-card-section>
                                <div class="row">
                                    <div class="col-auto q-pr-md">
                                        <q-avatar color="primary" text-color="white">{{ user.username ? user.username[0]:'' }}</q-avatar>
                                    </div>
                                    <div class="col q-my-auto">
                                        <div><strong>{{ user.username }}</strong></div>
                                        <div class="row">
                                            <div class="col text-caption">{{ user.followingCount }} {{ $t('general.following') }}</div>
                                            <div class="col text-caption">{{ user.followerCount }} {{ $tc('computed.followers', user.followerCount) }}</div>
                                        </div>
                                    </div>
                                </div>
                            </q-card-section>
                        </q-card>
                    </router-link>
                </div>
                <div class="col-12 col-sm-4 col-md-6" v-show="user.isAuthor">
                    <author-card :author="author"></author-card>
                </div>
            </div>
            <div class="q-px-lg" v-show="user.isAuthor">
                <h5 class="q-mb-sm">{{ $t('me.creator') }}</h5>
                <div class="row">
                    <div class="col-auto">
                        <q-list bordered separator class="creatorTabs text-weight-medium">
                            <q-item clickable v-ripple :active="creatorTab == 'overview'" @click="creatorTab = 'overview'">
                                <q-item-section>{{ $t('general.overview') }}</q-item-section>
                            </q-item>
                            <q-item clickable v-ripple :active="creatorTab == 'posts'" @click="creatorTab = 'posts'">
                                <q-item-section>{{ $t('general.posts') }}</q-item-section>
                            </q-item>
                            <q-item clickable v-ripple :active="creatorTab == 'comments'" @click="creatorTab = 'comments'">
                                <q-item-section>{{ $t('general.comments') }}</q-item-section>
                            </q-item>
                        </q-list>
                    </div>
                    <div class="col">
                        <q-tab-panels v-model="creatorTab" animated vertical>
                            <q-tab-panel name="overview">
                                <div class="text-h5">{{ $t('general.overview') }}</div>
                                <div class="row q-mt-lg text-center">
                                    <div class="col-12 col-sm-6 col-md-4 q-pa-sm" v-for="stat in creator.stats" :key="stat.label">
                                        <q-card>
                                            <q-card-section>
                                                <div class="text-h6">{{$t('me.stats.'+stat.label)}}</div>
                                            </q-card-section>
                                            <q-card-section>
                                                <div class="text-h5">{{stat.value}}</div>
                                            </q-card-section>
                                        </q-card>
                                    </div>
                                </div>
                            </q-tab-panel>
                            <q-tab-panel name="posts">
                                <div class="text-h5 q-mb-lg q-pr-md">
                                    {{ $t('general.posts') }}
                                    <div class="float-right">
                                        <q-btn color="primary" icon="add" :label="$t('me.newPost')" to="/compose" />
                                    </div>
                                </div>
                                <div>
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
                                                        <div class="text-h5">{{ post.title }}</div>
                                                        <div class="row text-body1 q-gutter-md">
                                                            <div class="col col-md-auto">
                                                                {{ post.publishTimeStr }}
                                                            </div>
                                                            <div class="col col-md-auto">
                                                                {{ post.views }} {{$t('me.postViews')}}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="col-auto q-my-auto">
                                                        <q-btn-group>
                                                            <q-btn color="primary" :label="$t('me.viewPost')" :to="'/post/'+post.postId"></q-btn>
                                                            <q-btn color="grey" :label="$t('me.removePost')" @click="removePost(post.postId)"></q-btn>
                                                        </q-btn-group>
                                                    </div>
                                                </div>
                                                
                                            </q-card-section>
                                        </q-card>
                                        
                                    </div>
                                    <div class="flex flex-center q-mt-md" v-if="!creatorPostLoading">
                                        <q-pagination v-model="creatorPagination.posts.current" :max="creatorPagination.posts.max" input @input="creatorPostsPageChange" />
                                    </div>
                                </div>
                            </q-tab-panel>
                            <q-tab-panel name="comments">
                                <div class="text-h5">{{ $t('general.comments') }}</div>
                                <upcoming-feature></upcoming-feature>
                            </q-tab-panel>
                        </q-tab-panels>
                    </div>
                </div>
            </div>
        </div>
    </q-page>
</template>

<script>
import AuthorCard from '../components/AuthorCard.vue'
import { mapState } from 'vuex'
import api from '../api'
import NeedToLogIn from '../components/NeedToLogIn.vue'
import UpcomingFeature from '../components/UpcomingFeature.vue'
export default {
    name: 'Me',
    components: {
        NeedToLogIn,
        AuthorCard,
        UpcomingFeature
    },
    data() {
        return {
            author: {},
            user: {},
            creatorTab: 'overview',
            creator: {
                stats: [],
                posts: []
            },
            creatorPagination: {
                posts: {
                    current: 1,
                    max: 0
                }
            },
            creatorPostLoading: false
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
        creatorPostsPageChange(val) {
            this.creatorPostLoading = true
            this.creator.posts = []
            api('listpost', {
                type: 'author',
                id: this.author.id,
                page: val
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
                    this.creator.posts = r.posts
                }
                this.creatorPostLoading = false
            })
        },
        fetchCreatorTab(val) {
            if (val == 'overview') {
                api('authorstats').then(res => {
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
                        this.creator.posts = r.posts
                        let postCount = parseInt(r.postCount)
                        this.creatorPagination.posts.max = Math.floor(postCount / 10) + (postCount % 10 == 0 ? 0 : 1)
                    }
                    this.creatorPostLoading = false
                })
            }
        },
        removePost(postId) {
            console.log(postId)
            this.$q.notify({ color: 'negative', message: 'Removing post is an upcoming feature.', position: 'top', timeout: 2000 });
        },
        setData(r) {
            console.log(r)
            if (r.error) {
                this.$q.notify({ color: 'negative', message: r.msg, position: 'top', timeout: 2000 });
            }
            else if (r.isLoggedIn) {
                this.user = r.user
                this.user.isAuthor = this.user.isAuthor == '1'
                if (this.user.isAuthor) {
                    this.author = r.author
                    this.fetchCreatorTab(this.creatorTab)
                }
            }
        }
    },
    beforeRouteEnter (to, from, next) {
        api('userinfo', {
            detailed: true
        }).then(res => {
            next(vm => vm.setData(res.data))
        })
    },
    beforeRouteUpdate (to, from, next) {
        api('userinfo', {
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