<template>
  <WikiPageMain :site="site" :page="page" @sheetAdd="$emit('sheetAdd', $event)">
    <template #top>
      <UserInfo :site="site" :user="removePrefix(page, 'User:')"></UserInfo>
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