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
                <div class="row q-mb-md">
                    <div class="col-12">
                        
                    </div>
                </div>
                <div class="row">
                    <div class="col-auto tabCol">
                        <q-tabs class="bg-shade-light" v-model="creatorTab" vertical>
                            <q-tab name="overview" icon="timeline" :label="$t('general.overview')" />
                            <q-tab name="posts" icon="article" :label="$t('general.posts')" />
                            <q-tab name="comments" icon="comment" :label="$t('general.comments')" />
                        </q-tabs>
                    </div>
                    <div class="col">
                        <q-tab-panels v-model="creatorTab" animated vertical>
                            <q-tab-panel name="overview">
                                <div class="text-h5">{{ $t('general.overview') }}</div>
                            </q-tab-panel>
                            <q-tab-panel name="posts">
                                <div class="text-h5 q-mb-lg q-pr-md">
                                    {{ $t('general.posts') }}
                                    <div class="float-right">
                                        <q-btn color="primary" icon="add" :label="$t('me.newPost')" to="/compose" />
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
                                                        <q-btn color="primary" :label="$t('me.viewPost')" :to="'/post/'+post.postId"></q-btn>
                                                        <q-btn color="grey" :label="$t('me.removePost')" @click="removePost(post.postId)"></q-btn>
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
        </div>
    </q-page>
</template>

<script>
import AuthorCard from '../components/AuthorCard.vue'
import { mapState } from 'vuex'
import api from '../api'
import NeedToLogIn from '../components/NeedToLogIn.vue'
export default {
    name: 'Me',
    components: {
        NeedToLogIn,
        AuthorCard
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
.tabCol {
    width: 100px;
    max-width: 100px;
    min-width: 100px;
}
</style>