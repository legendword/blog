<template>
    <q-page class="q-pa-lg">
        <search-bar></search-bar>
        <div class="q-mt-md row q-col-gutter-md">
            <div class="col-12 col-sm-6 col-md-3" v-for="item in mainCategories" :key="item.name">
                <q-card :style="{backgroundColor: item.color, color: '#fff'}" class="categoryCard" @click="$router.push('/category/'+item.name)">
                    <q-card-section class="row items-center no-wrap">
                        <q-avatar>
                            <q-icon :name="item.icon" />
                        </q-avatar>
                        <div class="text-h6 ellipsis">{{$t('categories.'+item.name)}}</div>
                    </q-card-section>
                </q-card>
            </div>
            <div class="col-12 flex items-center">
                <div class="q-pr-md">{{$t('indexPage.otherCategories')}}: </div>
                <div>
                    <q-chip class="q-ma-none q-mr-sm" clickable outline color="primary" v-for="item in otherCategories" :key="item" @click="$router.push('/category/'+item)">{{$t('categories.'+item)}}</q-chip>
                </div>
            </div>
        </div>
        <h4 class="q-mb-lg">{{ $t('indexPage.allPosts') }}</h4>
        <template v-if="postLoading">
            <div class="row q-col-gutter-md">
                <div class="col-12 col-sm-6 col-lg-4" v-for="i in postPerPage" :key="i">
                    <q-card>
                        <q-card-section>
                            <div class="text-h6">
                                <q-skeleton type="text" width="80%" />
                            </div>
                        </q-card-section>
                        <q-card-section class="q-pt-none">
                                <q-skeleton type="text" />
                        </q-card-section>
                        <q-card-section class="q-pt-none">
                            <div class="text-subtitle2">
                                <q-skeleton type="text" width="65%" />
                            </div>
                        </q-card-section>
                    </q-card>
                </div>
            </div>
        </template>
        <template v-else>
            <div class="row q-col-gutter-md">
                <q-intersection class="col-12 col-sm-6 col-lg-4" v-for="item in postList" :key="item.postId">
                    <post-card-compact :post="item"></post-card-compact>
                </q-intersection>
            </div>
            <div class="flex flex-center q-mt-md" v-show="postList.length > 0">
                <q-pagination v-model="postPage" color="primary" :max="maxPages" :max-pages="6" :boundary-numbers="true"></q-pagination>
            </div>
        </template>
        <q-banner class="bg-shade-light text-primary q-my-xl">
            Legendword Blog is in <b>Beta Testing</b>. If you encountered any issues or would like to propose a new feature, please open an Issue on GitHub.
            <template v-slot:action>
                <q-btn flat color="white" label="GitHub" @click="goToGitHub" />
            </template>
        </q-banner>
    </q-page>
</template>

<script>
import { apiError } from 'src/apiError'
import api from '../api'
import PostCard from '../components/PostCard'
import PostCardCompact from '../components/PostCardCompact'
import SearchBar from '../components/SearchBar'
import { mainCategories, otherCategories } from '../mainCategories'
export default {
    name: 'Home',
    data() {
        return {
            mainCategories: mainCategories,
            otherCategories: otherCategories,
            postLoading: false,
            postList: [],
            postCount: 0,
            postPage: 1,
            postPerPage: 6
        }
    },
    computed: {
        maxPages () {
            return Math.floor(this.postCount / this.postPerPage) + (this.postCount % this.postPerPage == 0 ? 0 : 1)
        }
    },
    components: {
        PostCard,
        PostCardCompact,
        SearchBar
    },
    watch: {
        postPage(val) {
            this.getPosts()
        }
    },
    methods: {
        goToGitHub() {
            location.href = 'https://github.com/legendword/blog'
        },
        getPosts() {
            this.postLoading = true
            api.get('/posts', {
                count: this.postPerPage,
                page: this.postPage
            }).catch(err => {
                apiError()
            }).then(res => {
                let r = res.data
                if (r.success) {
                    console.log(r)
                    this.postList = r.posts
                    if (r.postCount !== undefined) {
                        this.postCount = parseInt(r.postCount)
                    }
                }
                else {
                    this.$q.notify({
                        color: 'negative',
                        message: r.msg,
                        position: 'top',
                        timeout: 2000
                    })
                }
                this.postLoading = false
            })
        }
    },
    created() {
        this.getPosts()
    }
}
</script>

<style scoped>
.noLinkStyle, .noLinkStyle:hover, .noLinkStyle:active, .noLinkStyle:visited {
    text-decoration: none;
    color: initial;
}
.categoryCard {
    cursor: pointer;
}
</style>
