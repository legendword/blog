<template>
    <q-page class="q-pb-lg" v-show="loaded">
        <q-banner class="q-px-lg q-pt-lg">
            <div class="text-h6 userName q-py-sm row items-center">
                <div class="col-auto">
                    <q-avatar size="64px" color="primary" text-color="white" class="q-my-auto">{{ user.username?user.username[0]:"" }}</q-avatar>
                </div>
                <div class="col q-mx-md">
                    <span class="q-mr-sm q-my-auto vertical-middle">{{ user.username }}</span>
                    <q-chip v-show="user.isAuthor" color="accent" text-color="white" icon="done" clickable @click="goToAuthorPage">{{ $t("tag.author") }}</q-chip>
                </div>
                <div class="col-12 col-sm-auto q-mx-sm-md q-mt-md q-mt-sm-none text-center" v-show="isLoggedIn && !isCurrentUser">
                    <q-btn class="q-px-md" :text-color="hoverUnfollow ? 'white' : 'black'" :color="hoverUnfollow ? 'negative' : 'white'" :label="$t('userAction.' + (hoverUnfollow ? 'unfollow' : 'following'))" @mouseenter="hoverUnfollow = true" @mouseleave="hoverUnfollow = false" @click="followUser" v-if="user.isFollowing"></q-btn>
                    <q-btn class="q-px-md" color="primary" :label="$t('userAction.follow')" @click="followUser" v-else></q-btn>
                </div>
            </div>
            <!--
            <q-card class="userStats bg-primary text-white row text-center">
                <q-card-section class="col">
                    <div class="text-subtitle1 text-bold">{{ user.followingCount }}</div>
                    <div class="text-body2">{{ $t("general.following") }}</div>
                </q-card-section>
                <q-card-section class="col">
                    <div class="text-subtitle1 text-bold">{{ user.followerCount }}</div>
                    <div class="text-body2">{{ $tc("computed.followers", user.followerCount) }}</div>
                </q-card-section>
                <q-card-section class="col">
                    <div class="text-subtitle1 text-bold">0</div>
                    <div class="text-body2">{{ $tc("computed.collections", 0) }}</div>
                </q-card-section>
            </q-card> -->
            <div class="row q-my-md text-subtitle1 q-gutter-md">
                <div class="col col-sm-auto"><span class="text-h6 text-primary">{{ user.followingCount }}</span> {{ $t("general.following") }}</div>
                <div class="col col-sm-auto"><span class="text-h6 text-primary">{{ user.followerCount }}</span> {{ $tc("computed.followers", user.followerCount) }}</div>
                <div class="col col-sm-auto"><span class="text-h6 text-primary">{{ user.collectionCount }}</span> {{ $tc("computed.collections", user.collectionCount) }}</div>
            </div>
        </q-banner>
        <div class="q-pa-md">
            <q-tabs v-model="tab" align="left" @input="tabChange">
                <q-tab name="profile" :label="$t('userProfile.profile')" class="q-px-lg" />
                <q-tab name="collections" :label="$t('userProfile.collections')" class="q-px-lg" />
            </q-tabs>
            <q-tab-panels v-model="tab" animated>
                <q-tab-panel name="profile">
                    <div class="text-h6 q-my-md">
                        {{ $t("userProfile.profile") }}
                        <div class="float-right">
                            <q-btn color="primary" v-show="isCurrentUser" @click="enterProfileEdit">{{ $t("userProfile.editProfile") }}</q-btn>
                        </div>
                    </div>
                    <q-banner class="bg-grey-3 q-my-md" v-show="isCurrentUser && !user.isAuthor">
                        {{ $t("compose.notAuthorMsg") }}
                        <template v-slot:action>
                            <q-btn flat color="primary" :label="$t('compose.becomeAuthor')" @click="becomeAnAuthor" />
                        </template>
                    </q-banner>
                    <upcoming-feature version="0.4"></upcoming-feature>
                </q-tab-panel>
                <q-tab-panel name="collections">
                    <div class="text-h6 q-my-md">
                        {{ $t("userProfile.collections") }}
                    </div>
                    <q-list class="q-mx-md" v-if="collectionsLoading">
                        <q-item v-for="i in 2" :key="i">
                            <q-item-section>
                                <q-item-label class="text-subtitle2 collectionItemTitle">
                                    <q-skeleton type="text" />
                                </q-item-label>
                                <q-item-label caption class="collectionItemInfo">
                                    <q-skeleton type="text" width="45%" />
                                </q-item-label>
                            </q-item-section>
                        </q-item>
                    </q-list>
                    <q-list bordered separator class="q-mx-md" v-else>
                        <collection-list-item v-for="item in collections" :key="item.id" :collection="item">
                        </collection-list-item>
                    </q-list>
                </q-tab-panel>
            </q-tab-panels>
        </div>
    </q-page>
</template>

<script>
import api from "../api";
import { mapState } from "vuex";
import UpcomingFeature from "../components/UpcomingFeature";
import CollectionListItem from "../components/CollectionListItem";
import { apiError } from "src/apiError";
import UserInfoEdit from "src/components/dialogs/UserInfoEdit.vue";
import logger from "src/logger";
export default {
    name: "UserProfile",
    components: {
        UpcomingFeature,
        CollectionListItem
    },
    meta() {
        return {
            title: this.user.username ? this.user.username : null
        };
    },
    data() {
        return {
            loaded: false,
            user: {},
            isCurrentUser: false,
            userNotFound: false,
            tab: "profile",
            hoverUnfollow: false,
            collections: [],
            collectionsLoading: false
        };
    },
    computed: {
        userId () {
            return this.$route.params.id;
        },
        currentUser () {
            return this.$store.state.user;
        },
        isLoggedIn () {
            return this.$store.state.isLoggedIn;
        }
    },
    watch: {
        currentUser: {
            handler: function(newVal) {
                if (this.isCurrentUser) {
                    for (let i in newVal) {
                        this.user[i] = newVal[i];
                    }
                }
                this.user.isAuthor = this.user.isAuthor == "1";
            },
            deep: true
        }
    },
    methods: {
        followUser() {
            api.post("/users/"+this.user.id+"/follow").catch(err => {
                apiError();
            }).then(res => {
                let r = res.data;
                logger(r);
                if (r.success) {
                    this.user.followerCount = parseInt(this.user.followerCount) + parseInt(r.delta);
                    this.user.isFollowing = !this.user.isFollowing;
                }
                else this.$q.notify({ color: "negative", message: r.msg, position: "top", timeout: 2000 });
            });
        },
        goToAuthorPage() {
            if (this.user.isAuthor && this.user.authorId) {
                this.$router.push("/author/"+this.user.authorId);
            }
        },
        becomeAnAuthor() {
            //click becomeAnAuthor
            api.post("/user/becomeAuthor").catch(err => {
                apiError();
            }).then(res => {
                let r = res.data;
                if (r.success) {
                    this.$q.notify({
                        color: "positive",
                        message: this.$t("compose.authorApplicationApproved"),
                        position: "top",
                        timeout: 2000
                    });
                    this.user.isAuthor = true;
                    this.user.authorId = r.authorId;
                    this.$store.commit("userDataChange", {
                        isAuthor: "1"
                    });
                }
                else {
                    this.$q.notify({
                        color: "negative",
                        message: r.msg,
                        position: "top",
                        timeout: 2000
                    });
                }
            });
        },
        enterProfileEdit() {
            this.$q.dialog({
                component: UserInfoEdit,
                parent: this,
                initialValues: {
                    username: this.currentUser.username
                }
            }).onOk((val) => {
                logger(val);
                this.$store.commit("userDataChange", {
                    username: val.username
                });
                this.$store.commit("setBarTitle", this.$t("barTitle.user") + " / " + val.username);
            });
        },
        tabChange(val) {
            let newPath = "/user/"+this.$route.params.id+"/"+val;
            if (this.$route.path != newPath) {
                this.$router.replace(newPath);
            }
            if (val == "collections") {
                this.collectionsLoading = true;
                api.get("/collections/user/"+this.userId).catch(err => {
                    apiError();
                }).then(res => {
                    let r = res.data;
                    if (r.success) {
                        this.collections = r.collections;
                    }
                    else {
                        this.$q.notify({ color: "negative", message: r.msg, position: "top", timeout: 2000 });
                    }
                    this.collectionsLoading = false;
                });
            }
        },
        loadInfo() {
            api.get("/users/"+this.$route.params.id).catch(err => {
                apiError();
            }).then(res => {
                let r = res.data;
                this.user = {};
                this.isCurrentUser = false;
                this.userNotFound = false;
                if (r.success) {
                    logger(r);
                    this.user = r.user;
                    this.user.isAuthor = this.user.isAuthor == "1";
                    this.isCurrentUser = r.isCurrentUser;
                    this.$store.commit("setBarTitle", this.$t("barTitle.user") + " / " + this.user.username);
                    this.tabChange(this.tab);
                    this.loaded = true;
                }
                else {
                    if (r.errorType) {
                        if (r.errorType == "NotFound") {
                            this.$router.replace("/404?type=user");
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
        if (["profile", "collections"].includes(tab)) {
            this.tab = tab;
        }
        this.loadInfo();
    }
};
</script>

<style>
.userProfile-flwBtn {
    width: 100%;    
}
.userName {
    margin: auto;
}
.userStats {
    max-width: 400px;
}
</style>
