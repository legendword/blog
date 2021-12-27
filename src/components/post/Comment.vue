<template>
    <div class="q-mt-md commentBlock">
        <q-separator class="q-my-md" />
        <div class="row">
            <div class="col">
                <span class="text-weight-medium commentUsername" @click="$router.push('/user/'+comment.userId)">
                {{comment.username}}
                    <span v-show="comment.userIsAuthor == '1'">
                        <q-badge rounded outline color="primary" class="q-mx-xs" v-if="comment.userId == authorUserId">
                            <q-icon name="create" color="primary" />
                            Author
                        </q-badge>
                        <q-badge rounded color="accent" class="q-mx-xs" v-else>
                            <q-icon name="done" color="white" />
                        </q-badge>
                    </span>
                </span>
                <span class="q-ml-sm post-infoLine">{{timeElapsed}}</span>
            </div>
            <div class="col-auto" v-if="isLoggedIn && user.id == comment.userId">
                <q-btn round dense flat size="sm" icon="more_vert" class="commentAction">
                    <q-menu>
                        <q-list style="min-width: 100px;">
                            <q-item clickable v-close-popup @click="deleteComment">
                                <q-item-section>{{$t('post.deleteComment.btn')}}</q-item-section>
                            </q-item>
                        </q-list>
                    </q-menu>
                </q-btn>
            </div>
        </div>
        <div class="commentContent q-my-sm">{{comment.content}}</div>
        <div class="commentStats text-dimmed q-mb-sm">
            <span class="q-mr-sm statsActive" v-if="comment.userLiked" @click="likeComment">
                <q-icon name="thumb_up" />
                {{comment.likes}}
            </span>
            <span class="q-mr-sm statsInactive" v-else @click="likeComment">
                <q-icon name="thumb_up_off_alt" />
                {{comment.likes}}
            </span>
            <template v-if="!isReply">
                <span class="statsActive" v-if="isReplying" @click="isReplying = false">
                    <q-icon name="chat_bubble" />
                    {{comment.replies.length}}
                </span>
                <span class="statsInactive" v-else @click="isReplying = true">
                    <q-icon name="chat_bubble_outline" />
                    {{comment.replies.length}}
                </span>
            </template>
        </div>
        <div v-if="isReplying" class="replyBlock">
            <div class="row">
                <div class="col">
                    <q-input dense outlined autogrow v-model="newReply" maxlength="1000" label="Reply" />
                </div>
                <div class="col-auto q-px-sm">
                    <q-btn color="primary" label="Post" @click="submitReply" />
                </div>
            </div>
        </div>
        <div v-if="comment.replies && comment.replies.length > 0" class="q-mt-md">
            <comment v-for="childComment in comment.replies" :key="childComment.id" :comment="childComment" isReply :authorUserId="authorUserId" :postId="postId" @update="$emit('update')" class="q-mt-md replyBlock" />
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import { formatTimeElapsed } from 'src/util'
import { apiError } from 'src/apiError'
import api from 'src/api'
import logger from 'src/logger'
export default {
    name: 'comment',
    props: {
        isReply: Boolean,
        comment: Object,
        authorUserId: Number,
        postId: Number
    },
    computed: {
        timeElapsed() {
            return formatTimeElapsed(this.comment.publishTime)
        },
        ...mapState(['isLoggedIn', 'user'])
    },
    data() {
        return {
            newReply: '',
            isReplying: false
        }
    },
    methods: {
        submitReply() {
            if (!this.isReplying) {
                return;
            }
            if (this.newReply == '') {
                this.$q.notify({ color: 'warning', message: this.$t('post.emptyCommentMsg') })
                return
            }
            api.post('/comments', {
                postId: this.postId,
                content: this.newReply,
                parentId: this.comment.id
            }).catch(err => {
                apiError()
            }).then(res => {
                let r = res.data
                logger(r)
                if (r.success) {
                    this.$q.notify({ color: 'positive', message: this.$t('post.commentSuccess') });
                    this.newReply = ''
                    this.isReplying = false

                    this.$emit('update')
                    // #todo: instead of re-fetching the entire comment section, just append to this.comment.replies
                }
                else {
                    this.$q.notify({ color: 'negative', message: r.msg });
                }
            })
        },
        likeComment() {
            api.post('/comments/'+this.comment.id+'/like').catch(err => {
                apiError()
            }).then(res => {
                let r = res.data
                if (r.success) {
                    this.comment.likes += r.delta
                    this.comment.userLiked = !this.comment.userLiked
                }
                else {
                    logger(r)
                    this.$q.notify({
                        color: 'negative',
                        message: r.msg,
                    })
                }
            })
        },
        deleteComment() {
            this.$q.dialog({
                title: this.$t('post.deleteComment.title'),
                message: this.$t('post.deleteComment.msg'),
                persistent: true,
                cancel: true
            }).onOk(() => {
                api.delete('/comments/'+this.comment.id).catch(err => {
                    apiError()
                }).then(res => {
                    let r = res.data
                    if (r.success) {
                        this.$q.notify({
                            color: 'positive',
                            message: this.$t('post.deleteComment.success'),
                        })
                        this.$emit('update')
                    }
                    else {
                        logger(r)
                        this.$q.notify({
                            color: 'negative',
                            message: r.msg,
                        })
                    }
                })
            })
        }
    }
}
</script>

<style lang="scss">
.commentBlock .commentAction, .replyBlock .replyAction {
    display: none;
}
.commentBlock:hover .commentAction, .replyBlock:hover .replyAction {
    display: block;
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