<template>
  <WikiPageMain :site="site" :page="page" :sheets="sheets" @sheet-add="['onUpdate:sheets']"> <!--the fuck-->
    <template #footer>
      <CategoryMembers v-if="page.startsWith('Category:')" /> <!--Category page-->
    </template>
  </WikiPageMain>
</template>

<script setup lang="ts">
defineProps<{
  site: string,
  page: string
}>();
defineModel<string[]>("sheets", {required:true});
</script>