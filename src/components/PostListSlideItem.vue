<template>
    <q-slide-item @right="deletePost" right-color="negative">
        <template v-slot:right>
            <q-icon name="remove_circle_outline" />
        </template>
        <q-item class="q-pa-md">
            <q-item-section>
                <q-item-label class="text-h6">{{ post.title }}</q-item-label>
                <q-item-label class="q-pt-xs">{{ post.description }}</q-item-label>
                <q-item-label caption class="q-pt-sm">
                    <q-icon class="q-pr-xs" name="person_outline" size="1rem" />
                    <span class="q-my-auto vertical-middle">{{ post.authorName }}</span>

                    <q-icon class="q-pl-sm q-pr-xs" name="schedule" size="1rem" />
                    <span class="q-my-auto vertical-middle">{{ calcTimeElapsed(post.publishTime) }}</span>

                    <q-icon class="q-pl-sm q-pr-xs" name="visibility" size="1rem" />
                    <span class="q-my-auto vertical-middle">{{ calcNumber(post.views) }}</span>

                    <q-icon class="q-pl-sm q-pr-xs" name="label" size="1rem" />
                    <span class="q-my-auto vertical-middle">{{$t("categories."+post.category)}}</span>
                </q-item-label>
            </q-item-section>
        </q-item>
    </q-slide-item>
    
</template>

<script>
import { formatViews, formatTimeElapsed } from "src/util"
export default {
    name: "PostListSlideItem",
    props: {
        post: {
            type: Object,
            required: true
        }
    },
    methods: {
        deletePost({ reset }) {
            this.$q.dialog({
                title: this.$t("collection.deletePostDialog.title"),
                message: this.$t("collection.deletePostDialog.msg"),
                cancel: true,
                persistent: true
            }).onOk(() => {
                reset()
                this.$emit("deletePost")
            }).onCancel(() => {
                reset()
            })
        },
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