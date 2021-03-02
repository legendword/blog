<template>
    <q-page class="q-pa-lg">
        <search-bar in-search-page :initial-query="searchquery" @search="newSearch"></search-bar>
        <div class="q-my-md text-h5 text-weight-regular">Search results for <span class="text-weight-bold">{{ actualQuery }}</span></div>
        <q-tabs v-model="tab" align="left" no-caps class="bg-secondary text-white shadow-2">
            <q-tab name="posts" label="Posts" />
        </q-tabs>
        <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="posts" class="q-px-none">
                <q-list bordered separator>
                    <q-item class="q-pa-md" clickable v-ripple v-for="item in resultList.posts" :key="item.postId" :to="'/post/'+item.postId">
                        <q-item-section>
                            <q-item-label class="text-h6">{{ item.title }}</q-item-label>
                            <q-item-label class="q-pt-xs">{{ item.description }}</q-item-label>
                        </q-item-section>
                    </q-item>
                </q-list>
            </q-tab-panel>
        </q-tab-panels>
    </q-page>
</template>

<script>
import api from '../api'
import SearchBar from '../components/SearchBar'
export default {
    name: 'Search',
    components: {
        SearchBar
    },
    data() {
        return {
            actualQuery: '',
            tab: 'posts',
            resultList: {
                posts: []
            }
        }
    },
    computed: {
        searchquery () {
            return this.$route.query.s
        }
    },
    methods: {
        newSearch(val) {
            this.actualQuery = val
            let currentTab = this.tab
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