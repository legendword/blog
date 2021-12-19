<template>
    <q-page class="q-pa-md q-pa-sm-lg">
        <div v-if="loaded">
            <div v-if="postNotFound">
                <h5>{{ $t('post.notFoundTitle') }}</h5>
                <h6>{{ $t('post.notFoundMsg') }}</h6>
            </div>
            <div v-else class="post-layout">
                <!-- title and add to collection btn -->
                <div class="row q-mt-lg q-mb-xl">
                    <div class="col">
                        <div class="text-h4 word-break">{{ post.title }}</div>
                    </div>
                    <div class="col-auto" v-show="isLoggedIn">
                        <q-btn round flat color="primary" size="28" icon="o_bookmark_add" @click="loadUserCollections">
                            <q-popup-proxy :breakpoint="500" anchor="bottom end" self="top right">
                                <q-card style="width: 300px; max-width: 80vw;">
                                    <q-card-section>
                                        <div class="text-h6 q-mb-md">{{$t('post.addToCollection')}}</div>
                                        <q-list bordered separator>
                                            <q-item clickable v-ripple>
                                                <q-item-section class="text-primary word-break" @click="newCollection">+ {{$t('post.newCollection')}}</q-item-section>
                                            </q-item>
                                            <q-item v-for="item in userCollections" :key="item.id" clickable v-ripple v-close-popup @click="addToCollection(item.id)">
                                                <q-item-section class="word-break">{{ item.title }}</q-item-section>
                                            </q-item>
                                        </q-list>
                                    </q-card-section>
                                </q-card>
                            </q-popup-proxy>
                        </q-btn>
                    </div>
                </div>
                <!-- post info and author info -->
                <div class="row q-mb-lg justify-between">
                    <div class="col-12 col-md">
                        <div class="q-mt-md text-subtitle1 post-infoLine row inline wrap items-center">
                            <div>
                                {{ $t('post.publishedOn.before') }} <span class="text-weight-medium gt-xs">{{ post.publishTimeStr }}</span><span class="text-weight-medium xs">{{ post.publishTimeStr ? post.publishTimeStr.substring(0, 10) : '' }}</span> {{ $t('post.publishedOn.after') }}
                            </div>
                            <div class="q-pl-md q-pl-sm-lg">
                                {{ $t('post.views.before') }} <span class="text-weight-medium">{{ post.views }}</span> {{ $t('post.views.after') }}
                            </div>
                        </div>
                        <div>
                            <q-chip class="text-weight-medium" clickable outline color="primary" @click="goToCategory">{{post.category ? $t('categories.'+post.category) : ''}}</q-chip>
                            <q-chip v-for="tag in post.tags" :key="tag.id" clickable color="primary" text-color="white" @click="goToTag(tag.name)">{{tag.name}}</q-chip>
                        </div>
                    </div>
                    <div class="col-12 col-md-auto q-pt-md q-pt-md-none text-subtitle1">
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
                                    <div class="col-auto q-my-auto" v-show="isLoggedIn">
                                        <q-btn flat :color="hoverUnfollow ? 'negative' : 'grey'" :label="hoverUnfollow ? $t('userAction.unfollow') : $t('userAction.following')" @mouseenter="hoverUnfollow = true" @mouseleave="hoverUnfollow = false" @click="followAuthor" v-if="post.isFollowing"></q-btn>
                                        <q-btn flat color="primary" :label="$t('userAction.follow')" @click="followAuthor" v-else></q-btn>
                                    </div>
                                </div>
                            </q-card-section>
                        </q-card>
                    </div>
                </div>
                <!-- post content -->
                <MarkDownItVue class="post-content q-pt-lg q-pb-md col-12 col-md-8" :content="post.content ? post.content : ''" :options="markdownItVueOptions"></MarkDownItVue>
                <!-- comments -->
                <div class="q-mt-xl">
                    <q-separator />
                    <div class="q-mt-lg row justify-between">
                        <div ref="comments">
                            <span class="text-h5">Comments</span>
                            <span class="q-ml-sm text-subtitle1 post-infoLine">{{commentCount === '' ? '' : '('+commentCount+')'}}</span>
                        </div>
                        <div>
                            <q-btn-dropdown icon="sort" flat color="primary" :label="$t('general.sortBy')">
                                <q-list>
                                    <q-item v-for="item in sortOptions" :key="item.value" clickable v-close-popup @click="changeSortBy(item.value)" :active="commentSortBy == item.value">
                                        <q-item-section>
                                            <q-item-label>{{ item.label }}</q-item-label>
                                        </q-item-section>
                                    </q-item>
                                </q-list>
                            </q-btn-dropdown>
                        </div>
                    </div>
                    <div class="q-my-md">
                        <div v-if="isLoggedIn">
                            <div class="row">
                                <div class="col">
                                    <q-input dense outlined autogrow v-model="newComment" maxlength="1000" label="Add Comment" />
                                </div>
                                <div class="col-auto q-px-sm">
                                    <q-btn color="primary" label="Post" @click="addComment" />
                                </div>
                            </div>
                        </div>
                        <div v-else>
                            <div class="post-infoLine text-italic text-center">{{$t('post.commentLogIn')}}</div>
                        </div>
                    </div>
                    <div class="q-mb-md">
                        <div v-for="comment in comments" :key="comment.id" class="q-mt-md commentBlock">
                            <q-separator class="q-my-md" />
                            <div class="row">
                                <div class="col">
                                    <span class="text-weight-medium commentUsername" @click="$router.push('/user/'+comment.userId)">
                                    {{comment.username}}
                                        <span v-show="comment.userIsAuthor == '1'">
                                            <q-badge rounded outline color="primary" class="q-mx-xs" v-if="comment.userId == post.authorUserId">
                                                <q-icon name="create" color="primary" />
                                                Author
                                            </q-badge>
                                            <q-badge rounded color="accent" class="q-mx-xs" v-else>
                                                <q-icon name="done" color="white" />
                                            </q-badge>
                                        </span>
                                    </span>
                                    <span class="q-ml-sm post-infoLine">{{formatTime(comment.publishTime)}}</span>
                                </div>
                                <div class="col-auto" v-if="isLoggedIn && user.id == comment.userId">
                                    <q-btn round dense flat size="sm" icon="more_vert" class="commentAction">
                                        <q-menu>
                                            <q-list style="min-width: 100px;">
                                                <q-item clickable v-close-popup @click="deleteComment(comment.id)">
                                                    <q-item-section>{{$t('post.deleteComment.btn')}}</q-item-section>
                                                </q-item>
                                            </q-list>
                                        </q-menu>
                                    </q-btn>
                                </div>
                            </div>
                            <div class="commentContent q-pl-md q-my-sm">{{comment.content}}</div>
                            <div class="commentStats text-dimmed q-mb-sm">
                                <span class="q-mr-sm statsActive" v-if="comment.userLiked" @click="likeComment(comment.id)">
                                    <q-icon name="thumb_up" />
                                    {{comment.likes}}
                                </span>
                                <span class="q-mr-sm statsInactive" v-else @click="likeComment(comment.id)">
                                    <q-icon name="thumb_up_off_alt" />
                                    {{comment.likes}}
                                </span>
                                <span class="statsActive" v-if="addReplyId == comment.id" @click="addReplyToggle(comment.id)">
                                    <q-icon name="chat_bubble" />
                                    {{comment.replies.length}}
                                </span>
                                <span class="statsInactive" v-else @click="addReplyToggle(comment.id)">
                                    <q-icon name="chat_bubble_outline" />
                                    {{comment.replies.length}}
                                </span>
                            </div>
                            <div v-if="addReplyId == comment.id" class="replyBlock">
                                <div class="row">
                                    <div class="col">
                                        <q-input dense outlined autogrow v-model="newReply" maxlength="1000" label="Reply" />
                                    </div>
                                    <div class="col-auto q-px-sm">
                                        <q-btn color="primary" label="Post" @click="addReply" />
                                    </div>
                                </div>
                            </div>
                            <div v-if="comment.replies.length > 0" class="q-mt-md">
                                <div v-for="childComment in comment.replies" :key="childComment.id" class="q-mt-md replyBlock">
                                    <div class="row">
                                        <div class="col">
                                            <span class="text-weight-medium commentUsername" @click="$router.push('/user/'+childComment.userId)">
                                            {{childComment.username}}
                                                <span v-show="childComment.userIsAuthor == '1'">
                                                    <q-badge rounded outline color="primary" class="q-mx-xs" v-if="childComment.userId == post.authorUserId">
                                                        <q-icon name="create" color="primary" />
                                                        Author
                                                    </q-badge>
                                                    <q-badge rounded color="accent" class="q-mx-xs" v-else>
                                                        <q-icon name="done" color="white" />
                                                    </q-badge>
                                                </span>
                                            </span>
                                            <span class="q-ml-sm post-infoLine">{{formatTime(childComment.publishTime)}}</span>
                                        </div>
                                        <div class="col-auto" v-if="isLoggedIn && user.id == childComment.userId">
                                            <q-btn round dense flat size="sm" icon="more_vert" class="replyAction">
                                                <q-menu>
                                                    <q-list style="min-width: 100px;">
                                                        <q-item clickable dense v-close-popup @click="deleteComment(childComment.id)">
                                                            <q-item-section>{{$t('post.deleteComment.btn')}}</q-item-section>
                                                        </q-item>
                                                    </q-list>
                                                </q-menu>
                                            </q-btn>
                                        </div>
                                    </div>
                                    <div class="commentContent q-pl-md q-my-sm">{{childComment.content}}</div>
                                    <div class="commentStats text-dimmed q-mb-sm">
                                        <span class="q-mr-sm statsActive" v-if="childComment.userLiked" @click="likeComment(childComment.id)">
                                            <q-icon name="thumb_up" />
                                            {{childComment.likes}}
                                        </span>
                                        <span class="q-mr-sm statsInactive" v-else @click="likeComment(childComment.id)">
                                            <q-icon name="thumb_up_off_alt" />
                                            {{childComment.likes}}
                                        </span>
                                        <!-- todo: reply to child comments -->
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-else>
            <loading-message />
        </div>
    </q-page>
</template>

<script>
import MarkDownItVue from 'markdown-it-vue'
import 'markdown-it-vue/dist/markdown-it-vue.css'
import markdownItVueOptions from '../markdownItVueOptions'
import api from '../api'
import { mapState } from 'vuex'
import { formatTimeElapsed } from '../util'
import { scroll } from 'quasar'
import LoadingMessage from 'src/components/LoadingMessage.vue'
import { apiError } from 'src/apiError'
const { getScrollTarget, setScrollPosition } = scroll
export default {
    name: 'Post',
    components: {
        MarkDownItVue,
        LoadingMessage
    },
    data() {
        return {
            loaded: false,
            markdownItVueOptions: markdownItVueOptions,
            post: {},
            comments: [],
            postNotFound: false,
            hoverUnfollow: false,
            newComment: '',
            sortOptions: [
                {label: this.$t('general.sort.timeDesc'), value: 'timeDesc'},
                {label: this.$t('general.sort.likesDesc'), value: 'likesDesc'}
            ],
            commentSortBy: 'timeDesc', //todo comment sort
            addReplyId: 0,
            newReply: '',
            userCollections: []
        }
    },
    computed: {
        postId() {
            return this.$route.params.id
        },
        commentCount() {
            return this.post.comments ? this.post.comments.length : ''
        },
        ...mapState(['isLoggedIn', 'user'])
    },
    methods: {
        addToCollection(cid) {
            api.put('/collections/'+cid+'/posts', {
                postId: this.postId
            }).catch(err => {
                apiError()
            }).then(res => {
                let r = res.data
                if (r.success) {
                    this.$q.notify({
                        color: 'positive',
                        message: this.$t('post.addedToCollection'),
                        position: 'top',
                        timeout: 2000
                    })
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
        },
        newCollection() {
            //!!! mostly in sync with newCollection in Collections.vue
            this.$q.dialog({
                title: this.$t('collections.newCollection'),
                prompt: {
                    model: '',
                    label: this.$t('collections.newCollectionDialog.name'),
                    isValid: val => val.length > 0 && val.length <= 50,
                    type: 'text'
                },
                cancel: true,
                persistent: true
            }).onOk(val => {
                console.log(val)
                api.post('/collections', {
                    title: val
                }).catch(err => {
                    apiError()
                }).then(res => {
                    let r = res.data
                    if (r.success) {
                        this.loadUserCollections()
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
        loadUserCollections() {
            api.get('/collections/mine').catch(err => {
                apiError()
            }).then(res => {
                let r = res.data
                if (r.success) {
                    this.userCollections = r.collections
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
        },
        changeSortBy(val) {
            this.commentSortBy = val
            this.comments = this.sortComments(this.comments)
        },
        addReplyToggle(id) {
            if (!this.isLoggedIn) return;
            this.newReply = ''
            this.addReplyId = this.addReplyId == 0 ? id : 0
        },
        deleteComment(id) {
            this.$q.dialog({
                title: this.$t('post.deleteComment.title'),
                message: this.$t('post.deleteComment.msg'),
                persistent: true,
                cancel: true
            }).onOk(() => {
                api.delete('/comments/'+id).catch(err => {
                    apiError()
                }).then(res => {
                    let r = res.data
                    if (r.success) {
                        this.$q.notify({
                            color: 'positive',
                            message: this.$t('post.deleteComment.success'),
                            position: 'top',
                            timeout: 2000
                        })
                        this.getPost()
                    }
                    else {
                        console.log(r)
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
        likeComment(id) {
            api.post('/comments/'+id+'/like').catch(err => {
                apiError()
            }).then(res => {
                let r = res.data
                if (r.success) {
                    for (let i of this.comments) {
                        if (i.id == id) {
                            i.likes = i.likes + r.delta
                            i.userLiked = !i.userLiked
                            break
                        }
                        for (let j of i.replies) {
                            if (j.id == id) {
                                j.likes = j.likes + r.delta
                                j.userLiked = !j.userLiked
                                break
                            }
                        }
                    }
                }
                else {
                    console.log(r)
                    this.$q.notify({
                        color: 'negative',
                        message: r.msg,
                        position: 'top',
                        timeout: 2000
                    })
                }
            })
        },
        parseComments() {
            let comments = []
            let childComments = []
            for (let i of this.post.comments) {
                i.userLiked = this.post.likedComments && this.post.likedComments.includes(i.id)
                for (let tmp of ['id', 'parentId', 'likes', 'publishTime']) {
                    i[tmp] = parseInt(i[tmp])
                }
                if (i.parentId == 0) { //no parent comment
                    i.replies = []
                    comments.push(i)
                }
                else {
                    childComments.push(i)
                }
            }
            for (let i of childComments) {
                let parentIndex = comments.findIndex(v => v.id == i.parentId);
                if (parentIndex == -1) {
                    console.error("Parent id is not found!")
                }
                else {
                    comments[parentIndex].replies.push(i)
                }
            }
            this.comments = this.sortComments(comments)
        },
        sortComments(cm) {
            if (this.commentSortBy == 'timeDesc') {
                cm = cm.sort((a,b) => {
                    if (a.publishTime < b.publishTime) return 1;
                    else if (a.publishTime == b.publishTime) return 0;
                    else return -1;
                })
                for (let i in cm) {
                    cm[i].replies = cm[i].replies.sort((a,b) => {
                        if (a.publishTime < b.publishTime) return 1;
                        else if (a.publishTime == b.publishTime) return 0;
                        else return -1;
                    })
                }
                return cm
            }
            else if (this.commentSortBy == 'likesDesc') {
                cm = cm.sort((a,b) => {
                    if (a.likes < b.likes) return 1;
                    else if (a.likes == b.likes) return 0;
                    else return -1;
                })
                for (let i in cm) {
                    cm[i].replies = cm[i].replies.sort((a,b) => {
                        if (a.likes < b.likes) return 1;
                        else if (a.likes == b.likes) return 0;
                        else return -1;
                    })
                }
                return cm
            }
        },
        formatTime(tm) {
            return formatTimeElapsed(tm)
        },
        getPost() {
            api.get('/posts/'+this.postId).catch(err => {
                apiError()
            }).then(res => {
                this.setData(res.data)
            })
        },
        addReply() {
            if (this.addReplyId == 0) {
                return;
            }
            if (this.newReply == '') {
                this.$q.notify({ color: 'warning', message: this.$t('post.emptyCommentMsg'), position: 'top', timeout: 2000 });
            }
            else {
                api.post('/comments', {
                    postId: this.postId,
                    content: this.newReply,
                    parentId: this.addReplyId
                }).catch(err => {
                    apiError()
                }).then(res => {
                    let r = res.data
                    console.log(r)
                    if (r.success) {
                        this.$q.notify({ color: 'positive', message: this.$t('post.commentSuccess'), position: 'top', timeout: 2000 });
                        this.newReply = ''
                        this.addReplyId = 0
                        this.getPost()
                    }
                    else {
                        this.$q.notify({ color: 'negative', message: r.msg, position: 'top', timeout: 2000 });
                    }
                })
            }
        },
        addComment() {
            if (this.newComment == '') {
                this.$q.notify({ color: 'warning', message: this.$t('post.emptyCommentMsg'), position: 'top', timeout: 2000 });
            }
            else {
                api.post('/comments', {
                    postId: this.postId,
                    content: this.newComment
                }).catch(err => {
                    apiError()
                }).then(res => {
                    let r = res.data
                    console.log(r)
                    if (r.success) {
                        this.$q.notify({ color: 'positive', message: this.$t('post.commentSuccess'), position: 'top', timeout: 2000 });
                        this.newComment = ''
                        this.getPost()
                    }
                    else this.$q.notify({ color: 'negative', message: r.msg, position: 'top', timeout: 2000 });
                })
            }
        },
        goToCategory() {
            if (this.post.category) {
                this.$router.push('/category/'+this.post.category)
            }
        },
        goToTag(tagName) {
            this.$router.push('/tag/'+tagName)
        },
        followAuthor() {
            api.post('/authors/'+this.post.authorId+'/follow').catch(err => {
                apiError()
            }).then(res => {
                let r = res.data
                console.log(r)
                if (r.success) {
                    this.post.followerCount = parseInt(this.post.followerCount) + parseInt(r.delta)
                    this.post.isFollowing = !this.post.isFollowing
                }
                else {
                    this.$q.notify({ color: 'negative', message: r.msg, position: 'top', timeout: 2000 });
                }
            })
        },
        setData(r) {
            if (r.success) {
                console.log(r.post)
                if (r.post.likedComments) {
                    r.post.likedComments = r.post.likedComments.map(v => v.id)
                }
                else {
                    r.post.likedComments = []
                }
                this.post = r.post
                this.$store.commit('setBarTitle', r.post.title)
                
                this.parseComments()
            }
            else {
                if (r.errorType && r.errorType == 'NotFound') {
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
        }
    },
    mounted() {
        //scroll to comments
        /*
        if (this.$route.hash) {
            let hash = this.$route.hash.substring(1)
            if (this.$refs[hash]) {
                let target = getScrollTarget(this.$refs[hash])
                let offset = this.$refs[hash].offsetTop
                let duration = 200
                setScrollPosition(target, offset, duration)
            }
        }
        */
    },
    created() { //v0.2: using created() to load content after route for better user experience
        api.get('/posts/' + this.$route.params.id).catch(err => {
            apiError()
        }).then(res => {
            this.setData(res.data)
            this.loaded = true
        })
    }
}
</script>

<style scoped lang="scss">
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
.commentStats {
    font-size: 16px;
}
.commentUsername, .commentStats {
    cursor: pointer;
    transition: color 300ms;
}
.commentUsername:hover, .commentStats .statsInactive:hover, .commentStats .statsActive {
    color: $primary;
}
.commentUsername, .commentContent {
    font-size: 16px;
}
.replyBlock {
    margin-left: 4rem;
}
.commentBlock .commentAction, .replyBlock .replyAction {
    display: none;
}
.commentBlock:hover .commentAction, .replyBlock:hover .replyAction {
    display: block;
}
body.screen--xs {
    .commentAction, .replyAction {
        display: block !important;
    }
}
</style>