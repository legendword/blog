<template>
    <q-page>
        <need-to-log-in v-if="!isLoggedIn" />
        <div v-else class="q-pa-lg">
            <h4 class="q-mb-lg">{{ $t("followingPage.newPosts") }}</h4>
            <div class="row q-col-gutter-md">
                <q-intersection class="col-12 wideCard" v-for="item in postList" :key="item.postId">
                    <post-card :post="item"></post-card>
                </q-intersection>
            </div>
            <div class="flex flex-center q-mt-md" v-show="postList.length > 0">
                <q-pagination v-model="postPage" color="primary" :max="maxPages" :max-pages="6" :boundary-numbers="true" @input="changePage"></q-pagination>
            </div>
        </div>
    </q-page>
</template>

<script>
import api from "../api";
import PostCard from "../components/PostCard.vue";
import { apiError } from "src/apiError";
import requireLoggedIn from "src/mixins/requireLoggedIn";

export default {
    name: "Following",
    meta: {
        title: "Feed"
    },
    components: {
        PostCard
    },
    mixins: [requireLoggedIn],
    data() {
        return {
            postList: [],
            postCount: 0,
            postPage: 1,
            postPerPage: 10
        };
    },
    computed: {
        maxPages () {
            return Math.floor(this.postCount / this.postPerPage) + (this.postCount % this.postPerPage == 0 ? 0 : 1);
        }
    },
    methods: {
        changePage() {
            this.getPosts();
        },
        getPosts() {
            api.get("/posts/following", {
                page: this.postPage
            }).catch(err => {
                apiError();
            }).then(res => {
                let r = res.data;
                if (r.success) {
                    this.postList = r.posts;
                    if (this.postPage == 1) {
                        this.postCount = parseInt(r.postCount);
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
            });
        },
        init() {
            this.getPosts();
        }
    },
    created() {
        if (this.isLoggedIn) {
            this.getPosts();
        }
    }
};
</script>

<style>

</style>