<template>
  <q-page class="q-pa-lg">
    <search-bar></search-bar>
    <h4 class="q-mb-lg">{{ $t('indexPage.allPosts') }}</h4>
    <div class="row q-col-gutter-md">
      <q-intersection transition="fade" class="col-6 col-lg-4" v-for="item in postList" :key="item.postId">
        <post-card-compact :post="item"></post-card-compact>
      </q-intersection>
    </div>
    <div class="flex flex-center q-mt-md" v-show="this.postList.length > 0">
      <q-pagination v-model="postPage" color="primary" :max="maxPages" :max-pages="6" :boundary-numbers="true"></q-pagination>
    </div>
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
    getPosts() {
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
      })
    }
  },
  mounted() {
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
