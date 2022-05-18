<template>
    <q-card class="q-ma-md">
        <q-card-section>
            <div class="text-h6">Upcoming Feature</div>
            <div class="text-subtitle2">{{version ? "Coming in v"+version : ""}}</div>
        </q-card-section>
        <q-card-section>
            <div>This feature is currently unavailable. It is on the development schedule and will be released as soon as possible.</div>
        </q-card-section>
        <q-card-actions>
            <q-btn flat @click="goToGitHub" color="accent">View Progress on GitHub</q-btn>
        </q-card-actions>
    </q-card>
</template>

<script>
export default {
    name: "UpcomingFeature",
    props: {
        version: String
    },
    methods: {
        goToGitHub() {
            location.href = "https://github.com/legendword/blog";
        }
    }
};
</script>

<style>

</style>