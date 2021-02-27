<template>
    <router-link :to="'/post/'+post.postId" class="noLinkStyle">
        <q-card class="post-card">
            <q-card-section>
                <div class="text-h6 post-card-title">{{ post.title }}</div>
                <div class="text-subtitle2">by {{ post.authorName }}</div>
            </q-card-section>

            <q-card-section class="q-pt-none">
                {{ previewContent(post.content) }}
            </q-card-section>
        </q-card>
    </router-link>
</template>

<script>
export default {
    name: 'PostCard',
    props: {
        post: {
            type: Object,
            required: true
        }
    },
    methods: {
        previewContent(str) {
            return str ? str.replace(/[#_:=>\`]/ig,'').trim() : ''
        }
    }
}
</script>

<style>
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
</style>