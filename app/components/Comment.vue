<template>
  <CommentBase :data="data.firstPost">
    <div class="flex flex-col !space-y-2 !mt-2" v-if="data.posts.length != 0">
      <template v-for="reply in data.posts">
        <Reply :data="reply"></Reply>
      </template>
    </div>
  </CommentBase>
</template>

<script setup lang="ts">

  const {data} = defineProps<{
    data: WikiaComment
  }>();
</script>