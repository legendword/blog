<template>
    <q-btn round flat color="primary" size="28" icon="o_bookmark_add" @click="load">
        <q-popup-proxy :breakpoint="500" anchor="bottom end" self="top right">
            <q-card style="width: 300px; max-width: 80vw;">
                <q-card-section>
                    <div class="text-h6 q-mb-md">{{$t("post.addToCollection")}}</div>
                    <q-list bordered separator>
                        <q-item clickable v-ripple>
                            <q-item-section class="text-primary word-break" @click="submit(-1)">+ {{$t("post.newCollection")}}</q-item-section>
                        </q-item>
                        <q-item v-for="item in list" :key="item.id" clickable v-ripple v-close-popup @click="submit(item.id)">
                            <q-item-section class="word-break">{{ item.title }}</q-item-section>
                        </q-item>
                    </q-list>
                </q-card-section>
            </q-card>
        </q-popup-proxy>
    </q-btn>
</template>

<script>
import api from "src/api";
import { apiError } from "src/apiError";
import { addToCollection, newCollection } from "src/helpers/collections";
export default {
    props: {
        postId: Number
    },
    data() {
        return {
            list: []
        };
    },
    methods: {
        load() {
            api.get("/collections/mine").catch(err => {
                apiError();
            }).then(res => {
                let r = res.data;
                if (r.success) {
                    this.list = r.collections;
                }
                else {
                    this.$q.notify({
                        color: "negative",
                        message: r.msg
                    });
                }
            });
        },
        submit(id) {
            if (id == -1) {
                newCollection().then((resolved) => {
                    if (resolved) {
                        this.load();
                    }
                }, (msg) => {
                    this.$q.notify({
                        color: "negative",
                        message: msg
                    });
                });
            }
            else {
                addToCollection(id, this.postId).then((msg) => {
                    this.$q.notify({
                        color: "positive",
                        message: msg
                    });
                }, (msg) => {
                    this.$q.notify({
                        color: "negative",
                        message: msg
                    });
                });
            }
        }
    }
};
</script>

<style>

</style>