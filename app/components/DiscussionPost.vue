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
    <ULink :href="`/${route.params.site}/f/p/${data.id}`" class="text-2xl" active active-class="font-bold" raw>
      {{ data.title }}
    </ULink>
    <!--questionable content-->
    <WikiaDoc class="miraiwiki-post__content" v-if="content" :content="content" :attachments="data._embedded.attachments[0]!"></WikiaDoc>
    <div v-else-if="data.poll">
      <!--Laid them out as a list of buttons if the first option doesnt have an image-->
      <div class="flex flex-col space-y-2" v-if="data.poll.answers[0]!.image==null">
        <template v-for="option in data.poll.answers">
          <UButton color="neutral" variant="outline">{{ option.text }}</UButton>
        </template>
      </div>
      <!--Laid them out as a grid of image squares otherwise-->
      <div class="grid grid-cols-2 gap-2" v-else>
        <template v-for="option in data.poll.answers">
          <UButton color="neutral" :variant="selectedOption !== option.id ? 'outline' : 'solid'" class="!p-0 flex flex-col items-center justify-center" @click="selectedOption = option.id">
            <img :src="option.image.url" class="object-cover h-full w-full rounded-md">
            <span class="text-sm">{{ option.text }}</span>
          </UButton>
        </template>
      </div>
      <div class="inline-block mt-2 space-x-2">
        <UButton :disabled="selectedOption==-1">Vote</UButton>
        <span>{{ data.poll.totalVotes }} votes in poll</span>
      </div>
    </div>
    <span class="inline-block space-x-2" v-if="data.tags.length!=0">
      <UIcon name="mdi:label"></UIcon>
      <span class="inline-block">
        <template v-for="(tag, idx) in data.tags">
          <span v-if="idx!=0">, </span>
          <ULink :to="`/${route.params.site}${tag.relativeUrl}`">{{ tag.articleTitle }}</ULink>
        </template>
      </span>
    </span>
    <div class="flex flex-row space-x-4">
      <UButton class="!px-0" icon="mdi:favorite-outline" color="neutral" variant="link">{{ data.upvoteCount }}</UButton>
      <UButton class="!px-0" icon="mdi:chat-bubble-outline" color="neutral" variant="link">{{ data.postCount }}</UButton>
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

const selectedOption = ref(-1)
</script>