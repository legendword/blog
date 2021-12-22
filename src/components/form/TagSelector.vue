<template>
    <div :class="componentClass">
        <div class="text-body2 text-grey-8">Tags ({{value.length}}/{{limit}})</div>
        <div class="row inline items-center">
            <q-chip v-for="tag in value" :key="tag" removable color="primary" text-color="white" @remove="removeTag(tag)">{{tag}}</q-chip>
            <q-input class="q-pl-sm" maxlength="20" v-model="newTag" dense borderless @keydown="newTagKeydown" label="+ Add Tag">
                <template v-slot:append>
                    <q-btn class="touch-only" v-if="newTag != ''" round dense flat icon="add" color="primary" @click="addTag" />
                </template>
            </q-input>
        </div>
    </div>
</template>

<script>
export default {
    name: 'TagSelector',
    model: {
        prop: 'value',
        event: 'input'
    },
    props: {
        componentClass: String,
        limit: Number,
        value: Array
    },
    data() {
        return {
            newTag: ''
        }
    },
    methods: {
        removeTag(tag) {
            this.$emit('input', this.value.filter(v => v != tag))
        },
        addTag() {
            if (this.value.includes(this.newTag) || this.value.length == this.limit) {
                return
            }
            this.$emit('input', [...this.value, this.newTag])
            this.newTag = ''
        },
        newTagKeydown(ev) {
            if (ev.keyCode == 13) { //Enter
                this.addTag()
            }
            else if (ev.keyCode == 8) { //Backspace
                if (this.newTag.length == 0 && this.value.length > 0) {
                    this.$emit('input', this.value.filter((v, ind, arr) => ind != arr.length - 1))
                }
            }
        }
    }
}
</script>

<style>

</style>