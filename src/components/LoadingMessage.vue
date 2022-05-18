<template>
    <div class="q-mt-md text-center text-grey-4 loading-text">{{ $t("general.loading") }}</div>
</template>

<script>
export default {
    name: "LoadingMessage"
}
</script>

<style>
.loading-text {
    font-size: 1.15rem;
}
</style>