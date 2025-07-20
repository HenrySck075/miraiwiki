<template>
  <div class="!p-4 w-full bg-accented rounded-md flex flex-col space-y-2">
    <div class="flex flex-row !space-x-1" style="align-items: center;">
      <UAvatar :src="data.createdBy.avatarUrl"></UAvatar>
      <a class="align-middle" :href="`/wiki/User:${data.createdBy.name}`">{{ data.createdBy.name }}</a>
      <span class="px-1">· </span>
      {{ new Date(data.creationDate.epochSecond*1000).toLocaleDateString() }}
    </div>
    <template v-for="line in content.content">
      <span v-if="line.type==='paragraph'">
        <template v-if="line.content">{{ line.content[0].text }}</template>
      </span>
      <img 
      :src="data.attachments.contentImages[line.attrs.id].url"
      v-else-if="line.type==='image'">
      <a :href="data.attachments.openGraphs[line.attrs.id].url" v-else-if="line.type==='openGraph'">
        <img 
        :src="data.attachments.openGraphs[line.attrs.id].imageUrl"
        >
      </a>
    </template>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">

  const {data} = defineProps<{
    data: Post
  }>();
  const content: CommentContentModel = JSON.parse(data.jsonModel);
</script>