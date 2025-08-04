<template>
  <div class="page__main page" style="padding: 2rem">
    <slot name="top"></slot>
    <div id="page-header" class="page-header" v-once>
      <a :href="`https://${route.params.site}.fandom.com/wiki/${page}`" v-if="devMode">Link to the FANDOM page</a>
      <slot name="headers"></slot>
    </div>
    <div id="content" class="page-content">
      <slot name="content"></slot>
    </div>
  </div>
</template>


<script setup lang="ts">
const route = useRoute();
const devMode = import.meta.dev;

const page = (route.params.page as string[]).join("/")
</script>