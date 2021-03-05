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
                        {{ $t('userProfile.notFoundMsg') }}
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
                        {{ user.username }} <q-chip v-show="user.isAuthor" color="accent" text-color="white" icon="create" clickable @click="goToAuthorPage">{{ $t('tag.author') }}</q-chip>
                    </div>
                    <q-card class="col-12 col-md-6 userStats bg-transparent row text-center">
                        <q-card-section class="col">
                            <div class="text-subtitle1 text-bold">{{ user.followingCount }}</div>
                            <div class="text-body2">{{ $t('general.following') }}</div>
                        </q-card-section>
                        <q-card-section class="col">
                            <div class="text-subtitle1 text-bold">{{ user.followerCount }}</div>
                            <div class="text-body2">{{ $tc('computed.followers', user.followerCount) }}</div>
                        </q-card-section>
                        <q-card-section class="col">
                            <div class="text-subtitle1 text-bold">0</div>
                            <div class="text-body2">{{ $tc('computed.collections', 0) }}</div>
                        </q-card-section>
                    </q-card>
                </div>
            </q-banner>
            <div class="q-pa-md">
                <q-card>
                    <q-tabs v-model="tab" align="left">
                        <q-tab name="profile" :label="$t('userProfile.profile')" class="q-px-lg" />
                        <q-tab name="collections" :label="$t('userProfile.collections')" class="q-px-lg" />
                    </q-tabs>
                    <q-tab-panels v-model="tab" animated>
                        <q-tab-panel name="profile">
                            <div>
                                <q-btn color="accent" v-show="user.isAuthor" @click="goToAuthorPage"> {{ $t('userProfile.goToAuthorPage') }} &gt; </q-btn>
                            </div>
                            <div class="text-h6 q-my-md">
                                {{ $t('userProfile.profile') }}
                                <div class="float-right">
                                    <q-btn color="primary" v-show="isCurrentUser" @click="enterProfileEdit">{{ $t('userProfile.editProfile') }}</q-btn>
                                </div>
                            </div>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit.
                            <q-banner class="bg-grey-3 q-my-md" v-show="isCurrentUser && !user.isAuthor">
                                {{ $t('compose.notAuthorMsg') }}
                                <template v-slot:action>
                                    <q-btn flat color="primary" :label="$t('compose.becomeAuthor')" @click="becomeAnAuthor" />
                                </template>
                            </q-banner>
                        </q-tab-panel>
                        <q-tab-panel name="collections">
                            <div class="text-h6 q-my-md">
                                {{ $t('userProfile.collections') }}
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
                        message: this.$t('compose.authorApplicationApproved'),
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
                this.$store.commit('setBarTitle', this.$t('barTitle.user') + ' / ' + this.user.username)
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
