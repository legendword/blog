<template>
    <q-page class="q-pa-md q-pa-sm-lg">
        <div v-if="loaded">
            <div class="post-layout">
                <!-- title and add to collection btn -->
                <div class="row q-mt-lg q-mb-xl">
                    <div class="col">
                        <div class="text-h4 word-break">{{ post.title }}</div>
                    </div>
                    <div class="col-auto" v-show="isLoggedIn">
                        <add-to-collection :postId="parseInt(postId)" />
                    </div>
                </div>
                <!-- post info and author info -->
                <div class="row q-mb-lg justify-between">
                    <div class="col-12 col-md">
                        <div class="q-mt-md text-subtitle1 post-infoLine row inline wrap items-center">
                            <div>
                                {{ $t("post.publishedOn.before") }} <span class="text-weight-medium gt-xs">{{ post.publishTimeStr }}</span><span class="text-weight-medium xs">{{ post.publishTimeStr ? post.publishTimeStr.substring(0, 10) : "" }}</span> {{ $t("post.publishedOn.after") }}
                            </div>
                            <div class="q-pl-md q-pl-sm-lg">
                                {{ $t("post.views.before") }} <span class="text-weight-medium">{{ post.views }}</span> {{ $t("post.views.after") }}
                            </div>
                        </div>
                        <div>
                            <q-chip class="text-weight-medium" clickable outline color="primary" @click="goToCategory">{{post.category ? $t("categories."+post.category) : ""}}</q-chip>
                            <q-chip v-for="tag in post.tags" :key="tag.id" clickable color="primary" text-color="white" @click="goToTag(tag.name)">{{tag.name}}</q-chip>
                        </div>
                    </div>
                    <div class="col-12 col-md-auto q-pt-md q-pt-md-none text-subtitle1">
                        <q-card flat bordered>
                            <q-card-section>
                                <div class="row">
                                    <div class="col-auto q-pr-md">
                                        <router-link :to="'/author/'+post.authorId" class="noLinkStyle">
                                            <q-avatar color="primary" text-color="white">{{ post.authorName ? post.authorName[0]:"" }}</q-avatar>
                                        </router-link>
                                    </div>
                                    <div class="col q-my-auto">
                                        <router-link :to="'/author/'+post.authorId" class="noLinkStyle"><strong>{{ post.authorName }}</strong></router-link>
                                        <div class="text-caption">{{ post.followerCount }} {{ $t("computed.followers", Number(post.followerCount) || 0) }}</div>
                                    </div>
                                    <div class="col-auto q-my-auto" v-show="isLoggedIn">
                                        <q-btn flat :color="hoverUnfollow ? 'negative' : 'grey'" :label="hoverUnfollow ? $t('userAction.unfollow') : $t('userAction.following')" @mouseenter="hoverUnfollow = true" @mouseleave="hoverUnfollow = false" @click="followAuthor" v-if="post.isFollowing"></q-btn>
                                        <q-btn flat color="primary" :label="$t('userAction.follow')" @click="followAuthor" v-else></q-btn>
                                    </div>
                                </div>
                            </q-card-section>
                        </q-card>
                    </div>
                </div>
                <div class="relative-position">
                    <!-- table of contents -->
                    <div v-if="post.showTOC == 1" class="toc-container q-pt-sm">
                        <toc :headings="headings" @select="goToNthHeading" />
                    </div>
                    <!-- post content -->
                    <markdown-view class="post-content q-pt-lg q-pb-md col-12 col-md-8" :content="post.content ? post.content : ''" />
                </div>
                <!-- comments -->
                <div class="q-mt-xl">
                    <q-separator />
                    <comments :comments="post.comments" :likedComments="post.likedComments" :authorUserId="post.authorUserId" :postId="postId" @update="getPost" />
                </div>
            </div>
        </div>
        <div v-else>
            <loading-message />
        </div>
    </q-page>
</template>

<script>
import TableOfContents from "../helpers/TableOfContents";
import MarkdownView from "@/components/post/MarkdownView.vue";
import api from "../api";
import { mapState } from "pinia";
import { formatTimeElapsed } from "../util";
import LoadingMessage from "@/components/LoadingMessage.vue";
import { apiError } from "@/apiError";
import AddToCollection from "@/components/post/AddToCollection.vue";
import Comments from "@/components/post/Comments.vue";
import Toc from "@/components/post/Toc.vue";
import logger from "@/logger";
import { useMainStore } from "@/stores/main";
import { createMetaMixin } from "quasar";
export default {
    name: "Post",
    components: {
        MarkdownView,
        LoadingMessage,
        AddToCollection,
        Comments,
        Toc
    },
    mixins: [createMetaMixin(function() {
        return {
            title: this.pageTitle,
            meta: {
                description: { name: "description", content: this.pageDescription }
            }
        };
    })],
    data() {
        return {
            loaded: false,
            post: {},
            postNotFound: false,
            hoverUnfollow: false,
            pageTitle: null,
            pageDescription: null,
            headings: [],
            goToNthHeading: TableOfContents.goToNthHeading
        };
    },
    computed: {
        postId() {
            return parseInt(this.$route.params.id);
        },
        ...mapState(useMainStore, ["isLoggedIn", "user"])
    },
    methods: {
        getPost() {
            api.get("/posts/"+this.postId).catch(err => {
                apiError();
            }).then(res => {
                this.setData(res.data);
            });
        },
        goToCategory() {
            if (this.post.category) {
                this.$router.push("/category/"+this.post.category);
            }
        },
        goToTag(tagName) {
            this.$router.push("/tag/"+tagName);
        },
        followAuthor() {
            api.post("/authors/"+this.post.authorId+"/follow").catch(err => {
                apiError();
            }).then(res => {
                let r = res.data;
                logger(r);
                if (r.success) {
                    this.post.followerCount = parseInt(this.post.followerCount) + parseInt(r.delta);
                    this.post.isFollowing = !this.post.isFollowing;
                }
                else {
                    this.$q.notify({ color: "negative", message: r.msg });
                }
            });
        },
        setData(r) {
            if (r.success) {
                logger(r.post);
                if (r.post.likedComments) {
                    r.post.likedComments = r.post.likedComments.map(v => v.id);
                }
                else {
                    r.post.likedComments = [];
                }
                this.post = r.post;
                useMainStore().setBarTitle(r.post.title);
                this.pageTitle = r.post.title;
                this.pageDescription = r.post.description;

                let toc = new TableOfContents(this.post.content);
                this.headings = toc.getHeadings();
            }
            else {
                if (r.errorType && r.errorType == "NotFound") {
                    this.$router.replace("/404?type=post");
                }
                else {
                    this.$q.notify({
                        color: "negative",
                        message: r.msg
                    });
                }
                useMainStore().setBarTitle();
            }
        }
    },
    mounted() {
        //scroll to comments
        /*
        if (this.$route.hash) {
            let hash = this.$route.hash.substring(1)
            if (this.$refs[hash]) {
                let target = getScrollTarget(this.$refs[hash])
                let offset = this.$refs[hash].offsetTop
                let duration = 200
                setScrollPosition(target, offset, duration)
            }
        }
        */
    },
    created() { //v0.2: using created() to load content after route for better user experience
        api.get("/posts/" + this.$route.params.id).catch(err => {
            apiError();
        }).then(res => {
            this.setData(res.data);
            this.loaded = true;
        });
    }
};
</script>

<style scoped lang="scss">
.noLinkStyle, .noLinkStyle:hover, .noLinkStyle:active, .noLinkStyle:visited {
  text-decoration: none;
  color: initial;
}
.post-layout {
    max-width: 1000px;
    margin-left: auto;
    margin-right: auto;
}
@media screen and (min-width: 1600px) {
    .toc-container {
        position: absolute;
        top: 0;
        left: -250px;
        width: 250px;
        height: auto;
    }
}
.post-infoLine {
    color: #636363;
}
body.screen--xs {
    .commentAction, .replyAction {
        display: block !important;
    }
}
</style>