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
            </div>
            <MarkDownItVue class="post-content q-py-md col-12 col-md-8" :content="post.content ? post.content : ''" :options="markdownItVueOptions"></MarkDownItVue>
            <div class="q-mt-xl">
                <q-separator />
                <div class="q-mt-lg row justify-between">
                    <div>
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
                        <div class="post-infoLine text-italic text-center">Log in to add a comment</div>
                    </div>
                </div>
                <div>
                    <div v-for="comment in comments" :key="comment.id" class="q-mt-md">
                        <q-separator class="q-my-md" />
                        <div>
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
                                <div>
                                    <span class="text-weight-medium commentUsername" @click="$router.push('/user/'+childComment.userId)">
                                        {{childComment.username}}
                                        <q-badge rounded color="accent" class="q-ml-xs" v-show="childComment.userIsAuthor == '1'">
                                            <q-icon name="done" color="white" />
                                        </q-badge>
                                    </span>
                                    <span class="q-ml-sm post-infoLine">{{formatTime(childComment.publishTime)}}</span>
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
    </q-page>
</template>

<script>
import MarkDownItVue from 'markdown-it-vue'
import 'markdown-it-vue/dist/markdown-it-vue.css'
import markdownItVueOptions from '../markdownItVueOptions'
import api from '../api'
import { mapState } from 'vuex'
import { formatTimeElapsed } from '../util'
export default {
    name: 'Post',
    components: {
        MarkDownItVue
    },
    data() {
        return {
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
            newReply: ''
        }
    },
    computed: {
        commentCount() {
            return this.post.comments ? this.post.comments.length : ''
        },
        ...mapState(['isLoggedIn', 'user'])
    },
    methods: {
        changeSortBy(val) {
            this.commentSortBy = val
            this.comments = this.sortComments(this.comments)
        },
        addReplyToggle(id) {
            if (!this.isLoggedIn) return;
            this.newReply = ''
            this.addReplyId = this.addReplyId == 0 ? id : 0
        },
        likeComment(id) {
            api('performaction', {
                type: 'likeComment',
                to: id
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
            api('getpost', {
                id: this.$route.params.id
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
                api('newcomment', {
                    postId: this.$route.params.id,
                    content: this.newReply,
                    parentId: this.addReplyId
                }).then(res => {
                    let r = res.data
                    console.log(r)
                    if (r.error) {
                        this.$q.notify({ color: 'negative', message: r.msg, position: 'top', timeout: 2000 });
                    }
                    else if (r.success) {
                        this.$q.notify({ color: 'positive', message: this.$t('post.commentSuccess'), position: 'top', timeout: 2000 });
                        this.newReply = ''
                        this.addReplyId = 0
                        this.getPost()
                    }
                })
            }
        },
        addComment() {
            if (this.newComment == '') {
                this.$q.notify({ color: 'warning', message: this.$t('post.emptyCommentMsg'), position: 'top', timeout: 2000 });
            }
            else {
                api('newcomment', {
                    postId: this.$route.params.id,
                    content: this.newComment
                }).then(res => {
                    let r = res.data
                    console.log(r)
                    if (r.error) {
                        this.$q.notify({ color: 'negative', message: r.msg, position: 'top', timeout: 2000 });
                    }
                    else if (r.success) {
                        this.$q.notify({ color: 'positive', message: this.$t('post.commentSuccess'), position: 'top', timeout: 2000 });
                        this.newComment = ''
                        this.getPost()
                    }
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
                r.post.likedComments = r.post.likedComments.map(v => v.id)
                this.post = r.post
                this.$store.commit('setBarTitle', r.post.title)
                
                this.parseComments()
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
</style>