<template>
    <q-page class="q-pb-lg" v-show="loaded">
        <q-banner class="q-px-lg q-pt-lg">
            <div class="text-h6 userName q-py-sm row items-center">
                <div class="col-auto">
                    <q-avatar size="64px" color="deep-purple-6" text-color="white" class="q-my-auto">{{ author.displayName?author.displayName[0]:"" }}</q-avatar>
                </div>
                <div class="col q-mx-md">
                    <span class="q-mr-sm q-my-auto vertical-middle">{{ author.displayName }}</span>
                    <q-chip color="accent" text-color="white" icon="create">{{ $t("tag.author") }}</q-chip>
                </div>
                <div class="col-12 col-sm-auto q-mx-sm-md q-mt-md q-mt-sm-none text-center" v-show="isLoggedIn">
                    <q-btn class="q-px-md" :text-color="hoverUnfollow ? 'white' : 'black'" :color="hoverUnfollow ? 'negative' : 'white'" :label="$t('userAction.' + (hoverUnfollow ? 'unfollow' : 'following'))" @mouseenter="hoverUnfollow = true" @mouseleave="hoverUnfollow = false" @click="followAuthor" v-if="author.isFollowing"></q-btn>
                    <q-btn class="q-px-md" color="primary" :label="$t('userAction.follow')" @click="followAuthor" v-else></q-btn>
                </div>
            </div>
            <div class="row q-my-md text-subtitle1 q-gutter-md">
                <div class="col col-sm-auto"><span class="text-h6 text-primary">{{ author.followerCount }}</span> {{ $tc("computed.followers", author.followerCount) }}</div>
                <div class="col col-sm-auto"><span class="text-h6 text-primary">{{ author.postCount }}</span> {{ $tc("computed.posts", author.postCount) }}</div>
            </div>
        </q-banner>
        <div class="q-pa-md">
            <q-tabs v-model="tab" align="left" ref="tab" @input="tabChange">
                <q-tab name="profile" :label="$t('authorProfile.profile')" class="q-px-lg" />
                <q-tab name="posts" :label="$t('authorProfile.posts')" class="q-px-lg" />
            </q-tabs>
            <q-tab-panels v-model="tab" animated>
                <q-tab-panel name="profile">
                    <div class="text-h6 q-my-md">
                        {{ $t("authorProfile.profile") }}
                        <div class="float-right">
                            <q-btn color="primary" v-show="isCurrentUser" @click="enterProfileEdit">{{ $t("authorProfile.editProfile") }}</q-btn>
                        </div>
                    </div>
                    <upcoming-feature version="0.4"></upcoming-feature>
                </q-tab-panel>
                <q-tab-panel name="posts">
                    <div class="text-h6 q-my-md">
                        {{ $t("authorProfile.posts") }}
                    </div>
                    <q-intersection class="col-12 wideCard" v-for="item in postList" :key="item.postId">
                        <post-card :post="item"></post-card>
                    </q-intersection>
                    <div class="flex flex-center q-mt-md" v-show="postCount > 0">
                        <q-pagination v-model="postPage" color="primary" :max="maxPages" :max-pages="6" :boundary-numbers="true" @input="changePage"></q-pagination>
                    </div>
                </q-tab-panel>
            </q-tab-panels>
        </div>
    </q-page>
</template>

<script>
import api from "../api";
import { mapState } from "vuex";
import PostCard from "../components/PostCard.vue";
import UpcomingFeature from "src/components/UpcomingFeature.vue";
import { apiError } from "src/apiError";
import AuthorInfoEdit from "src/components/dialogs/AuthorInfoEdit.vue";
import logger from "src/logger";
export default {
    name: "AuthorProfile",
    components: {
        PostCard,
        UpcomingFeature
    },
    meta() {
        return {
            title: this.author.displayName ? this.author.displayName : null
        };
    },
    data() {
        return {
            loaded: false,
            author: {},
            postList: [],
            postCount: 0,
            postPage: 1,
            postPerPage: 10,
            isCurrentUser: false,
            authorNotFound: false,
            tab: "profile",
            hoverUnfollow: false
        };
    },
    computed: {
        authorId () {
            return this.$route.params.id;
        },
        isLoggedIn () {
            return this.$store.state.isLoggedIn;
        },
        maxPages () {
            return Math.floor(this.postCount / this.postPerPage) + (this.postCount % this.postPerPage == 0 ? 0 : 1);
        }
    },
    methods: {
        changePage(val) {
            this.tabChange(this.tab);
        },
        followAuthor() {
            api.post("/authors/"+this.author.id+"/follow").catch(err => {
                apiError();
            }).then(res => {
                let r = res.data;
                logger(r);
                if (r.success) {
                    this.author.followerCount = parseInt(this.author.followerCount) + parseInt(r.delta);
                    this.author.isFollowing = !this.author.isFollowing;
                }
                else this.$q.notify({ color: "negative", message: r.msg, position: "top", timeout: 2000 });
            });
        },
        tabChange(val) {
            let newPath = "/author/"+this.$route.params.id+"/"+val;
            if (this.$route.path != newPath) {
                this.$router.replace(newPath);
            }
            if (val == "posts") {
                api.get("/posts/author/"+this.author.id, {
                    page: this.postPage
                }).catch(err => {
                    apiError();
                }).then(res => {
                    let r = res.data;
                    logger(r);
                    if (r.error) {
                        this.$q.notify({
                            color: "negative",
                            message: r.msg,
                            position: "top",
                            timeout: 2000
                        });
                    }
                    else if (r.success) {
                        this.postList = r.posts;
                        if (r.postCount) {
                            this.postCount = parseInt(r.postCount);
                        }
                    }
                });
            }
        },
        scrollHandler(details) {
            let el = this.$refs.tab.$el;
            let offset = el.offsetTop;
            let tabTop = el.getBoundingClientRect().top;
        },
        enterProfileEdit() {
            this.$q.dialog({
                component: AuthorInfoEdit,
                parent: this,
                initialValues: {
                    displayName: this.author.displayName
                }
            }).onOk((val) => {
                logger(val);
                this.author.displayName = val.displayName;
                this.$store.commit("setBarTitle", this.$t("barTitle.author") + " / " + this.author.displayName);
            });
        },
        loadInfo() {
            api.get("/authors/"+this.$route.params.id).catch(err => {
                apiError();
            }).then(res => {
                let r = res.data;
                this.author = {};
                this.isCurrentUser = false;
                this.authorNotFound = false;
                if (r.success) {
                    logger(r.author);
                    this.author = r.author;
                    this.isCurrentUser = this.$store.state.isLoggedIn && r.author.userId == this.$store.state.user.id;
                    this.$store.commit("setBarTitle", this.$t("barTitle.author") + " / " + this.author.displayName);
                    this.tabChange(this.tab);
                    this.loaded = true;
                }
                else {
                    if (r.errorType) {
                        if (r.errorType == "NotFound") {
                            this.$router.push("/404");
                        }
                    }
                    else {
                        this.$q.notify({
                            color: "negative",
                            message: r.msg,
                            position: "top",
                            timeout: 2000
                        });
                    }
                    this.$store.commit("setBarTitle");
                }
            });
        }
    },
    created() {
        let tab = this.$route.params.tab;
        if (["profile", "posts"].includes(tab)) {
            this.tab = tab;
        }
        this.loadInfo();
    }
};
</script>

<style>
/* copied some of the style from UserProfile.vue */
.userName {
    margin: auto;
}
.userStats {
    max-width: 400px;
}
</style>
