<template>
  <WikiPageBase>
    <template #headers>
      <WikiPageITitle page="Special:AllPages" display-title-html="All Pages" />
    </template>
    <template #content>
      <div></div>
    </template>
  </WikiPageBase>
</template>

<script setup lang="ts">
const {site} = defineProps<{site: string}>();
</script>