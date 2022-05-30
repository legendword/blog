<template>
  <div class="text-primary text-center q-pa-md flex flex-center">
    <div>
      <div style="font-size: 30vh">
        404
      </div>

      <div class="text-h2" style="opacity:.4">
        {{ $t("fourOFour.msg") }}
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
};
</script>
