<template>
    <q-page class="q-pa-lg">
        <h5>Developer Tools</h5>
        <q-separator />
        <div>
            <q-toggle v-model="miniDrawerMode" label="miniDrawerMode" />
        </div>
    </q-page>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
    name: 'Collections',
    computed: {
        miniDrawerMode: {
            get () {
                return this.$store.state.miniDrawerMode
            },
            set (val) {
                this.setMiniDrawerMode(val)
            }
        }
    },
    methods: {
        ...mapMutations(['setMiniDrawerMode'])
    }
}
</script>

<style>

</style>