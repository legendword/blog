<template>
    <transition name="fade">
        <q-table
            v-if="initialLoaded"
            :data="posts"
            :columns="columns"
            :loading="loading"
            :pagination.sync="pagination"
            @request="onRequest"
            :rows-per-page-options="[5, 10, 20]"
            class="creater-post-table"
        >
            <template v-slot:body-cell-title="props">
                <q-td :props="props">
                    <router-link :to="'/post/'+props.row.postId" class="link-text">{{ props.value }}</router-link>
                </q-td>
            </template>
            <template v-slot:body-cell-actions="props">
                <q-td :props="props">
                    <q-btn flat round icon="more_vert">
                        <q-menu>
                            <q-list style="min-width: 100px;">
                                <q-item clickable v-close-popup @click="deletePost(props.row)" class="text-negative">
                                    <q-item-section>Delete</q-item-section>
                                </q-item>
                            </q-list>
                        </q-menu>
                    </q-btn>
                </q-td>
            </template>
        </q-table>
    </transition>
</template>

<script>
import PostDelete from '../dialogs/PostDelete.vue'
import { apiError } from 'src/apiError'
import api from 'src/api'
import logger from 'src/logger'
export default {
    name: 'CreatorPostList',
    components: { PostDelete },
    props: {
        author: Object
    },
    data() {
        return {
            posts: [],
            columns: [
                { name: 'title', label: 'Title', field: 'title', align: 'left', style: 'font-weight: 500;' },
                { name: 'publishTime', label: 'Date', field: 'publishTimeStr', align: 'left' },
                { name: 'views', label: 'Views', field: 'views', align: 'right' },
                { name: 'actions', label: 'Actions', align: 'left', style: 'width: 100px;' }
            ],
            pagination: {
                page: 1,
                rowsPerPage: 10,
                rowsNumber: 10
            },
            loading: true,
            initialLoaded: false
        }
    },
    methods: {
        deletePost(post) {
            logger(post)
            this.$q.dialog({
                component: PostDelete,
                parent: this,
                post: post
            }).onOk(() => {
                this.onRequest({
                    pagination: this.pagination
                })
            })
        },
        onRequest(props, initial = false) {
            const { page, rowsPerPage } = props.pagination
            this.loading = true

            api.get('/posts/author/'+this.author.id, {
                page: page,
                count: rowsPerPage
            }).catch(err => {
                apiError()
            }).then(res => {
                let r = res.data
                logger(r)
                if (r.success) {
                    this.posts = r.posts
                    if (r.postCount) {
                        this.pagination.rowsNumber = parseInt(r.postCount)
                    }

                    this.pagination.page = page
                    this.pagination.rowsPerPage = rowsPerPage

                    if (initial) {
                        this.initialLoaded = true
                    }
                }
                else {
                    this.$q.notify({
                        color: 'negative',
                        message: r.msg
                    })
                }
                this.loading = false
            })
        }
    },
    created() {
        this.onRequest({
            pagination: this.pagination
        }, true)
    }
}
</script>

<style lang="scss">
.creater-post-table {
    tbody tr {
        height: 60px;
    }
}
</style>