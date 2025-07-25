<template>
  <div class="space-y-1" v-once>
    <template v-for="line in content.content">
      <p v-if="line.type === 'paragraph' && line.content">
        <template v-for="e in line.content">
          <component 
          :is="e.marks ? ULink : 'span'" 
          :to="e.marks?.[0]?.attrs.href" 
          >
            {{ e.text }}
          </component>
        </template>
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