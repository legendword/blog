<template>
    <div>
        <div class="q-mb-md">
            <q-card v-for="comment in comments" :key="comment.id" class="q-ma-md">
                <q-card-section class="row bg-shade-light text-primary">
                    <!-- todo: avatar -->
                    <div class="col-12 col-sm-8 text-weight-medium">
                        <router-link :to="`/user/${comment.userId}`" class="link-text text-primary">{{ comment.username }}</router-link>
                    </div>
                    <div class="col-12 col-sm-4 text-right">{{ comment.publishTimeStr }}</div>
                </q-card-section>
                <q-card-section class="text-body2">
                    {{ comment.content }}
                </q-card-section>
                <q-card-section class="q-pt-xs">
                    <router-link :to="`/post/${comment.postId}`" class="link-text text-grey">{{ comment.postTitle }}</router-link>
                </q-card-section>
            </q-card>
        </div>
        <div class="flex flex-center q-mt-md" v-show="maxPages != 0">
            <q-pagination v-model="page" :max="maxPages" direction-links />
        </div>
    </div>
</template>

<script>
import api from 'src/api'
import { apiError } from 'src/apiError'
import logger from 'src/logger'
export default {
    name: 'CreatorCommentList',
    data() {
        return {
            comments: [],
            page: 1,
            maxPages: 0
        }
    },
    watch: {
        page() {
            this.loadComments()
        }
    },
    methods: {
        loadComments() {
            api.get('/comments/author', {
                page: this.page,
            }).catch(err => {
                apiError()
            }).then(res => {
                let r = res.data
                logger(r)
                if (r.success) {
                    this.comments = r.comments
                    if (r.commentCount) {
                        let commentCount = parseInt(r.commentCount)
                        this.maxPages = Math.floor(commentCount / 10) + (commentCount % 10 == 0 ? 0 : 1)
                    }
                }
                else {
                    this.$q.notify({
                        color: 'negative',
                        message: r.msg
                    })
                }
            })
        }
    },
    created() {
        this.loadComments()
    }
}
</script>

<style>

</style>