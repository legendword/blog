<template>
    <div>
        <div class="q-mt-lg row justify-between">
            <div>
                <span class="text-h5">Comments</span>
                <span class="q-ml-sm text-subtitle1 post-infoLine">{{commentCount ? '('+commentCount+')' : ''}}</span>
            </div>
            <div>
                <dropdown-select v-model="sortBy" :options="sortOptions" icon="sort" :label="$t('general.sortBy')" />
            </div>
        </div>
        <div class="q-my-md">
            <div v-if="isLoggedIn">
                <div class="row">
                    <div class="col">
                        <q-input dense outlined autogrow v-model="newComment" maxlength="1000" label="Add Comment" />
                    </div>
                    <div class="col-auto q-px-sm">
                        <q-btn color="primary" label="Post" @click="submit" />
                    </div>
                </div>
            </div>
            <div v-else>
                <div class="post-infoLine text-italic text-center">{{$t('post.commentLogIn')}}</div>
            </div>
        </div>
        <div class="q-mb-md">
            <comment v-for="comment in list" :key="comment.id" :comment="comment" :authorUserId="authorUserId" :postId="postId" @update="updateList" />
        </div>
    </div>
</template>

<script>
import { apiError } from 'src/apiError'
import DropdownSelect from '../DropdownSelect.vue'
import Comment from './Comment.vue'
import api from 'src/api'
import { mapState } from 'vuex'
export default {
    components: {
        DropdownSelect,
        Comment
    },
    props: {
        comments: Array,
        likedComments: Array,
        postId: Number,
        authorUserId: Number,
    },
    data() {
        return {
            list: [],
            sortBy: 'timeDesc',
            sortOptions: [
                {label: this.$t('general.sort.timeDesc'), value: 'timeDesc'},
                {label: this.$t('general.sort.likesDesc'), value: 'likesDesc'}
            ],
            newComment: ''
        }
    },
    watch: {
        sortBy() {
            this.list = this.sort(this.list)
        },
        comments() {
            this.parse()
        }
    },
    computed: {
        commentCount() {
            return this.list.length ?? null
        },
        ...mapState(['isLoggedIn', 'user'])
    },
    created() {
        this.parse()
    },
    methods: {
        updateList() {
            this.$emit('update')
        },
        submit() {
            if (this.newComment == '') {
                this.$q.notify({ color: 'warning', message: this.$t('post.emptyCommentMsg') });
                return;
            }
            api.post('/comments', {
                postId: this.postId,
                content: this.newComment
            }).catch(err => {
                apiError()
            }).then(res => {
                let r = res.data
                console.log(r)
                if (r.success) {
                    this.$q.notify({ color: 'positive', message: this.$t('post.commentSuccess') });
                    this.newComment = ''
                    this.updateList()
                    // #todo: don't update everything
                }
                else this.$q.notify({ color: 'negative', message: r.msg });
            })
        },
        parse() {
            let comments = []
            let childComments = []
            for (let i of this.comments) {
                i.userLiked = this.likedComments && this.likedComments.includes(i.id)
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
            console.log(comments)
            this.list = this.sort(comments)
        },
        sort(cm) {
            if (this.sortBy == 'timeDesc') {
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
            else if (this.sortBy == 'likesDesc') {
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
        }
    }
}
</script>

<style>

</style>