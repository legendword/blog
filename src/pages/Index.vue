<template>
  <q-page class="q-px-xl q-pb-xl">
    <h4 class="q-mb-lg">All Posts</h4>
    <div class="row q-col-gutter-md">
      <q-intersection transition="fade" class="col-12 wideCard" v-for="item in postList" :key="item.postId">
        <post-card :post="item"></post-card>
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
import PostCard from '../components/PostCard'
export default {
  name: 'PageIndex',
  data() {
    return {
      postList: []
    }
  },
  components: {
    PostCard
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
.wideCard {
  height: 150px;
}
.wideCard .post-card {
  height: 140px;
}
</style>
