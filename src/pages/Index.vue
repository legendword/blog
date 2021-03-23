<template>
  <q-page class="q-pa-lg">
    <search-bar></search-bar>
    <q-banner class="bg-accent text-white q-ma-md">
      Legendword Blog is in <b>Beta Testing</b>. If you encountered any issues or would like to propose a new feature, please open an Issue on GitHub.
      <template v-slot:action>
        <q-btn flat color="white" label="GitHub" @click="goToGitHub" />
      </template>
    </q-banner>
    <h4 class="q-mb-lg">{{ $t('indexPage.allPosts') }}</h4>
    <template v-if="postLoading">
      <div class="row q-col-gutter-md">
        <div class="col-6 col-lg-4" v-for="i in postPerPage" :key="i">
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
        <q-intersection transition="fade" class="col-6 col-lg-4" v-for="item in postList" :key="item.postId">
          <post-card-compact :post="item"></post-card-compact>
        </q-intersection>
      </div>
      <div class="flex flex-center q-mt-md" v-show="this.postList.length > 0">
        <q-pagination v-model="postPage" color="primary" :max="maxPages" :max-pages="6" :boundary-numbers="true"></q-pagination>
      </div>
    </template>
  </q-page>
</template>

<script>
import api from '../api'
import PostCard from '../components/PostCard'
import PostCardCompact from '../components/PostCardCompact'
import SearchBar from '../components/SearchBar'
export default {
  name: 'Home',
  data() {
    return {
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
      api('listpost', {
        type: 'all',
        count: this.postPerPage,
        page: this.postPage
      }).then(res => {
        let r = res.data
        if (r.error) {
          this.$q.notify({
            color: 'negative',
            message: r.msg,
            position: 'top',
            timeout: 2000
          })
        }
        else if (r.success) {
          console.log(r)
          this.postList = r.posts
          this.postCount = parseInt(r.postCount)
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
</style>
