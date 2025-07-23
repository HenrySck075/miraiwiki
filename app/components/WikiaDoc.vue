<template>
  <div class="space-y-1">
    <template v-for="line in content.content">
      <p v-if="line.type === 'paragraph' && line.content">
        <!--????-->
        {{ line.content[0]!.text }}
      </p>
      <img :src="attachments.contentImages[line.attrs.id]!.url" v-else-if="line.type === 'image'">
      <a :href="attachments.openGraphs[line.attrs.id]!.url" v-else-if="line.type === 'openGraph'">
        <img :src="attachments.openGraphs[line.attrs.id]!.imageUrl">
      </a>
    </template>
  </div>
</template>



<script setup lang="ts">
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