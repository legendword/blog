<template>
    <q-page class="q-pb-lg">
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
                                        <div class="col text-caption">{{ user.followingCount }} Following</div>
                                        <div class="col text-caption">{{ user.followerCount }} Followers</div>
                                    </div>
                                </div>
                            </div>
                        </q-card-section>
                    </q-card>
                </router-link>
            </div>
            <div class="col-12 col-sm-4 col-md-6" v-show="user.isAuthor">
                <router-link :to="'/author/'+author.id" class="noLinkStyle">
                    <q-card class="q-ma-lg">
                        <q-card-section>
                            <div class="row">
                                <div class="col-auto q-pr-md">
                                    <q-avatar color="primary" text-color="white">{{ author.displayName ? author.displayName[0]:'' }}</q-avatar>
                                </div>
                                <div class="col q-my-auto">
                                    <div><strong>{{ author.displayName }}</strong> <q-chip size="sm" color="teal" text-color="white" icon="create" class="q-ml-sm">Author</q-chip></div>
                                    <div class="text-caption">{{ author.followerCount }} Followers</div>
                                </div>
                            </div>
                        </q-card-section>
                    </q-card>
                </router-link>
            </div>
        </div>
        <div class="q-px-lg" v-show="user.isAuthor">
            <h5 class="q-mb-sm">Creator</h5>
            <div class="row q-mb-md">
                <div class="col-12">
                    
                </div>
            </div>
            <div class="row">
                <div class="col-auto tabCol">
                    <q-tabs v-model="creatorTab" vertical>
                        <q-tab name="overview" icon="timeline" label="Overview" />
                        <q-tab name="posts" icon="article" label="Posts" />
                        <q-tab name="comments" icon="comment" label="Comments" />
                    </q-tabs>
                </div>
                <div class="col">
                    <q-tab-panels v-model="creatorTab" animated vertical>
                        <q-tab-panel name="overview">
                            <div class="text-h5">Overview</div>
                        </q-tab-panel>
                        <q-tab-panel name="posts">
                            <div class="text-h5 q-mb-lg q-pr-md">
                                Posts
                                <div class="float-right">
                                    <q-btn color="primary" icon="add" label="New Post" to="/compose" />
                                </div>
                            </div>
                            <div class="q-ma-sm q-mb-md" v-for="post in creator.posts" :key="post.postId">
                                <q-card>
                                    <q-card-section>
                                        <div class="row">
                                            <div class="col">
                                                <div class="text-h5">{{ post.title }}</div>
                                                <div class="row text-body1 q-gutter-md">
                                                    <div class="col col-md-auto">
                                                        {{ post.publishTime }}
                                                    </div>
                                                    <div class="col col-md-auto">
                                                        {{ post.views }}
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-auto q-my-auto">
                                                <q-btn-group>
                                                    <q-btn color="primary" label="View" :to="'/post/'+post.postId"></q-btn>
                                                    <q-btn color="grey" label="Remove" @click="removePost(post.postId)"></q-btn>
                                                </q-btn-group>
                                            </div>
                                        </div>
                                        
                                    </q-card-section>
                                </q-card>
                            </div>
                            <div class="q-ma-sm q-mb-md" v-if="creatorPostLoading">
                                <q-card>
                                    <q-card-section>
                                        <q-skeleton type="rect" class="q-mb-sm"></q-skeleton>
                                        <q-skeleton type="text"></q-skeleton>
                                    </q-card-section>
                                </q-card>
                            </div>
                        </q-tab-panel>
                        <q-tab-panel name="comments">
                            <div class="text-h5">Comments</div>
                        </q-tab-panel>
                    </q-tab-panels>
                </div>
            </div>
        </div>
        <log-in :open="!isLoggedIn"></log-in>
    </q-page>
</template>

<script>
import { mapState } from 'vuex'
import api from '../api'
import LogIn from '../components/LogIn'
export default {
    name: 'Me',
    components: {
        LogIn
    },
    data() {
        return {
            author: {},
            user: {},
            creatorTab: 'overview',
            creator: {
                posts: []
            },
            creatorPostLoading: false
        }
    },
    computed: {
        ...mapState(['isLoggedIn'])
    },
    watch: {
        creatorTab: function(val) {
            if (val == 'posts') {
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
                    }
                    this.creatorPostLoading = false
                })
            }
        }
    },
    methods: {
        removePost(postId) {
            console.log(postId)
        }
    },
    created() {
        api('userinfo', {
            detailed: true
        }).then(res => {
            let r = res.data
            console.log(r)
            if (r.error) {
                this.$q.notify({ color: 'negative', message: r.msg, position: 'top', timeout: 2000 });
            }
            else if (r.isLoggedIn) {
                this.user = r.user
                this.user.isAuthor = this.user.isAuthor == '1'
                if (this.user.isAuthor) {
                    this.author = r.author
                }
            }
        })
    }
}
</script>

<style>
.noLinkStyle, .noLinkStyle:hover, .noLinkStyle:active, .noLinkStyle:visited {
  text-decoration: none;
  color: initial;
}
.tabCol {
    width: 100px;
    max-width: 100px;
}
</style>