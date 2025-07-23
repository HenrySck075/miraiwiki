<template>
  <div class="inline-flex space-x-4">
    <div class="w-1 bg-default"></div>
    <CommentBase :data="data" class="!bg-default"></CommentBase>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  data: Post
}>();
</script>