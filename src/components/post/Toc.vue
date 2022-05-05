<template>
    <q-card class="q-ma-md q-mb-lg">
        <q-card-section class="bg-shade-light">
            <div class="text-subtitle2 q-pl-sm text-primary">Table of Contents</div>
        </q-card-section>
        <q-card-section>
            <q-tree
                :nodes="headings"
                node-key="id"
                :no-nodes-label="''"
                label-key="content"
                default-expand-all
                :selected.sync="selected"
            />
        </q-card-section>
    </q-card>
</template>

<script>
export default {
    name: 'Toc',
    props: {
        headings: Array
    },
    data() {
        return {
            selected: null
        }
    },
    watch: {
        selected(val) {
            if (val) this.$emit('select', val);
        }
    }
}
</script>

<style>

</style>