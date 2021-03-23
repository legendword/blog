<template>
    <q-item @click="goToCollection()" clickable>
        <q-item-section>
            <q-item-label class="text-subtitle2 collectionItemTitle">{{ collection.title }}</q-item-label>
            <q-item-label caption class="collectionItemInfo">
                <span>{{ collection.postCount }} {{ $tc('computed.posts', parseInt(collection.postCount)) }}</span>
                <span v-show="showUser">{{ collection.username }}</span>
            </q-item-label>
        </q-item-section>
    </q-item>
</template>

<script>
export default {
    name: 'CollectionListItem',
    props: {
        collection: Object,
        showUser: Boolean
    },
    methods: {
        goToCollection() {
            this.$router.push('/collection/'+this.collection.id)
        }
    }
}
</script>

<style scoped>
.collectionItemTitle {
    padding-top: 10px;
    padding-bottom: 5px;
    font-size: 18px;
}
.collectionItemInfo {
    font-size: 16px;
    padding-bottom: 5px;
}
.collectionItemInfo span {
    margin-right: 10px;
}
</style>