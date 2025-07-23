<template>
  <div class="!p-4 w-full bg-elevated rounded-md flex flex-col space-y-2 overflow-hidden">
    <slot name="header"></slot>
    <div class="flex flex-row !space-x-1" style="align-items: center;">
      <UAvatar :src="data.createdBy.avatarUrl"></UAvatar>
      <div class="flex flex-col !space-y-1" style="align-items:start">
        <div>
          <a class="align-middle" :href="`/wiki/User:${data.createdBy.name}`">{{ data.createdBy.name }}</a>
          <span class="px-1">·</span>
          <span>{{ new Date(data.creationDate.epochSecond*1000).toLocaleDateString() }}</span>
        </div>
        <span class="text-gray-400">
          in {{ data.forumName }}
        </span>
      </div>
    </div>
    <ULink :href="`/${route.params.site}/f/p/${data.id}`" class="text-3xl">
      {{ data.title }}
    </ULink>
    <!--questionable content-->
    <WikiaDoc class="fancybreeze-post__content" v-if="content" :content="content" :attachments="data._embedded.attachments[0]!"></WikiaDoc>
    <span class="inline-block space-x-2" v-if="data.tags.length!=0">
      <UIcon name="material-symbols:label-rounded"></UIcon>
      <span class="inline-block">
        <template v-for="(tag, idx) in data.tags">
          <span v-if="idx!=0">, </span>
          <ULink :to="`/${route.params.site}${tag.relativeUrl}`">{{ tag.articleTitle }}</ULink>
        </template>
      </span>
    </span>
    <div class="flex flex-row space-x-4">
      <UButton class="!px-0" icon="material-symbols:favorite-outline" color="neutral" variant="link">{{ data.upvoteCount }}</UButton>
      <UButton class="!px-0" icon="material-symbols:chat-bubble-outline-rounded" color="neutral" variant="link">{{ data.postCount }}</UButton>
    </div>
    <slot name="content"></slot>
  </div>
</template>


<script setup lang="ts">
import type { Thread } from '~~/shared/types/forum/thread';
import type { DocModel } from '~~/shared/types/wikia_doc';

const route = useRoute();
const { data } = defineProps<{
  data: Thread
}>();
const content: DocModel | null = JSON.parse(data.jsonModel);
</script>