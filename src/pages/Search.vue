<template>
    <q-page class="q-pa-lg">
        <search-bar in-search-page :initial-query="searchquery" @search="newSearch"></search-bar>
        <div class="q-my-md text-h5 text-weight-regular">{{ $t('search.searchResultFor') }} <span class="text-weight-bold">{{ actualQuery }}</span></div>
        <q-tabs v-model="tab" align="left" no-caps class="bg-secondary text-white shadow-2">
            <q-tab name="posts" :label="$t('general.posts')" />
            <q-tab name="authors" :label="$t('general.authors')" />
            <q-tab name="users" :label="$t('general.users')" />
        </q-tabs>
        <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="posts" class="q-px-none">
                <div v-if="isLoading" class="row justify-center q-my-md">
                    <q-circular-progress indeterminate size="50px" color="primary" class="col-auto" />
                </div>
                <div v-else>
                    <q-list bordered separator v-if="resultList.posts.length">
                        <PostListItem v-for="item in resultList.posts" :key="item.postId" :post="item"></PostListItem>
                    </q-list>
                    <div class="text-h6 q-pl-md" v-else>
                        {{ $t('search.noResultsFound') }}
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
                        {{ $t('search.noResultsFound') }}
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
                        {{ $t('search.noResultsFound') }}
                    </div>
                </div>
            </q-tab-panel>
        </q-tab-panels>
    </q-page>
</template>

<script>
import PostListItem from '../components/PostListItem.vue'
import api from '../api'
import SearchBar from '../components/SearchBar.vue'
import AuthorCard from '../components/AuthorCard.vue'
import UserCard from '../components/UserCard.vue'
export default {
    name: 'Search',
    components: {
        SearchBar,
        PostListItem,
        AuthorCard,
        UserCard
    },
    data() {
        return {
            actualQuery: '',
            tab: 'posts',
            resultList: {
                posts: [],
                authors: [],
                users: []
            },
            isLoading: false
        }
    },
    computed: {
        searchquery () {
            return this.$route.query.s
        }
    },
    watch: {
        tab: function () {
            this.newSearch(this.actualQuery)
        }
    },
    methods: {
        newSearch(val) {
            this.actualQuery = val
            let currentTab = this.tab
            console.log(currentTab)
            this.isLoading = true
            api('search', {
                type: currentTab,
                query: val
            }).then(res => {
                let r = res.data
                console.log(r)
                if (r.error) {
                    this.$q.notify({
                        color: 'negative',
                        message: r.msg,
                        position: 'top',
                        timeout: 2000
                    })
                }
                else if (r.success) {
                    this.resultList[currentTab] = r.result
                }
                this.isLoading = false
            })
        }
    },
    mounted() {
        this.newSearch(this.searchquery)
    }
}
</script>

<style>

</style>