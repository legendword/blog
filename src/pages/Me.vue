<template>
    <q-page class="q-pb-lg">
        <need-to-log-in v-if="!isLoggedIn" />
        <div v-else>
            <!-- Profile Banner -->
            <q-banner class="q-px-lg p-pt-xl q-pt-lg">
                <div class="text-h6 q-py-sm row items-center">
                    <div class="col-auto">
                        <q-avatar size="64px" color="primary" text-color="white" class="q-my-auto">{{ user.username?user.username[0]:"" }}</q-avatar>
                    </div>
                    <div class="col q-mx-md">
                        <span class="q-mr-sm q-my-auto vertical-middle">{{ user.username }}</span>
                        <q-chip v-show="user.isAuthor" color="accent" text-color="white" icon="done" clickable @click="goToAuthorPage">{{ $t("tag.author") }}</q-chip>
                    </div>
                    <div class="col-12 col-sm-auto q-mx-sm-md q-mt-lg q-mt-sm-none text-center">
                        <q-btn flat class="q-px-md" color="primary" @click="goToUserPage">View Public Profile</q-btn>
                    </div>
                    <!--
                    !! which profile (user/author) to edit?
                    <div class="col-12 col-sm-auto q-mx-sm-md q-mt-lg q-mt-sm-none text-center">
                        <q-btn class="q-px-md" color="primary">Edit Profile</q-btn>
                    </div>
                    -->
                </div>
                <!-- Follower,Post,Following Count -->
                <div class="row q-mt-md text-subtitle1 q-gutter-md">
                    <div class="col-12 col-sm-auto q-my-none"><strong class="text-h6 text-primary">{{ user.followerCount }}</strong> {{ $tc("computed.followers", user.followerCount) }}</div>
                    <div class="col-12 col-sm-auto q-my-none"><strong class="text-h6 text-primary">{{ user.followingCount }}</strong> {{ $t("general.following") }}</div>
                </div>
            </q-banner>

            <!-- Profile Tab -->
            <div class="q-pa-md">
                <q-tabs v-model="tab" align="left" ref="tab" @input="tabChange">
                    <q-tab name="profile" class="q-px-lg">Profile</q-tab>
                    <q-tab name="commented" class="q-px-lg">Commented</q-tab>
                    <q-tab name="saved" class="q-px-lg">Saved</q-tab>
                </q-tabs>
                <q-tab-panels v-model="tab" animated>
                    <q-tab-panel name="profile">
                        <div class="text-h6 q-my-md">
                            {{ $t("userProfile.profile") }}
                            <div class="float-right">
                                <q-btn color="primary" @click="enterProfileEdit">{{ $t("userProfile.editProfile") }}</q-btn>
                            </div>
                        </div>
                        <q-card>
                            <q-card-section>
                                <div class="text-body1" v-if="user.description">{{ user.description }}</div>
                                <div class="text-body1 text-grey-8" v-else><i>You have not added a description yet.</i></div>
                            </q-card-section>
                        </q-card>
                    </q-tab-panel>
                    <q-tab-panel name="commented">
                        <div class="text-h6 q-my-md">Commented</div>
                        <upcoming-feature></upcoming-feature>
                    </q-tab-panel>
                    <q-tab-panel name="saved">
                        <div class="text-h6 q-my-md">Saved</div>
                        <upcoming-feature></upcoming-feature>
                    </q-tab-panel>
                </q-tab-panels>
            </div>
        </div>
    </q-page>
</template>

<script>
import { mapState } from "vuex";
import api from "../api";
import UpcomingFeature from "../components/UpcomingFeature.vue";
import UserInfoEdit from "../components/dialogs/UserInfoEdit.vue";
import { apiError } from "src/apiError";
import logger from "src/logger";
import requireLoggedIn from "src/mixins/requireLoggedIn";

export default {
    name: "Me",
    components: {
        UpcomingFeature
    },
    mixins: [requireLoggedIn],
    data() {
        return {
            author: {},
            user: {},
            loaded: false,
            tab: "profile",
        };
    },
    watch: {
        creatorTab: function(val) {
            this.fetchCreatorTab(val);
        }
    },
    methods: {
        goToAuthorPage() {
            if (this.user.isAuthor && this.user.authorId) {
                this.$router.push("/author/"+this.user.authorId);
            }
        },
        goToUserPage() {
            if (this.user.id) {
                this.$router.push("/user/"+this.user.id);
            }
        },
        enterProfileEdit() {
            this.$q.dialog({
                component: UserInfoEdit,
                parent: this,
                initialValues: {
                    username: this.user.username,
                    description: this.user.description
                }
            }).onOk((val) => {
                logger(val);
                this.$store.commit("userDataChange", {
                    username: val.username
                });
                this.init();
            });
        },
        tabChange(val) {

        },
        setData(r) {
            logger(r);
            
            if (r.isLoggedIn) {
                this.user = r.user;
                this.user.isAuthor = this.user.isAuthor == "1";
                if (this.user.isAuthor) {
                    this.author = r.author;
                }
            }
        },
        init() { // for requireLoggedIn mixin
            api.get("/user/info", {
                detailed: true
            }).catch(err => {
                apiError();
            }).then(res => {
                this.setData(res.data);
            });
        }
    },
    beforeRouteEnter (to, from, next) {
        api.get("/user/info", {
            detailed: true
        }).catch(err => {
            apiError();
            next();
        }).then(res => {
            next(vm => vm.setData(res.data));
        });
    },
    beforeRouteUpdate (to, from, next) {
        api.get("/user/info", {
            detailed: true
        }).then(res => {
            this.setData(res.data);
            next();
        });
    }
};
</script>

<style>
.noLinkStyle, .noLinkStyle:hover, .noLinkStyle:active, .noLinkStyle:visited {
  text-decoration: none;
  color: initial;
}
.creatorTabs {
    width: 150px;
}
</style>