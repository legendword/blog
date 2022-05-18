<template>
    <q-input outlined v-model="searchquery" :label="$t('search.searchbar')" @keydown="searchKeyDown">
        <template v-slot:append>
            <q-icon v-if="searchquery != ''" name="close" @click="searchquery = ''" class="cursor-pointer" />
            <q-btn color="primary" round flat icon="search" @click="search" />
        </template>
    </q-input>
</template>

<script>
export default {
    name: "SearchBar",
    props: {
        inSearchPage: Boolean,
        initialQuery: String
    },
    data() {
        return {
            searchquery: this.initialQuery ? this.initialQuery : ""
        };
    },
    methods: {
        searchKeyDown(ev) {
            if (ev.keyCode == 13) {
                ev.preventDefault();
                this.search();
            }
        },
        search() {
            if (this.searchquery.length == 0) return;
            if (this.inSearchPage) {
                this.$emit("search", this.searchquery);
            }
            else {
                this.$router.push("/search?s=" + this.searchquery);
            }
        }
    }
};
</script>