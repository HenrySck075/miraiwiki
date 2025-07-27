<template>
  <div class="space-y-1" v-once>
    <template v-for="line in content.content">
      <p v-if="line.type === 'paragraph'">
        <template v-for="e in line.content" v-if="line.content">
          <component 
          :is="e.marks?.find((e)=>e.type=='link') ? ULink : 'span'" 
          :to="e.marks?.find((e)=>e.type=='link')?.attrs.href"
          :style="e.marks?.find((e)=>e.type=='strong') ? 'font-weight: bold' : ''"
          >
            {{ e.text }}
          </component>
        </template>
        <br v-else>
      </p>
      <img :src="attachments.contentImages[line.attrs.id]!.url" v-else-if="line.type === 'image'">
      <a :href="attachments.openGraphs[line.attrs.id]!.url" v-else-if="line.type === 'openGraph'">
        <img :src="attachments.openGraphs[line.attrs.id]!.imageUrl">
      </a>
    </template>
  </div>
</template>



<script setup lang="ts">
import { ULink } from '#components';
import type { Attachment } from '~~/shared/types/wikia_doc';

defineProps<{
  content: DocModel,
  attachments: Attachment
}>();

</script>


<style scoped>
img {
  width: 100%;
  border-radius: 4px;
}
</style>