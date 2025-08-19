<template>
  <WikiPageMain :site="site" :page="page" @sheetAdd="$emit('sheetAdd', $event)">
    <template #top>
      <UserInfo :site="site" :user="removePrefix(page.page, 'User:')"></UserInfo>
    </template>
  </WikiPageMain>
</template>

<script setup lang="ts">
import type { MiraiWiki } from '~~/shared/types/miraiwiki';

defineProps<{
  site: string,
  page: MiraiWiki.absymal
}>();
// Sheets handled by composable
</script>