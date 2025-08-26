<script setup lang="ts">
const gamer = defineProps<{
  file: string,
  site: string
}>()

const file = ref(gamer.file);
const site = gamer.site;

const emit = defineEmits<{ close: [] }>()

const node = useTemplateRef("hope");
const modalClasses = ref({
  "file-viewer-overlay": true,
  "overlay-hidden": false,
});

let hoverTimeout: string | number | NodeJS.Timeout | undefined;
function autohide() {
  if (hoverTimeout) clearTimeout(hoverTimeout);
  hoverTimeout = setTimeout(() => modalClasses.value["overlay-hidden"] = true, 2000);
}
onMounted(() => {
  /*
  setTimeout(() => {
    const root = node.value?.parentNode?.parentNode;
    root?.addEventListener("mouseover", () => {
      modalClasses.value["overlay-hidden"] = false;
      autohide();
    })
    root?.addEventListener("mouseenter", () => {
      modalClasses.value["overlay-hidden"] = false;
      autohide();
    })
    root?.addEventListener("mouseleave", () => {
      modalClasses.value["overlay-hidden"] = true;
    })
  }, 200)
  */
},)
//https://love-live.fandom.com/api.php?action=query&format=json&prop=imageinfo&titles=File%3ALL-Superstar-EP4-NHK-Airing-End-Card.png&formatversion=2&iiprop=timestamp%7Cuser%7Cextmetadata

type ImgInfo = {
  timestamp: string,
  user: string,
  url: string,
  descriptionurl: string,
  descriptionshorturl: string,
  metadata: Array<{
    name: string,
    value: any
  }>,
  mime: string
}
type ImgGalleryInfo = ImgInfo & {
  name: string;
}

let imgInfo = ref<ImgInfo>();
async function update() {
  imgInfo.value = await useFetch<any>(`/api/${site}/query`, {
    query: {
      prop: "imageinfo",
      titles: `File:${file.value}`,
      iiprop: "user|url|metadata|mime"
    },
    responseType: "json"
  }).then((data) => data.data.value["query"]["pages"][0]["imageinfo"][0])
}
const imgAuthor = computed(() => imgInfo.value?.["user"] ?? "");
await update();
watch(file, update);


const files: ImgGalleryInfo[] = await useFetch<any>(`/api/${site}/query`, {
  query: {
    prop: "imageinfo",
    generator: "images",
    titles: useWikiMeta().value.page,
    gimlimit: "500",
    iiprop: "user|url|metadata|mime"
  }
}).then((data) => data.data.value["query"]["pages"].map((v: any) => {return {"name": v["title"].substring(5), ...v["imageinfo"][0]}}).filter((v: ImgInfo) => v.mime.startsWith("image/") || v.mime.startsWith("video/")))

</script>

<template>
  <!--:close="{ onClick: () => emit('close', false) }" :ui="{ body: ['file-viewer-content', 'overflow-y-hidden']}"-->
  <UModal :class="modalClasses" :ui="{ body: ['file-viewer-content', 'overflow-y-hidden'] }">
    <template #title>
      <div ref="hope"></div>
      <div class="flex flex-col !space-x-2">
        <ULink :to="`/${site}/wiki/File:${file}`" @click="emit('close')">{{ file }}</ULink>
        <span>
          Added by
          <ULink :to="`/${site}/wiki/User:${imgAuthor}`" v-if="imgAuthor" @click="emit('close')">{{ imgAuthor }}</ULink>
          <span v-else>uhh idk hold on lemme get the data</span>
        </span>
      </div>
      <div class="flex-1"></div>
      <!--<UButton icon="mdi:close" color="neutral" variant="ghost" @click="emit('close')"></UButton>-->
    </template>
    <template #body v-if="imgInfo">
      <img :src="`/api/wikiassets/${site}/filepath/${file}`" v-if="imgInfo.mime !== 'video/youtube'" />
      <iframe :src="`https://youtube.com/embed/${imgInfo.metadata.find((v) => v.name === 'videoId')!.value}`"
        frameborder="0" v-else></iframe>
    </template>
    <template #footer>
      <div class="flex flex-row gap-x-4 justify-center-safe overflow-y-hidden overflow-x-scroll max-w-full">
        <template v-for="f in files">
          <img :class="{'page-images-gallery': true, 'page-images-current': f.name === file}" :src="convertAssetsURL(f.url)" @click="file = f.name" :data-name="f.name">
        </template>
      </div>
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
.file-viewer-overlay>div:first-child {
  transition: opacity .2s ease-out;
}

.overlay-hidden>div:first-child {
  transition: opacity .6s ease-out;
  opacity: 0;
}

.file-viewer-overlay {
  min-width: 90%;
  min-height: 94%;
}

.file-viewer-content {
  display: flex;
  width: 100%;
  height: 100%;
  max-height: 100%;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  position: relative;
}

.file-viewer-content> :first-child {
  min-width: 670px;
  min-height: 377px;
  display: unset;
}

.file-viewer-content>img {
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  object-fit: contain;
}

img.page-images-gallery {
  width: 70px;
  height: 60px;
  border-radius: 3px;
  object-fit:cover;
}
img.page-images-current {
  border: 2px solid var(--ui-primary);
}
</style>