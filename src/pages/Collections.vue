<template>
    <q-page>
        <q-tabs v-model="currentMenu" inline-label class="text-black" active-color="primary" align="justify" :breakpoint="0">
            <q-tab v-for="item in menuList" :key="item.value" :name="item.value" :icon="item.icon" :label="$t('collections.menu.'+item.value)" content-class="q-px-md q-px-md-xl" />
        </q-tabs>
        <!--
        <div class="row">
            <div class="col-auto col-md-2">
                <q-list separator class="q-pr-md">
                    <q-item-label header>{{$t('collections.menuHeader')}}</q-item-label>
                    <q-item v-for="item in menuList" :key="item.value" clickable v-ripple :active="currentMenu == item.value" @click="menuChange(item.value)">
                        <q-item-section avatar>
                            <q-icon :name="item.icon" />
                        </q-item-section>
                        <q-item-section>
                            {{$t('collections.menu.'+item.value)}}
                        </q-item-section>
                    </q-item>
                </q-list>
            </div>
        </div> -->
        <q-tab-panels v-model="currentMenu" animated>
            <q-tab-panel name="browse">
                <div class="text-h5">{{$t('collections.title.browse')}}</div>
                <upcoming-feature class="q-ma-md" version="0.1.2" />
            </q-tab-panel>
            <q-tab-panel name="favorites">
                <div class="text-h5">{{$t('collections.title.favorites')}}</div>
                <upcoming-feature class="q-ma-md" version="0.2" />
            </q-tab-panel>
            <q-tab-panel name="mine">
                <div class="q-my-md flex justify-between q-mx-md">
                    <div class="text-h5">{{$t('collections.title.mine')}}</div>
                    <div>
                        <q-btn-group flat>
                            <q-btn flat color="primary" :label="$t('collections.newCollection')" icon="add" @click="newCollection" />
                        </q-btn-group>
                    </div>
                </div>
                <q-list bordered separator class="q-mx-md">
                    <q-slide-item v-for="item in list.mine" :key="item.id" @right="deleteCollection(item.id, $event)" right-color="negative" @click="goToCollection(item.id)">
                        <template v-slot:right>
                            <q-icon name="remove_circle_outline" />
                        </template>

                        <q-item>
                            <q-item-section>
                                <q-item-label class="text-subtitle2 collectionItemTitle">{{ item.title }}</q-item-label>
                                <q-item-label caption class="collectionItemInfo">{{ item.postCount }} {{ $tc('computed.posts', parseInt(item.postCount)) }}</q-item-label>
                            </q-item-section>
                        </q-item>
                    </q-slide-item>
                </q-list>
            </q-tab-panel>
        </q-tab-panels>
    </q-page>
</template>

<script>
import UpcomingFeature from 'src/components/UpcomingFeature.vue'
import api from '../api'
export default {
  components: { UpcomingFeature },
    name: 'Collections',
    data() {
        return {
            menuList: [
                {value: 'browse', icon: 'ion-compass'},
                {value: 'favorites', icon: 'ion-heart'},
                {value: 'mine', icon: 'person'},
            ],
            currentMenu: 'browse',
            list: {
                browse: [],
                favorites: [],
                mine: []
            }
        }
    },
    watch: {
        currentMenu: function(val) {
            if (this.$route.path != '/collections/'+val) {
                this.$router.replace('/collections/'+val)
            }
            this.getContent(val)
        }
    },
    methods: {
        newCollection() {
            this.$q.dialog({
                title: this.$t('collections.newCollection'),
                prompt: {
                    model: '',
                    label: this.$t('collections.newCollectionDialog.name'),
                    isValid: val => val.length > 0 && val.length <= 50,
                    type: 'text'
                },
                cancel: true,
                persistent: true
            }).onOk(val => {
                console.log(val)
                api('newcollection', {
                    title: val
                }).then(res => {
                    let r = res.data
                    if (r.success) {
                        this.getContent(this.currentMenu)
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
            })
        },
        deleteCollection(id, {reset}) {
            let index = this.list.mine.findIndex(v => v.id == id)
            if (index != -1) {
                this.$q.dialog({
                    title: this.$t('collections.deleteCollectionDialog.title'),
                    message: this.$t('collections.deleteCollectionDialog.msg'),
                    cancel: true,
                    persistent: true
                }).onOk(() => {
                    api('deletecollection', {
                        id: id
                    }).then(res => {
                        let r = res.data
                        if (r.success) {
                            reset()
                            this.list.mine.splice(index, 1)
                        }
                        else {
                            reset()
                            this.$q.notify({
                                color: 'negative',
                                message: r.msg,
                                position: 'top',
                                timeout: 2000
                            })
                        }
                    })
                }).onCancel(() => {
                    reset()
                })
            }
        },
        goToCollection(id) {
            this.$router.push('/collection/'+id)
        },
        getContent(menu) {
            if (menu == 'browse') {

            }
            else if (menu == 'favorites') {

            }
            else if (menu == 'mine') {
                //todo not logged in
                api('listcollections', {
                    type: 'mine'
                }).then(res => {
                    let r = res.data
                    if (r.success) {
                        console.log(r)
                        this.list.mine = r.collections
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
            }
        }
    },
    created() {
        let tab = this.$route.params.tab
        if (tab && this.menuList.findIndex(v => v.value == tab) != -1) {
            this.currentMenu = tab
        }
    },
    mounted() {
        this.getContent(this.currentMenu)
    }
}
</script>

<style>
.collectionItemTitle {
    padding-top: 10px;
    padding-bottom: 5px;
    font-size: 18px;
}
.collectionItemInfo {
    font-size: 16px;
    padding-bottom: 5px;
}
</style>