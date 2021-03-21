<template>
    <q-page class="q-pa-lg">
        <div v-show="collectionNotFound" class="text-center">
            <div class="text-h5 q-my-lg">Oops...</div>
            <p>{{$t('collection.notFoundMsg')}}</p>
        </div>
        <div v-show="!collectionNotFound">
            <div class="text-h4 q-my-md word-break">{{ collection.title }}</div>
            <div class="text-subtitle1 q-my-md text-grey-8 word-break">{{ collection.description }}</div>
            <div class="collection-infoLine q-mb-lg">
                <span class="q-pr-md">
                    {{ $t('collection.lastUpdated')+':' }} {{ collection.updateTime ? formatTime(collection.updateTime) : '' }}
                </span>
            </div>
            <div class="row justify-between items-center q-mb-lg">
                <div class="text-h6">
                    {{ collection.postCount }} {{ $tc('computed.posts', collection.postCount) }}
                </div>
                <div v-show="isLoggedIn && user.id == collection.userId">
                    <q-btn color="accent" flat :label="$t('collection.editInfo')" @click="editCollectionInfo" />
                    <q-btn color="primary" flat :label="$t('collection.editPosts')" @click="managePostMode = true" v-if="!managePostMode" />
                    <q-btn color="primary" flat :label="$t('general.done')" @click="managePostMode = false" v-else />

                    <q-dialog v-model="showEditInfo">
                        <q-card style="width: 700px; max-width: 80vw;">
                            <q-card-section class="row items-center q-pb-none">
                                <div class="text-h6">{{$t('collection.editInfo')}}</div>
                                <q-space />
                                <q-btn icon="close" flat round dense v-close-popup />
                            </q-card-section>
                            <q-card-section>
                                <q-input class="q-mt-sm q-mb-md" outlined v-model="editInfo.title" :label="$t('collection.editInfoDialog.title')" maxlength="50" />
                                <q-input class="q-mb-md" outlined v-model="editInfo.description" :label="$t('collection.editInfoDialog.description')" maxlength="200" autogrow />
                                <div class="q-mb-md">
                                    <q-toggle v-model="editInfo.isPublic" color="primary" :label="$t('collection.editInfoDialog.public')" />
                                </div>
                                <q-btn color="primary" :label="$t('general.save')" @click="submitCollectionInfo" />
                            </q-card-section>
                        </q-card>
                    </q-dialog>
                </div>
            </div>
            
            <q-list bordered separator v-if="managePostMode">
                <PostListSlideItem v-for="item in collection.posts" :key="item.postId" :post="item" @deletePost="deletePost(item.postId)"></PostListSlideItem>
            </q-list>
            <q-list bordered separator v-else>
                <PostListItem v-for="item in collection.posts" :key="item.postId" :post="item"></PostListItem>
            </q-list>
        </div>
    </q-page>
</template>

<script>
import api from '../api'
import { formatTimeElapsed } from '../util'
import { mapState } from 'vuex'
import PostListItem from '../components/PostListItem.vue'
import PostListSlideItem from '../components/PostListSlideItem.vue'
export default {
    name: 'Collection',
    components: {
        PostListItem,
        PostListSlideItem
    },
    data() {
        return {
            collectionNotFound: false,
            collection: {
                posts: []
            },
            showEditInfo: false,
            editInfo: {
                title: '',
                description: '',
                isPublic: true
            },
            managePostMode: false
        }
    },
    computed: mapState(['isLoggedIn', 'user']),
    methods: {
        deletePost(pid) {
            let index = this.collection.posts.findIndex(v => v.postId == pid)
            if (index == -1) return
            api('collectiondeletepost', {
                collectionId: this.collection.id,
                postId: pid
            }).then(res => {
                let r = res.data
                if (r.success) {
                    this.collection.posts.splice(index, 1)
                    this.collection.postCount -= 1
                }
                else {
                    this.$q.notify({
                        color: 'negative',
                        message: r.msg,
                        position: 'top',
                        timeout: 2000
                    })
                }
            })
        },
        submitCollectionInfo() {
            if (this.editInfo.title.length == 0) {
                this.$q.notify({
                    color: 'negative',
                    message: this.$t('collection.editInfoDialog.mustHaveTitle'),
                    position: 'top',
                    timeout: 2000
                })
            }
            api('editcollectioninfo', {
                id: this.collection.id,
                title: this.editInfo.title,
                description: this.editInfo.description ? this.editInfo.description : '',
                isPublic: this.editInfo.isPublic ? '1' : '0'
            }).then(res => {
                let r = res.data
                if (r.success) {
                    this.$q.notify({
                        color: 'positive',
                        message: this.$t('collection.editInfoDialog.updated'),
                        position: 'top',
                        timeout: 2000
                    })
                    this.updateCollectionInfo()
                }
                else {
                    this.$q.notify({
                        color: 'negative',
                        message: r.msg,
                        position: 'top',
                        timeout: 2000
                    })
                }
            })
            this.showEditInfo = false
        },
        updateCollectionInfo() {
            this.collection.title = this.editInfo.title
            this.collection.description = this.editInfo.description
            this.collection.isPublic = this.editInfo.isPublic ? '1' : '0'
        },
        editCollectionInfo() {
            this.editInfo.title = this.collection.title
            this.editInfo.description = this.collection.description
            this.editInfo.isPublic = this.collection.isPublic == '1'
            this.showEditInfo = true
        },
        formatTime(tm) {
            return formatTimeElapsed(tm)
        },
        setData(r) {
            if (r.error) {
                if (r.errorType && r.errorType == 'CollectionNotFound') {
                    this.collectionNotFound = true
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
            else if (r.success) {
                console.log(r)
                for (let i of ['postCount', 'updateTime']) {
                    r.collection[i] = parseInt(r.collection[i])
                }
                this.collection = r.collection
                this.$store.commit('setBarTitle', this.$t('collection.title') + ' / ' + r.collection.title)
            }
        }
    },
    beforeRouteEnter (to, from, next) {
        api('getcollection', {
            id: to.params.id
        }).then(res => {
            next(vm => vm.setData(res.data))
        })
    },
    beforeRouteUpdate (to, from, next) {
        api('getcollection', {
            id: to.params.id
        }).then(res => {
            this.setData(res.data)
            next()
        })
    }
}
</script>

<style scoped>
.collection-infoLine {
    font-size: 16px;
}
</style>