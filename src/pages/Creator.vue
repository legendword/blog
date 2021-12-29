<template>
    <q-page class="row" v-if="loaded">
        <div class="desktop-sidebar">
            <q-list padding>
                <q-item v-for="item in tabs" :key="item" clickable v-ripple :active="tab === item" @click="tab = item" class="sidebar-item" active-class="sidebar-item active">
                    <q-item-section>
                        {{ $t('general.'+item) }}
                    </q-item-section>
                </q-item>
            </q-list>
        </div>
        <div class="col q-pa-md">
            <q-tab-panels v-model="tab">
                <q-tab-panel name="overview">
                    <div class="row text-center q-mx-none q-mx-sm-md q-mx-md-lg">
                        <div class="col-12 col-sm-6 col-md-4 q-pa-sm" v-for="stat in overview.stats" :key="stat.label">
                            <q-card flat bordered>
                                <q-card-section>
                                    <div class="text-h6 q-mb-md">{{$t('creator.stats.'+stat.label)}}</div>
                                    <div class="text-h5">{{stat.value}}</div>
                                </q-card-section>
                            </q-card>
                        </div>
                    </div>
                </q-tab-panel>
                <q-tab-panel name="posts">
                    <creator-post-list :author="author" />
                </q-tab-panel>
                <q-tab-panel name="drafts">
                    <upcoming-feature version="0.5" />
                </q-tab-panel>
            </q-tab-panels>
        </div>
    </q-page>
</template>

<script>
import api from 'src/api'
import { apiError } from 'src/apiError'
import logger from 'src/logger'
import CreatorPostList from 'src/components/lists/CreatorPostList.vue'
import UpcomingFeature from 'src/components/UpcomingFeature.vue'

const tabs = ['overview', 'posts', 'drafts']

export default {
    name: 'Creator',
    components: { CreatorPostList, UpcomingFeature },
    data() {
        return {
            tabs: tabs,
            tab: tabs.includes(this.$route.params.tab) ? this.$route.params.tab : tabs[0],
            overview: {
                stats: []
            },
            posts: {
                loading: true,
                list: []
            },
            user: {},
            author: {},
            badges: {
                comments: 0
            },
            loaded: false
        }
    },
    watch: {
        tab: {
            handler: function(val) {
                this.tabChange(val)
            }
        }
    },
    methods: {
        editPost(id) {
            logger(id)
        },
        tabChange(val) {
            let newPath = `/creator/${val}`;
            if (this.$route.path !== newPath) {
                this.$router.replace(newPath)
            }
            if (val === 'overview') {
                api.get('/authors/stats').catch(err => {
                    apiError()
                }).then(res => {
                    let r = res.data
                    logger(r)
                    if (r.success) {
                        let stats = []
                        for (let i in r.stats) {
                            stats.push({
                                label: i,
                                value: parseInt(r.stats[i])
                            })
                        }
                        this.overview.stats = stats
                    }
                    else {
                        logger(r)
                        this.$q.notify({
                            color: 'negative',
                            message: r.msg ? r.msg : r,
                        })
                    }
                })
            }
            else if (val === 'posts') {
                
            }
        },
        setData(r) {
            logger(r)
            if (r.isLoggedIn) {
                this.user = r.user
                this.user.isAuthor = this.user.isAuthor == '1'
                if (this.user.isAuthor) {
                    this.author = r.author
                    this.loaded = true
                    this.tabChange(this.tab) // trigger immediate tabChange here instead of in watch

                    api.get('/badges').then(res => {
                        let r = res.data
                        if (r.success) {
                            this.badges.comments = r.badges.comments
                            // logger(this.badges['comments'])
                        }
                    })
                }
                else {
                    this.$q.notify({ color: 'negative', message: 'You\'re not an author.' });
                }
            }
            else {
                this.$q.notify({ color: 'negative', message: 'Not Logged In' });
            }
        }
    },
    created() {
        api.get('/user/info', {
            detailed: true
        }).catch(err => {
            apiError()
        }).then(res => {
            this.setData(res.data)
        })
    }
}
</script>

<style lang="scss">
.desktop-sidebar {
    height: auto;
    width: 200px;
    min-width: 200px;
    max-width: 200px;
}
.sidebar-item {
    font-weight: 500;
}
.sidebar-item:not(.active) {
    padding-left: 21px;
}
.sidebar-item.active {
    border-left: 5px solid var(--q-color-primary);
    background: var(--shade-light);
}
</style>