<template>
  <div id="special-page">
    <component :is="getComponentForSpecialPage()" :site="site" v-if="!qpPages.includes(specialPage.toLowerCase())"></component>
    <WikiPageSpecialQPBased :type="specialPage" v-else/>
  </div>
</template>

<script setup lang="ts">
import { WikiPageSpecialAllPages, WikiPageSpecialSPList } from '#components';

const { page } = defineProps<{
  site: string,
  page: string
}>();

const specialPage = removePrefix(page, "Special:").trim()

/// meaning query pages are case-insensitive
const qpPages = [
  'allinfoboxes',
  'ancientpages',
  'brokenredirects',
  'deadendpages',
  'disambiguationpagelinks',
  'disambiguationpages',
  'doubleredirects',
  'fewestrevisions',
  'listduplicatedfiles',
  'listredirects',
  'lonelypages',
  'longpages',
  'mediastatistics',
  'mostcategories',
  'mostimages',
  'mostinterwikis',
  'mostlinked',
  'mostlinkedcategories',
  'mostlinkedtemplates',
  'mostrevisions',
  'nonportableinfoboxes',
  'shortpages',
  'uncategorizedcategories',
  'uncategorizedimages',
  'uncategorizedpages',
  'uncategorizedtemplates',
  'unorganizedtemplates',
  'unusedcategories',
  'unusedimages',
  'unusedtemplates',
  'unwatchedpages',
  'wantedcategories',
  'wantedfiles',
  'wantedpages',
  'wantedtemplates',
  'withoutimages',
  'withoutinterwiki'
]

function getComponentForSpecialPage() {
  return specialPage === "AllPages" ? WikiPageSpecialAllPages :
  specialPage === "SpecialPages" ? WikiPageSpecialSPList :
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