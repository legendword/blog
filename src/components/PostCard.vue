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
            let res,unit
            if (n >= 1000000) {
                res = n/1000000
                unit = 'M'
            }
            else if (n >= 1000) {
                res = n/1000
                unit = 'K'
            }
            else {
                res = n
                unit = ''
            }
            res = Math.floor(res * 10)
            if (res < 100 && res % 10 != 0) return (res/10) + unit
            else return Math.floor(res/10) + unit
        },
        calcTimeElapsed(tm) {
            let secs = Math.floor(Date.now()/1000) - tm;
            let res = '',num = 0;
            if (secs >= 31536000) {
                num = Math.floor(secs / 31536000);
                res = num + ' year';
            }
            else if (secs >= 2592000) {
                num = Math.floor(secs / 2592000);
                res = num + ' month';
            }
            else if (secs >= 86400) {
                num = Math.floor(secs / 86400);
                res = num + ' day';
            }
            else if (secs >= 3600) {
                num = Math.floor(secs / 3600);
                res = num + ' hour';
            }
            else if (secs >= 60) {
                num = Math.floor(secs / 60);
                res = num + ' minute';
            }
            else {
                num = secs;
                res = num + ' second';
            }
            return res + (num==1?'':'s') + ' ago';
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