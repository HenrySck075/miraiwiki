<template>
  <div class="page__main page" style="padding: 2rem">
    <slot name="top"></slot>
    <div id="page-header" class="page-header" v-once>
      <a :href="`https://${route.params.site}.fandom.com/wiki/${page}`">Link to the FANDOM page</a>
      <slot name="headers"></slot>
    </div>
    <div id="content" class="page-content">
      <slot name="content"></slot>
      <CategoryMembers v-if="page.startsWith('Category:')" /> <!--Category page-->
    </div>
  </div>
</template>


<script setup lang="ts">
const route = useRoute();

const page = (route.params.page as string[]).join("/")
</script>