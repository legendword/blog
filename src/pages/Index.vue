<template>
  <q-page class="q-pa-lg">
    <search-bar></search-bar>
    <h4 class="q-mb-lg">{{ $t('indexPage.allPosts') }}</h4>
    <div class="row q-col-gutter-md">
      <q-intersection transition="fade" class="col-12 wideCard" v-for="item in postList" :key="item.postId">
        <post-card :post="item"></post-card>
      </q-intersection>
    </div>
    <div v-show="maxPages > 1">
      <q-pagination v-model="postPage" color="primary" :max="maxPages" :max-pages="6" :boundary-numbers="true"></q-pagination>
    </div>
    <!--
    <h4 class="q-mb-sm">Categories</h4>
    <div class="row q-col-gutter-md">
      <div class="col-6">
        <q-card class="post-card">
          <q-card-section>
            <div class="text-h6 post-card-title">Our Changing Planet</div>
            <div class="text-subtitle2">by John Doe</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            Test
          </q-card-section>
        </q-card>
      </div>
      <div class="col-6">
        <q-card class="post-card">
          <q-card-section>
            <div class="text-h6 post-card-title">Our Changing Planet</div>
            <div class="text-subtitle2">by John Doe</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            Test
          </q-card-section>
        </q-card>
      </div>
    </div>
      -->
  </q-page>
</template>

<script>
import api from '../api'
import PostCard from '../components/PostCard'
import SearchBar from '../components/SearchBar'
export default {
  name: 'Home',
  data() {
    return {
      postList: [],
      postCount: 0,
      postPage: 0
    }
  },
  computed: {
    maxPages () {
      return Math.floor(this.postCount / 10) + (this.postCount % 10 == 0 ? 0 : 1)
    }
  },
  components: {
    PostCard,
    SearchBar
  },
  mounted() {
    api('listpost', {
      type: 'all'
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
        this.postList = r.posts
        this.postCount = r.postCount
      }
    })
  }
}
</script>

<style scoped>
.noLinkStyle, .noLinkStyle:hover, .noLinkStyle:active, .noLinkStyle:visited {
  text-decoration: none;
  color: initial;
}
</style>
