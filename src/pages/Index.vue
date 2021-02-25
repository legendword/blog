<template>
  <q-page class="q-px-xl q-pb-xl">
    <h4 class="q-mb-sm">Featured</h4>
    <div class="row q-col-gutter-md">
      <q-intersection transition="fade" class="col-12 wideCard" v-for="item in featuredList" :key="item.id">
        <router-link :to="'/post/'+item.postId" class="noLinkStyle">
          <q-card class="post-card">
            <q-card-section>
              <div class="text-h6 post-card-title">{{ item.title }}</div>
              <div class="text-subtitle2">by {{ item.author }}</div>
            </q-card-section>

            <q-card-section class="q-pt-none">
              {{ item.contentPreview }}
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
export default {
  name: 'PageIndex',
  data() {
    return {
      featuredList: [
        {
          id: 1,
          postId: 1,
          title: 'Sample Post',
          contentPreview: 'Post Content..... Content Test',
          author: 'Legendword'
        }
      ]
    }
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
