<template>
    <q-page class="q-pa-lg">
        <div v-if="postNotFound">
            <h5>{{ $t('post.notFoundTitle') }}</h5>
            <h6>{{ $t('post.notFoundMsg') }}</h6>
        </div>
        <div v-else class="post-layout">
            <h4>{{ post.title }}</h4>
            <div class="row q-gutter-md q-mb-lg justify-between">
                <div class="col-12 col-md">
                    <div class="q-mt-md text-subtitle1 post-infoLine row inline wrap items-center">
                        <div>
                            {{ $t('post.publishedOn.before') }} <span class="text-weight-medium">{{ post.publishTimeStr }}</span> {{ $t('post.publishedOn.after') }}
                        </div>
                        <div class="q-pl-lg">
                            {{ $t('post.views.before') }} <span class="text-weight-medium">{{ post.views }}</span> {{ $t('post.views.after') }}
                        </div>
                    </div>
                    <div>
                        <q-chip class="text-weight-medium" clickable outline color="primary" @click="goToCategory">{{post.category ? $t('categories.'+post.category) : ''}}</q-chip>
                        <q-chip v-for="tag in post.tags" :key="tag.id" clickable color="primary" text-color="white" @click="goToTag(tag.name)">{{tag.name}}</q-chip>
                    </div>
                </div>
                <div class="col-12 col-md-auto text-subtitle1">
                    <q-card flat bordered>
                        <q-card-section>
                            <div class="row">
                                <div class="col-auto q-pr-md">
                                    <router-link :to="'/author/'+post.authorId" class="noLinkStyle">
                                        <q-avatar color="primary" text-color="white">{{ post.authorName ? post.authorName[0]:'' }}</q-avatar>
                                    </router-link>
                                </div>
                                <div class="col q-my-auto">
                                    <router-link :to="'/author/'+post.authorId" class="noLinkStyle"><strong>{{ post.authorName }}</strong></router-link>
                                    <div class="text-caption">{{ post.followerCount }} {{ $tc('computed.followers', post.followerCount) }}</div>
                                </div>
                                <div class="col-auto q-my-auto q-ml-md" v-show="isLoggedIn">
                                    <q-btn flat :color="hoverUnfollow ? 'negative' : 'grey'" :label="hoverUnfollow ? $t('userAction.unfollow') : $t('userAction.following')" @mouseenter="hoverUnfollow = true" @mouseleave="hoverUnfollow = false" @click="followAuthor" v-if="post.isFollowing"></q-btn>
                                    <q-btn flat color="primary" :label="$t('userAction.follow')" @click="followAuthor" v-else></q-btn>
                                </div>
                            </div>
                        </q-card-section>
                    </q-card>
                </div>

                <!-- 
                <div class="col-12 col-sm-auto text-subtitle1">
                    <q-card flat bordered>
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
                                <div class="col q-pl-md">
                                    <div class="row">
                                        <div class="col-auto">
                                            <q-icon name="schedule" size="18px" class="q-pr-sm"></q-icon>
                                        </div>
                                        <div class="col text-caption q-my-auto">
                                            {{ post.publishTime }}
                                        </div>
                                    </div>
                                </div>
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
                                <div class="col q-pl-md">
                                    <div class="row">
                                        <div class="col-auto">
                                            <q-icon name="auto_stories" size="18px" class="q-pr-sm"></q-icon>
                                        </div>
                                        <div class="col text-caption q-my-auto">
                                            {{ post.views }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </q-card-section>
                    </q-card>
                </div> -->
            </div>
            <MarkDownItVue class="post-content q-py-md col-12 col-md-8" :content="post.content ? post.content : ''" :options="markdownItVueOptions"></MarkDownItVue>
            <p class="text-caption">Post Id: {{ $route.params.id }}</p>
        </div>
    </q-page>
</template>

<script>
import MarkDownItVue from 'markdown-it-vue'
import 'markdown-it-vue/dist/markdown-it-vue.css'
import markdownItVueOptions from '../markdownItVueOptions'
import api from '../api'
import { mapState } from 'vuex'
export default {
    name: 'Post',
    components: {
        MarkDownItVue
    },
    data() {
        return {
            markdownItVueOptions: markdownItVueOptions,
            post: {},
            postNotFound: false,
            hoverUnfollow: false
        }
    },
    computed: mapState(['isLoggedIn']),
    methods: {
        goToCategory() {
            if (this.post.category) {
                this.$router.push('/category/'+this.post.category)
            }
        },
        goToTag(tagName) {
            this.$router.push('/tag/'+tagName)
        },
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
    }
}
</script>

<style scoped>
.noLinkStyle, .noLinkStyle:hover, .noLinkStyle:active, .noLinkStyle:visited {
  text-decoration: none;
  color: initial;
}
.post-layout {
    max-width: 1000px;
    margin-left: auto;
    margin-right: auto;
}
.post-infoLine {
    color: #636363;
}
</style>