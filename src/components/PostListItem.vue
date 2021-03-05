<template>
    <q-item class="q-pa-md" clickable v-ripple :to="'/post/'+post.postId">
        <q-item-section>
            <q-item-label class="text-h6">{{ post.title }}</q-item-label>
            <q-item-label class="q-pt-xs">{{ post.description }}</q-item-label>
            <q-item-label caption class="q-pt-sm">
                <q-icon class="q-pr-sm" name="person_outline" size="1rem" />
                <span class="q-my-auto vertical-middle">{{ post.authorName }}</span>

                <span>
                    <q-icon class="q-pl-sm q-pr-sm" name="schedule" size="1rem" />
                    <span class="q-my-auto vertical-middle">{{ calcTimeElapsed(post.publishTime) }}</span>
                </span>

                <q-icon class="q-pl-sm q-pr-sm" name="visibility" size="1rem" />
                <span class="q-my-auto vertical-middle">{{ calcNumber(post.views) }}</span>
            </q-item-label>
        </q-item-section>
    </q-item>
</template>

<script>
import { formatViews, formatTimeElapsed } from 'src/util'
export default {
    name: 'PostListItem',
    props: {
        post: {
            type: Object,
            required: true
        }
    },
    methods: {
        calcTimeElapsed(n) {
            return formatTimeElapsed(n)
        },
        calcNumber(n) {
            return formatViews(n)
        }
    }
}
</script>

<style>

</style>