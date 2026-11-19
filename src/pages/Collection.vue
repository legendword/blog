<template>
    <q-page class="q-pa-lg">
        <div class="text-h4 q-my-md word-break">{{ collection.title }}</div>
        <div class="text-subtitle1 q-my-md text-grey-8 word-break">{{ collection.description }}</div>
        <div class="collection-infoLine q-mb-lg flex items-center">
            <span class="q-pr-md">
                <q-btn color="primary" flat dense :label="collection.username" :to="'/user/'+collection.userId" />
            </span>
            <span class="q-pr-md">
                {{ $t("collection.lastUpdated")+":" }} {{ collection.updateTime ? formatTime(collection.updateTime) : "" }}
            </span>
        </div>
        <div class="row justify-between items-center q-mb-lg">
            <div class="text-h6">
                {{ collection.postCount }} {{ $t("computed.posts", Number(collection.postCount) || 0) }}
            </div>
            <div v-show="isLoggedIn && user.id == collection.userId">
                <q-btn color="accent" flat :label="$t('collection.editInfo')" @click="editCollectionInfo" />
                <q-btn color="primary" flat :label="$t('collection.editPosts')" @click="managePostMode = true" v-if="!managePostMode" />
                <q-btn color="primary" flat :label="$t('general.done')" @click="managePostMode = false" v-else />
            </div>
        </div>
        
        <q-list bordered separator v-if="managePostMode">
            <PostListSlideItem v-for="item in collection.posts" :key="item.postId" :post="item" @deletePost="deletePost(item.postId)"></PostListSlideItem>
        </q-list>
        <q-list bordered separator v-else>
            <PostListItem v-for="item in collection.posts" :key="item.postId" :post="item"></PostListItem>
        </q-list>

    </q-page>
</template>

<script>
import api from "../api";
import { formatTimeElapsed } from "../util";
import { mapState } from "pinia";
import PostListItem from "../components/PostListItem.vue";
import PostListSlideItem from "../components/PostListSlideItem.vue";
import { apiError } from "@/apiError";
import CollectionInfoEdit from "@/components/dialogs/CollectionInfoEdit.vue";
import logger from "@/logger";
import { useMainStore } from "@/stores/main";
import { createMetaMixin } from "quasar";

// response fetched in beforeRouteEnter, before the component instance exists
let preloaded = null;

export default {
    name: "Collection",
    components: {
        PostListItem,
        PostListSlideItem
    },
    mixins: [createMetaMixin(function() {
        return {
            title: this.collection.title ?? null
        };
    })],
    data() {
        return {
            collectionNotFound: false,
            collection: {
                posts: []
            },
            managePostMode: false
        };
    },
    computed: mapState(useMainStore, ["isLoggedIn", "user"]),
    methods: {
        deletePost(pid) {
            let index = this.collection.posts.findIndex(v => v.postId == pid);
            if (index == -1) return;
            api.delete("/collections/"+this.collection.id+"/posts", {
                postId: pid
            }).catch(err => {
                apiError();
            }).then(res => {
                let r = res.data;
                if (r.success) {
                    this.collection.posts.splice(index, 1);
                    this.collection.postCount -= 1;
                }
                else {
                    this.$q.notify({
                        color: "negative",
                        message: r.msg
                    });
                }
            });
        },
        editCollectionInfo() {
            this.$q.dialog({
                component: CollectionInfoEdit,
                componentProps: {
                    initialValues: {
                        title: this.collection.title,
                        description: this.collection.description,
                        isPublic: this.collection.isPublic == "1"
                    },
                    id: this.collection.id
                }
            }).onOk((val) => {
                logger(val);
                this.collection.title = val.title;
                this.collection.description = val.description;
                this.collection.isPublic = val.isPublic ? "1" : "0";
            });
        },
        formatTime(tm) {
            return formatTimeElapsed(tm);
        },
        setData(r) {
            if (r.success) {
                logger(r);
                for (let i of ["postCount", "updateTime"]) {
                    r.collection[i] = parseInt(r.collection[i]);
                }
                this.collection = r.collection;
                useMainStore().setBarTitle(this.$t("collection.title") + " / " + r.collection.title);
            }
            else {
                if (r.errorType && r.errorType == "NotFound") {
                    this.$router.replace("/404?type=collection");
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
    created() {
        if (preloaded) {
            this.setData(preloaded);
            preloaded = null;
        }
    },
    beforeRouteEnter (to) {
        // fetch before the page is shown; created() picks the result up
        return api.get("/collections/"+to.params.id).then(res => {
            preloaded = res.data;
        }, () => {
            apiError();
        });
    },
    beforeRouteUpdate (to) {
        return api.get("/collections/"+to.params.id).then(res => {
            this.setData(res.data);
        }, () => {
            apiError();
        });
    }
};
</script>

<style scoped>
.collection-infoLine {
    font-size: 16px;
}
</style>