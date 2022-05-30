<template>
    <q-page class="q-pa-md q-pa-sm-lg">
        <h4 class="q-mb-lg">{{$t("category.title")}}: {{ $te("categories."+$route.params.name) ? $t("categories."+$route.params.name) : $route.params.name }}</h4>
        <div class="row justify-between q-mb-md">
            <div class="text-h5">{{$t("general.posts")}}</div>
            <div>
                <q-btn-dropdown flat icon="sort" color="primary" :label="$t('general.sortBy')">
                    <q-list>
                        <q-item v-for="item in sortOptions" :key="item.value" clickable v-close-popup @click="changeSortBy(item.value)" :active="sortBy == item.value">
                            <q-item-section>
                                <q-item-label>{{ item.label }}</q-item-label>
                            </q-item-section>
                        </q-item>
                    </q-list>
                </q-btn-dropdown>
            </div>
        </div>
        <div class="row q-col-gutter-md">
            <q-intersection class="col-12 wideCard" v-for="item in postList" :key="item.postId">
                <post-card :post="item"></post-card>
            </q-intersection>
        </div>
        <div class="flex flex-center q-mt-md" v-show="postList.length > 0">
            <q-pagination v-model="postPage" color="primary" :max="maxPages" :max-pages="6" :boundary-numbers="true" @input="changePage"></q-pagination>
        </div>
    </q-page>
</template>

<script>
import { apiError } from "src/apiError";
import api from "../api";
import PostCard from "../components/PostCard";
import logger from "src/logger";
export default {
    name: "Category",
    components: {
        PostCard
    },
    meta() {
        return {
            title: `Category: ${this.$te("categories."+this.$route.params.name) ? this.$t("categories."+this.$route.params.name) : this.$route.params.name}`
        };
    },
    data() {
        return {
            categoryNotFound: false,
            sortBy: "timeDesc",
            sortOptions: [
                {label: this.$t("general.sort.timeDesc"), value: "timeDesc"},
                {label: this.$t("general.sort.timeAsc"), value: "timeAsc"},
                {label: this.$t("general.sort.viewsDesc"), value: "viewsDesc"}
            ],
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
        changePage(val) {
            this.getPosts();
        },
        changeSortBy(value) {
            this.sortBy = value;
            this.getPosts();
        },
        getPosts() {
            api.get("/posts/category/"+encodeURIComponent(this.$route.params.name), {
                sort: this.sortBy,
                page: this.postPage
            }).catch(err => {
                apiError();
            }).then(res => {
                let r = res.data;
                if (r.success) {
                    this.postList = r.posts;
                    if (this.postPage == 1) {
                        logger(r);
                        this.postCount = parseInt(r.postCount);
                    }
                }
                else {
                    if (r.errorType && r.errorType == "NotFound") {
                        this.$router.push("/404");
                    }
                    else {
                        this.$q.notify({color: "negative", message: r.msg, position: "top", timeout: 2000});
                    }
                }
            });
        }
    },
    mounted() {
        this.getPosts();
    }
};
</script>

<style>

</style>