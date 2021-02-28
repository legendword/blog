<template>
    <q-page class="q-pb-lg">
        <div v-if="userNotFound">
            <q-banner class="q-pa-lg bg-primary text-white">
                <!--
                <template v-slot:avatar>
                    <q-icon name="account_circle" color="white" />
                </template>
                -->
                <div class="row">
                    <div class="col-12 text-body1 userName q-py-sm">
                        This user does not exist.
                    </div>
                </div>
            </q-banner>
        </div>
        <div v-else>
            <q-banner class="q-pa-lg bg-primary text-white">
                <!--
                <template v-slot:avatar>
                    <q-icon name="account_circle" color="white" />
                </template>
                -->
                <div class="row">
                    <div class="col-12 col-md-6 text-h6 userName q-py-sm">
                        {{ user.username }} <q-chip v-show="user.isAuthor" color="teal" text-color="white" icon="create" clickable @click="goToAuthorPage">Author</q-chip>
                    </div>
                    <q-card class="col-12 col-md-6 userStats bg-transparent row text-center">
                        <q-card-section class="col">
                            <div class="text-subtitle1 text-bold">{{ user.followingCount }}</div>
                            <div class="text-body2">Following</div>
                        </q-card-section>
                        <q-card-section class="col">
                            <div class="text-subtitle1 text-bold">{{ user.followerCount }}</div>
                            <div class="text-body2">Followers</div>
                        </q-card-section>
                        <q-card-section class="col">
                            <div class="text-subtitle1 text-bold">0</div>
                            <div class="text-body2">Collections</div>
                        </q-card-section>
                    </q-card>
                </div>
            </q-banner>
            <div class="q-pa-md">
                <q-card>
                    <q-tabs v-model="tab" align="left">
                        <q-tab name="profile" label="Profile" class="q-px-lg" />
                        <q-tab name="collections" label="Collections" class="q-px-lg" />
                    </q-tabs>
                    <q-tab-panels v-model="tab" animated>
                        <q-tab-panel name="profile">
                            <div>
                                <q-btn color="teal" v-show="user.isAuthor" @click="goToAuthorPage"> Go To Author Page &gt; </q-btn>
                            </div>
                            <div class="text-h6 q-my-md">
                                Profile
                                <div class="float-right">
                                    <q-btn color="primary" v-show="isCurrentUser" @click="enterProfileEdit">Edit Profile</q-btn>
                                </div>
                            </div>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit.
                            <q-banner class="bg-grey-3 q-my-md" v-show="isCurrentUser && !user.isAuthor">
                                You are not an author yet! Apply to become an author so you can start creating amazing things.
                                <template v-slot:action>
                                    <q-btn flat color="primary" label="Become an Author" @click="becomeAnAuthor" />
                                </template>
                            </q-banner>
                        </q-tab-panel>
                        <q-tab-panel name="collections">
                            <div class="text-h6 q-my-md">
                                Collections
                            </div>
                            <p class="text-h5">In Development...</p>
                            <p>UserId: {{ userId }}</p>
                        </q-tab-panel>
                    </q-tab-panels>
                </q-card>
            </div>
        </div>
        <profile-edit profileMode="user" :data="currentUser" :open="openProfileEdit" @closed="openProfileEdit = false"></profile-edit>
    </q-page>
</template>

<script>
import api from '../api';
import { mapState } from 'vuex';
import ProfileEdit from '../components/ProfileEdit'
export default {
    name: 'UserProfile',
    components: {
        ProfileEdit
    },
    data() {
        return {
            user: {},
            isCurrentUser: false,
            userNotFound: false,
            tab: 'profile',
            openProfileEdit: false
        }
    },
    computed: {
        userId () {
            return this.$route.params.id
        },
        currentUser () {
            return this.$store.state.user
        }
    },
    watch: {
        currentUser: {
            handler: function(newVal) {
                if (this.isCurrentUser) {
                    for (let i in newVal) {
                        this.user[i] = newVal[i]
                    }
                }
                this.user.isAuthor = this.user.isAuthor == '1'
            },
            deep: true
        }
    },
    methods: {
        goToAuthorPage() {
            if (this.user.isAuthor && this.user.authorId) {
                this.$router.push('/author/'+this.user.authorId)
            }
        },
        becomeAnAuthor() {
            //click becomeAnAuthor
            api('authorapplication').then(res => {
                let r = res.data
                if (r.error) {
                    this.$q.notify({
                        color: 'negative',
                        message: r.msg,
                        position: 'top',
                        timeout: 2000
                    })
                }
                else if (r.success) {
                    this.$q.notify({
                        color: 'positive',
                        message: 'Your application to become an author has been approved! (alpha-testing-no-restriction)',
                        position: 'top',
                        timeout: 2000
                    })
                    this.user.isAuthor = true
                    this.user.authorId = r.authorId
                    this.$store.commit('userDataChange', {
                        isAuthor: '1'
                    })
                }
            })
        },
        enterProfileEdit() {
            this.openProfileEdit = true
        },
        setData(r) {
            this.user = {}
            this.isCurrentUser = false
            this.userNotFound = false
            if (r.error) {
                if (r.errorType) {
                    if (r.errorType == 'UserNotFound') {
                        this.userNotFound = true;
                    }
                }
                else {
                    this.$q.notify({
                        color: 'negative',
                        message: r.msg,
                        position: 'top',
                        timeout: 2000
                    })
                }
                this.$store.commit('setBarTitle')
            }
            else {
                console.log(r)
                this.user = r.user
                this.user.isAuthor = this.user.isAuthor == '1'
                this.isCurrentUser = r.isCurrentUser
                this.$store.commit('setBarTitle', 'User / '+this.user.username)
            }
        }
    },
    beforeRouteEnter (to, from, next) {
        api('userinfo', {
            id: to.params.id
        }).then(res => {
            next(vm => vm.setData(res.data))
        })
    },
    beforeRouteUpdate (to, from, next) {
        api('userinfo', {
            id: to.params.id
        }).then(res => {
            this.setData(res.data)
            next()
        })
    }
}
</script>

<style>
.userName {
    margin: auto;
}
.userStats {
    max-width: 400px;
}
</style>
