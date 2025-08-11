<template>
  <WikiPageMain :site="site" :page="page" @sheetAdd="$emit('sheetAdd', $event)">
    <template #footer>
      <CategoryMembers v-if="page.startsWith('Category:')" />
    </template>
  </WikiPageMain>
</template>

<script setup lang="ts">
defineProps<{
  site: string,
  page: string
}>();
// Sheets handled by composable
</script>