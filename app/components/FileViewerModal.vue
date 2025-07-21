<script setup lang="ts">
const {file, site} = defineProps<{
  file: string,
  site: string
}>()

const emit = defineEmits<{ close: [] }>()

const node = useTemplateRef("hope");
const modalClasses: Ref<string[]> = ref(["file-viewer-overlay", "overlay-hidden"]);

onMounted(()=>{
  setTimeout(()=>{
    console.log(node.value);
    console.log(node.value?.parentNode);
    console.log(node.value?.parentNode?.parentNode);
    node.value?.parentNode?.parentNode?.addEventListener("mouseenter", ()=>{
      modalClasses.value.pop()
    })
    node.value?.parentNode?.parentNode?.addEventListener("mouseleave", ()=>{
      modalClasses.value.push("overlay-hidden")
    })
  }, 200)
}, )
//https://love-live.fandom.com/api.php?action=query&format=json&prop=imageinfo&titles=File%3ALL-Superstar-EP4-NHK-Airing-End-Card.png&formatversion=2&iiprop=timestamp%7Cuser%7Cextmetadata

const imgAuthor: string = await useFetch(`/api/${site}/query`, {
  query: {
    prop: "imageinfo",
    titles: `File:${file}`,
    iiprop: "user"
  }
}).then((data)=>{
  return data.data.value["query"]["pages"][0]["imageinfo"][0]["user"]
})
</script>

<template>
  <!--:close="{ onClick: () => emit('close', false) }"-->
  <UModal
    :class="modalClasses"
  >
    <template #header>
      <div class="flex flex-col !space-x-2">
        <ULink :to="`/${site}/wiki/File:${file}`" @click="emit('close')">{{ file }}</ULink>
        <span>
          Added by 
          <ULink :to="`/${site}/wiki/User:${imgAuthor}`" v-if="imgAuthor" @click="emit('close')">{{ imgAuthor }}</ULink>
          <span v-else>uhh idk hold on lemme get the data</span>
        </span>
      </div>
      <div class="flex-1"></div>
      <UButton icon="material-symbols:close" color="neutral" variant="ghost" @click="emit('close')"></UButton>
    </template>
    <template #body>
      <!--pretend its an image file for now-->
      <img :src="`/api/wikiassets/${site}/filepath/${file}`" />
      <div ref="hope"></div>
    </template>
    <!--
    <template #footer>
      <div class="flex gap-2">
        <UButton color="neutral" label="Dismiss" @click="emit('close', false)" />
        <UButton label="Success" @click="emit('close', true)" />
      </div>
    </template>
    -->
  </UModal>
</template>

<style>
.file-viewer-overlay > div:first-child {
  transition: opacity .2s ease-out;
}

.overlay-hidden > div:first-child {
  transition: opacity .6s ease-out;
  opacity: 0;
}
</style>