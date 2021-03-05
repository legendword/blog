<template>
    <router-link :to="'/post/'+post.postId" class="noLinkStyle">
        <q-card class="post-card">
            <q-card-section>
                <div class="text-h6 post-card-title">{{ post.title }}</div>
            </q-card-section>

            <q-card-section class="q-pt-none">
                {{ post.description }}
            </q-card-section>

            <q-card-section class="q-pt-none">
                <div class="text-subtitle2">
                    <q-icon class="q-pr-sm" name="person_outline" size="1rem" />
                    <span class="q-my-auto vertical-middle">{{ post.authorName }}</span>

                    <span v-show="!compact">
                        <q-icon class="q-pl-sm q-pr-sm" name="schedule" size="1rem" />
                        <span class="q-my-auto vertical-middle">{{ calcTimeElapsed(post.publishTime) }}</span>
                    </span>

                    <q-icon class="q-pl-sm q-pr-sm" name="visibility" size="1rem" />
                    <span class="q-my-auto vertical-middle">{{ calcNumber(post.views) }}</span>
                </div>
            </q-card-section>
        </q-card>
    </router-link>
</template>

<script>
import { formatTimeElapsed, formatViews } from '../util'
export default {
    name: 'PostCard',
    props: {
        post: {
            type: Object,
            required: true
        },
        compact: {
            type: Boolean,
            required: false
        }
    },
    methods: {
        previewContent(str) { //no longer needed
            return str ? str.replace(/[#_:=>\`\\\*]/ig,'').trim() : ''
        },
        calcNumber(n) {
            return formatViews(n)
        },
        calcTimeElapsed(tm) {
            return formatTimeElapsed(tm)
        }
    }
}
</script>

<style lang="scss">
.noLinkStyle, .noLinkStyle:hover, .noLinkStyle:active, .noLinkStyle:visited {
    text-decoration: none;
    color: initial;
}
.post-card {
    cursor: pointer;
}
.post-card, .post-card-title {
    transition: color 200ms;
}
.post-card:hover .post-card-title {
    color: $primary;
}
</style>