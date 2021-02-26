<template>
  <q-page class="q-px-xl q-pb-xl">
    <h4 class="q-mb-sm">All Posts</h4>
    <div class="row q-col-gutter-md">
      <q-intersection transition="fade" class="col-12 wideCard" v-for="item in postList" :key="item.postId">
        <router-link :to="'/post/'+item.postId" class="noLinkStyle">
          <q-card class="post-card">
            <q-card-section>
              <div class="text-h6 post-card-title">{{ item.title }}</div>
              <div class="text-subtitle2">by <router-link :to="'/author/'+item.authorId" class="noLinkStyle">{{ item.authorName }}</router-link></div>
            </q-card-section>

            <q-card-section class="q-pt-none">
              {{ previewContent(item.content) }}
            </q-card-section>
          </q-card>
        </router-link>
      </q-intersection>
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
export default {
  name: 'PageIndex',
  data() {
    return {
      postList: []
    }
  },
  methods: {
    previewContent(str) {
      return str ? str.replace(/[#_:=]/ig,'').trim() : ''
    }
  },
  mounted() {
    api('listpost').then(res => {
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
.post-card {
  cursor: pointer;
}
.post-card:hover .post-card-title {
  text-decoration: underline;
}
.wideCard {
  height: 150px;
}
.wideCard .post-card {
  height: 140px;
}
</style>
