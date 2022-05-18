<template>
    <q-page class="q-pa-md q-pa-sm-lg">
        <search-bar in-search-page :initial-query="searchquery" @search="newSearch"></search-bar>
        <div class="q-my-md text-h5 text-weight-regular">{{ $t("search.searchResultFor") }} <span class="text-weight-bold">{{ actualQuery }}</span></div>
        <q-tabs v-model="tab" align="left" no-caps class="bg-secondary text-white shadow-2">
            <q-tab name="posts" :label="$t('general.posts')" />
            <q-tab name="collections" :label="$t('general.collections')" />
            <q-tab name="authors" :label="$t('general.authors')" />
            <q-tab name="users" :label="$t('general.users')" />
        </q-tabs>
        <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="posts" class="q-px-none">
                <div v-if="isLoading" class="row justify-center q-my-md">
                    <q-circular-progress indeterminate size="50px" color="primary" class="col-auto" />
                </div>
                <div v-else>
                    <div v-if="resultList.posts.length">
                        <q-list bordered separator>
                            <PostListItem v-for="item in resultList.posts" :key="item.postId" :post="item"></PostListItem>
                        </q-list>
                        <div class="flex flex-center q-mt-md">
                            <q-pagination v-model="pagination.posts.page" color="primary" :max="pagination.posts.maxPages" :max-pages="6" :boundary-numbers="true" @input="changePage"></q-pagination>
                        </div>
                    </div>
                    <div class="text-h6 q-pl-md" v-else>
                        {{ $t("search.noResultsFound") }}
                    </div>
                </div>
            </q-tab-panel>
            <q-tab-panel name="collections" class="q-px-none">
                <div v-if="isLoading" class="row justify-center q-my-md">
                    <q-circular-progress indeterminate size="50px" color="primary" class="col-auto" />
                </div>
                <div v-else>
                    <q-list bordered separator v-if="resultList.collections.length">
                        <CollectionListItem v-for="item in resultList.collections" :key="item.id" :collection="item" showUser></CollectionListItem>
                    </q-list>
                    <div class="text-h6 q-pl-md" v-else>
                        {{ $t("search.noResultsFound") }}
                    </div>
                </div>
            </q-tab-panel>
            <q-tab-panel name="authors" class="q-px-none">
                <div v-if="isLoading" class="row justify-center q-my-md">
                    <q-circular-progress indeterminate size="50px" color="primary" class="col-auto" />
                </div>
                <div v-else>
                    <div v-if="resultList.authors.length">
                        <AuthorCard v-for="item in resultList.authors" :key="item.id" :author="item"></AuthorCard>
                    </div>
                    <div class="text-h6 q-pl-md" v-else>
                        {{ $t("search.noResultsFound") }}
                    </div>
                </div>
            </q-tab-panel>
            <q-tab-panel name="users" class="q-px-none">
                <div v-if="isLoading" class="row justify-center q-my-md">
                    <q-circular-progress indeterminate size="50px" color="primary" class="col-auto" />
                </div>
                <div v-else>
                    <div v-if="resultList.users.length">
                        <UserCard v-for="item in resultList.users" :key="item.id" :user="item"></UserCard>
                    </div>
                    <div class="text-h6 q-pl-md" v-else>
                        {{ $t("search.noResultsFound") }}
                    </div>
                </div>
            </q-tab-panel>
        </q-tab-panels>
    </q-page>
</template>

<script>
import PostListItem from "../components/PostListItem.vue";
import api from "../api";
import SearchBar from "../components/SearchBar.vue";
import AuthorCard from "../components/AuthorCard.vue";
import UserCard from "../components/UserCard.vue";
import CollectionListItem from "../components/CollectionListItem.vue";
import { apiError } from "src/apiError";
import logger from "src/logger";
export default {
    name: "Search",
    meta: {
        title: "Search"
    },
    components: {
        SearchBar,
        PostListItem,
        AuthorCard,
        UserCard,
        CollectionListItem
    },
    data() {
        return {
            actualQuery: "",
            tab: "posts",
            resultList: {
                posts: [],
                authors: [],
                users: [],
                collections: []
            },
            pagination: {
                posts: { page: 1, maxPages: 0 },
                authors: { page: 1, maxPages: 0 },
                users: { page: 1, maxPages: 0 },
                collections: { page: 1, maxPages: 0 }
            },
            resultPerPage: 10,
            isLoading: false
        };
    },
    computed: {
        searchquery () {
            return this.$route.query.s;
        }
    },
    watch: {
        tab: function () {
            this.$router.replace("/search/"+this.tab+this.$route.fullPath.substring(this.$route.path.length));
            this.newSearch(this.actualQuery);
        }
    },
    methods: {
        changePage(val) {
            this.newSearch(this.actualQuery);
        },
        newSearch(val) {
            this.actualQuery = val;
            let currentTab = this.tab;
            logger(currentTab);
            this.isLoading = true;
            api.get("/search/"+currentTab, {
                query: val,
                page: this.pagination[currentTab].page
            }).catch(err => {
                apiError();
            }).then(res => {
                let r = res.data;
                logger(r);
                if (r.success) {
                    this.resultList[currentTab] = r.result;
                    if (r.resultCount) {
                        let resultCount = parseInt(r.resultCount);
                        this.pagination[currentTab].maxPages = Math.floor(resultCount / this.resultPerPage) + (resultCount % this.resultPerPage == 0 ? 0 : 1);
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
                this.isLoading = false;
            });
        }
    },
    created() {
        let tab = this.$route.params.tab;
        if (tab) {
            this.tab = tab;
        }
        this.newSearch(this.searchquery);
    }
};
</script>

<style>

</style>