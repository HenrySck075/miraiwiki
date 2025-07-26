<template>
  <div class="inline-flex">
    <div class="w-1 bg-default !mr-4"></div>
    <CommentBase :data="data" class="!bg-default"></CommentBase>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  data: Post
}>();
</script>