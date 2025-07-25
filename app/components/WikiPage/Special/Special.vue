<template>
  <div id="special-page">
    <component :is="getComponentForSpecialPage()" :site="site"></component>
  </div>
</template>

<script setup lang="ts">
import { WikiPageSpecialAllPages } from '#components';

const {page} = defineProps<{
  site: string,
  page: string
}>();

const specialPage = removePrefix(page,"Special:")

function getComponentForSpecialPage() {
  return specialPage === "AllPages" ? WikiPageSpecialAllPages :
  'div';
}
</script>

<style>
#special-page {
  --ui-bg: var(--widget-primary-background-color);
  --ui-bg-muted: var(--widget-frame-background-color);
  --ui-bg-elevated: var(--widget-frame-background-color);
}
</style>