<template>
    <router-link :to="'/post/'+post.postId" class="noLinkStyle">
        <q-card class="post-card">
            <q-card-section>
                <div class="text-h6 post-card-title ellipsis">{{ post.title }}</div>
            </q-card-section>

            <q-card-section class="q-pt-none">
                <div class="ellipsis" :title="post.description">{{ post.description }}</div>
            </q-card-section>

            <q-card-section class="q-pt-none">
                <div class="text-subtitle2">
                    <q-icon class="q-pr-sm" name="person_outline" size="1rem" />
                    <span class="q-my-auto vertical-middle">{{ post.authorName }}</span>

                    <span v-show="false">
                        <q-icon class="q-pl-sm q-pr-sm" name="schedule" size="1rem" />
                        <span class="q-my-auto vertical-middle">{{ calcTimeElapsed(post.publishTime) }}</span>
                    </span>

                    <q-icon class="q-pl-sm q-pr-sm" name="visibility" size="1rem" />
                    <span class="q-my-auto vertical-middle">{{ calcNumber(post.views) }}</span>

                    <span class="gt-sm q-pl-sm">
                        <q-chip class="q-ma-none" outline color="primary">{{$t("categories."+post.category)}}</q-chip>
                    </span>
                </div>
            </q-card-section>
        </q-card>
    </router-link>
</template>

<script>
import { formatTimeElapsed, formatViews } from "../util";
export default {
    name: "PostCardCompact",
    props: {
        post: {
            type: Object,
            required: true
        }
    },
    methods: {
        calcNumber(n) {
            return formatViews(n);
        },
        calcTimeElapsed(tm) {
            return formatTimeElapsed(tm);
        }
    }
};
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