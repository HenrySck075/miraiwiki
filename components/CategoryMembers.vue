<template>
  <div>
    <link rel="stylesheet" :href="`/api/wikiassets/${route.params.site}/style?variant=${theme.toLowerCase()}&type=category`">
    <div class="category-page__members">
      <div class="category-page__members-wrapper" v-for="(group, char) in groupedMembers">
        <div class="category-page__first-char">{{ char }}</div>
        <ul class="category-page__members-for-char">
          <li class="category-page__member flex" v-for="cat in group">
            <div class="category-page__member-left">
              <NuxtImg 
                v-if="cat.thumbnail" 
                :src="cat.thumbnail.source" 
                :width="cat.thumbnail.width" 
                :height="cat.thumbnail.height"
                custom
                v-slot="{ src, isLoaded, imgAttrs }"
              >
                <img :src="src" v-bind="imgAttrs" v-if="isLoaded" class="category-page__member-thumbnail">
                <div v-else></div>
              </NuxtImg>
            </div>
            <ULink 
            :to="`/${route.params.site}/wiki/${cat.title.replaceAll(' ', '_')}`"
            style="padding-left: 12px;"
            >{{ cat.title }}</ULink>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  const route = useRoute();
  const page = (route.params.page as string[]).join("/");

  const {data: resp} = useFetch(`/api/${route.params.site}/query`, {
    query: {
      "generator": "categorymembers",
      "gcmtitle": encodeURI(page),
      "gcmlimit": "max", /// sorting problem
      "gcmprop": "title",
      "prop": "pageimages",
      "piprop": "thumbnail"
    }
  })

  const theme = useCookie("theme", {default: ()=>"Dark"});

  import { computed } from 'vue';
  type catmem = ({
    title: string,
    thumbnail?: {
      source: string,
      width: number,
      height: number
    }
  })
  const groupedMembers = computed(() => {
    if (!resp.value) return {};
    const unordered = resp.value.query.pages.reduce((groups: Record<string, catmem[]>, member:catmem) => {
      const firstChar = member.title.charAt(0).toUpperCase();
      if (!groups[firstChar]) {
        groups[firstChar] = [];
      };
      if (member.thumbnail) member.thumbnail.source = member.thumbnail.source.replace("https://", "http://localhost:3000/api/assets/");
      groups[firstChar].push(member);
      return groups;
    }, {});
    return Object.keys(unordered).sort().reduce(
      (obj, key) => { 
        obj[key] = unordered[key]; 
        return obj;
      }, 
      <Record<string, catmem[]>>{}
    );
  });

</script>