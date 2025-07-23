<template>
  <div>
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
  </div>
</template>



<script setup lang="ts">
  const {content} = defineProps<{
    content: DocModel
  }>();
</script>
