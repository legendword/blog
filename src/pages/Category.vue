<template>
    <q-page class="q-pa-lg">
        <h4 class="q-mb-lg">{{$t('category.title')}}: {{ $te('categories.'+$route.params.name) ? $t('categories.'+$route.params.name) : $route.params.name }}</h4>
        <div v-show="categoryNotFound">
            {{$t('category.notFoundMsg')}}
        </div>
        <div v-show="!categoryNotFound">
            <div class="row justify-between q-mb-md">
                <div class="text-h5">{{$t('general.posts')}}</div>
                <div>
                    <q-btn-dropdown icon="sort" color="primary" :label="$t('general.sortBy')">
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
                <q-intersection transition="fade" class="col-12 wideCard" v-for="item in postList" :key="item.postId">
                    <post-card :post="item"></post-card>
                </q-intersection>
            </div>
        </div>
    </q-page>
</template>

<script>
import api from '../api'
import PostCard from '../components/PostCard'
export default {
    name: 'Category',
    components: {
        PostCard
    },
    data() {
        return {
            categoryNotFound: false,
            sortBy: 'timeDesc',
            sortOptions: [
                {label: this.$t('general.sort.timeDesc'), value: 'timeDesc'},
                {label: this.$t('general.sort.timeAsc'), value: 'timeAsc'},
                {label: this.$t('general.sort.viewsDesc'), value: 'viewsDesc'}
            ],
            postList: []
        }
    },
    methods: {
        changeSortBy(value) {
            this.sortBy = value
            this.getPosts()
        },
        getPosts() {
            api('listpost', {
                type: 'category',
                category: this.$route.params.name,
                sort: this.sortBy
            }).then(res => {
                let r = res.data
                console.log(r)
                if (r.error) {
                    if (r.errorType && r.errorType == 'CategoryNotFound') {
                        this.categoryNotFound = true
                    }
                    else {
                        this.$q.notify({color: 'negative', message: r.msg, position: 'top', timeout: 2000})
                    }
                }
                else {
                    this.postList = r.posts
                }
            })
        }
    },
    mounted() {
        this.getPosts()
    }
}
</script>

<style>

</style>