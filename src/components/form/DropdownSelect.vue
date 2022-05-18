<template>
    <q-btn-dropdown :icon="icon" flat :color="color ? color : 'primary'" :label="label">
        <q-list>
            <q-item v-for="item in options" :key="item.value" clickable v-close-popup @click="$emit('input', item.value)" :active="value == item.value">
                <q-item-section>
                    <q-item-label>{{ item.label }}</q-item-label>
                </q-item-section>
            </q-item>
        </q-list>
    </q-btn-dropdown>
</template>

<script>
export default {
    model: {
        prop: "value",
        event: "input"
    },
    props: {
        icon: String,
        color: String,
        label: String,
        options: Array, // {label, value}
        value: String
    }
};
</script>

<style>

</style>