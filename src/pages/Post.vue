<template>
    <q-page class="q-pa-lg">
        <h4>{{ post.title }}</h4>
        <div class="text-body1" v-html="post.content" v-for="n in 20" :key="n"></div>
        <p class="text-body1">{{ $route.params.id }}</p>
    </q-page>
</template>

<script>
export default {
    name: 'Post',
    data() {
        return {
            post: {
                title: "Sample Post",
                content: "<h5>Post Content.....</h5><p>Content Test</p>"
            }
        }
    }
}
</script>
