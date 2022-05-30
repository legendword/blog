<template>
    <div class="text-primary text-center q-pa-md flex flex-center">
        <div>
            <div style="font-size: 10rem;">
                404
            </div>

            <div class="text-h4" style="opacity:.4">
                {{ type && $te(`fourOFour.customMsg.${type}`) ? $t(`fourOFour.customMsg.${type}`) : $t("fourOFour.msg") }}
            </div>

            <q-btn
                class="q-mt-xl"
                color="primary"
                unelevated
                to="/"
                :label="$t('fourOFour.goHome')"
                no-caps
            />
        </div>
    </div>
</template>

<script>
export default {
    name: "Error404",
    meta: {
        title: "404"
    },
    computed: {
        type() {
            return this.$route.query.type;
        }
    }
};
</script>
