<template>
    <q-page class="q-pb-lg">
        <need-to-log-in v-if="!isLoggedIn" />
        <div v-else>
            <div class="row" v-if="user.isAuthor">
                <div class="col-12 col-sm-6">
                    <user-card :user="user"></user-card>
                </div>
                <div class="col-12 col-sm-6">
                    <author-card :author="author"></author-card>
                </div>
            </div>
            <div class="row" v-else>
                <div class="col-12">
                    <user-card :user="user"></user-card>
                </div>
            </div>
            <div class="q-px-md q-px-sm-lg" v-if="user.isAuthor">
                <h5 class="q-mb-sm">{{ $t('me.creator') }}</h5>
                <div class="xs">
                    <q-tabs v-model="creatorTab" active-color="primary" align="justify">
                        <q-tab v-for="item in creatorTabs" :key="item" :name="item" :label="$t('general.'+item)">
                            <q-badge floating v-if="creatorBadges[item]">{{creatorBadges[item]}}</q-badge>
                        </q-tab>
                    </q-tabs>
                </div>
                <div class="row">
                    <div class="gt-xs col-auto">
                        <q-list bordered separator class="creatorTabs text-weight-medium">
                            <q-item v-for="item in creatorTabs" :key="item" clickable v-ripple :active="creatorTab == item" @click="creatorTab = item">
                                <q-item-section>{{ $t('general.'+item) }}</q-item-section>
                                <q-item-section side v-if="creatorBadges[item]">
                                    <q-badge>{{creatorBadges[item]}}</q-badge>
                                </q-item-section>
                            </q-item>
                        </q-list>
                    </div>
                    <div class="col">
                        <q-tab-panels v-model="creatorTab" animated :vertical="$q.screen.gt.xs">
                            <q-tab-panel name="overview" class="q-px-sm q-px-sm-md">
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
                            <q-tab-panel name="posts" class="q-px-sm q-px-sm-md">
                                <div class="text-h5 q-mb-lg q-pr-md">
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
                            <q-tab-panel name="comments" class="q-px-sm q-px-sm-md">
                                <div class="text-h5">{{ $t('general.comments') }}</div>
                                <div class="q-ma-sm q-mb-md" v-if="creatorCommentLoading">
                                    <q-card>
                                        <q-card-section>
                                            <q-skeleton type="rect" class="q-mb-sm"></q-skeleton>
                                            <q-skeleton type="text"></q-skeleton>
                                        </q-card-section>
                                    </q-card>
                                </div>
                                <div class="q-ma-sm q-mb-md" v-for="comment in creator.comments" :key="comment.id">
                                    <q-card>
                                        <q-card-section>
                                            <div class="text-subtitle1">
                                                <router-link class="link-text text-weight-medium q-pr-sm" :to="'/user/'+comment.userId">{{ comment.username }}</router-link> <span class="text-dimmed q-pr-sm">commented on</span> <router-link class="link-text" :to="'/post/'+comment.postId">{{ comment.postTitle }}</router-link></div>
                                            <div class="text-body1 q-py-md">{{ comment.content }}</div>
                                            <div class="text-dimmed q-mt-sm">{{ formatTime(comment.publishTime) }}</div>
                                        </q-card-section>
                                    </q-card>
                                </div>
                                <div class="flex flex-center q-mt-md" v-if="!creatorCommentLoading">
                                    <q-pagination v-model="creatorPagination.comments.current" :max="creatorPagination.comments.max" input @input="creatorPageChange" />
                                </div>
                            </q-tab-panel>
                        </q-tab-panels>
                    </div>
                </div>
            </div>
        </div>
    </q-page>
</template>

<script>
import AuthorCard from "../components/AuthorCard.vue";
import UserCard from "../components/UserCard.vue";
import { mapState } from "vuex";
import api from "../api";
import NeedToLogIn from "../components/NeedToLogIn.vue";
import UpcomingFeature from "../components/UpcomingFeature.vue";
import { formatTimeElapsed } from "../util";
import { apiError } from "src/apiError";
import logger from "src/logger";
export default {
    name: "Me",
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
            creatorTab: "overview",
            creatorTabs: ["overview", "posts", "comments"],
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
            creatorCommentLoading: false
        };
    },
    computed: {
        ...mapState(["isLoggedIn"])
    },
    watch: {
        creatorTab: function(val) {
            this.fetchCreatorTab(val);
        }
    },
    methods: {
        formatTime(n) {
            return formatTimeElapsed(parseInt(n));
        },
        creatorPageChange(val) {
            this.fetchCreatorTab(this.creatorTab);
        },
        fetchCreatorTab(val) {
            if (this.creatorBadges[val]) {
                this.creatorBadges[val] = 0;
            }
            if (val == "overview") {
                api.get("/authors/stats").catch(err => {
                    apiError();
                }).then(res => {
                    let r = res.data;
                    logger(r);
                    if (r.success) {
                        let stats = [];
                        for (let i in r.stats) {
                            stats.push({
                                label: i,
                                value: parseInt(r.stats[i])
                            });
                        }
                        this.creator.stats = stats;
                    }
                    else {
                        logger(r);
                        this.$q.notify({
                            color: "negative",
                            message: r.msg ? r.msg : r,
                            position: "top",
                            timeout: 2000
                        });
                    }
                });
            }
            else if (val == "posts") {
                this.creatorPostLoading = true;
                api.get("/posts/author/"+this.author.id, {
                    page: this.creatorPagination.posts.current
                }).catch(err => {
                    apiError();
                }).then(res => {
                    let r = res.data;
                    if (r.success) {
                        this.creator.posts = r.posts;
                        if (r.postCount) {
                            let postCount = parseInt(r.postCount);
                            this.creatorPagination.posts.max = Math.floor(postCount / 10) + (postCount % 10 == 0 ? 0 : 1);
                        }
                    }
                    else {
                        this.$q.notify({
                            color: "negative",
                            message: r.msg,
                            position: "top",
                            timeout: 2000
                        });
                    }
                    this.creatorPostLoading = false;
                });
            }
            else if (val == "comments") {
                this.creatorCommentLoading = true;
                api.get("/comments/author", {
                    page: this.creatorPagination.comments.current
                }).catch(err => {
                    apiError();
                }).then(res => {
                    let r = res.data;
                    logger(r);
                    if (r.success) {
                        this.creator.comments = r.comments;
                        if (r.commentCount) {
                            let commentCount = parseInt(r.commentCount);
                            this.creatorPagination.comments.max = Math.floor(commentCount / 10) + (commentCount % 10 == 0 ? 0 : 1);
                        }
                    }
                    else {
                        this.$q.notify({
                            color: "negative",
                            message: r.msg,
                            position: "top",
                            timeout: 2000
                        });
                    }
                    this.creatorCommentLoading = false;
                });
            }
        },
        removePost(postId, postTitle) {
            this.$q.dialog({
                title: this.$t("me.removePostDialog.title"),
                message: this.$t("me.removePostDialog.msg") + postTitle,
                cancel: true,
                persistent: true
            }).onOk(() => {
                api.delete("/posts/"+postId).catch(err => {
                    apiError();
                }).then(res => {
                    let r = res.data;
                    if (r.success) {
                        this.$q.notify({
                            color: "positive",
                            message: this.$t("me.removePostDialog.success"),
                            position: "top",
                            timeout: 2000
                        });
                        this.fetchCreatorTab("posts");
                    }
                    else {
                        this.$q.notify({
                            color: "negative",
                            message: r.msg,
                            position: "top",
                            timeout: 2000
                        });
                    }
                });
            });
        },
        setData(r) {
            logger(r);
            if (r.isLoggedIn) {
                this.user = r.user;
                this.user.isAuthor = this.user.isAuthor == "1";
                if (this.user.isAuthor) {
                    this.author = r.author;
                    this.fetchCreatorTab(this.creatorTab);

                    api.get("/badges").then(res => {
                        let r = res.data;
                        if (r.success) {
                            this.creatorBadges.comments = r.badges.comments;
                            logger(this.creatorBadges["comments"]);
                        }
                    });
                }
            }
            else {
                this.$q.notify({ color: "negative", message: "Not Logged In", position: "top", timeout: 2000 });
            }
        }
    },
    beforeRouteEnter (to, from, next) {
        api.get("/user/info", {
            detailed: true
        }).catch(err => {
            apiError();
            next();
        }).then(res => {
            next(vm => vm.setData(res.data));
        });
    },
    beforeRouteUpdate (to, from, next) {
        api.get("/user/info", {
            detailed: true
        }).then(res => {
            this.setData(res.data);
            next();
        });
    }
};
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