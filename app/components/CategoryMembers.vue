<template>
  <div style="border-top: 1px solid var(--theme-border-color); padding-top: 4px;">
    <link rel="stylesheet"
      :href="`/api/wikiassets/${route.params.site}/style?variant=${theme.toLowerCase()}&type=category`">
    <span>The following {{ resp.query.pages.length }} entries are in this category, out of {{ catinfo.query.pages[0]!.categoryinfo.size }} entries total</span>
    <div class="category-page__members">
      <div class="category-page__members-wrapper" v-for="(group, char) in groupedMembers">
        <div class="category-page__first-char">{{ char }}</div>
        <ul class="category-page__members-for-char">
          <li class="category-page__member flex" v-for="cat in group">
            <div class="category-page__member-left">
              <NuxtImg v-if="cat.thumbnail" :src="cat.thumbnail.source" :width="cat.thumbnail.width"
                :height="cat.thumbnail.height" custom v-slot="{ src, isLoaded, imgAttrs }">
                <img :src="src" v-bind="imgAttrs" v-if="isLoaded" class="category-page__member-thumbnail">
                <div v-else></div>
              </NuxtImg>
            </div>
            <ULink :to="`/${route.params.site}/wiki/${cat.title.replaceAll(' ', '_')}`" style="padding-left: 12px;">{{
              cat.title }}</ULink>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useWikiFetch } from '~/composables/api';

import { computed } from 'vue';
import type { API, Query } from '~~/shared/types/actionapi';

const route = useRoute();
const page = (route.params.page as string[]).join("/");

const limit = 200;

type mambo = Query.objs.Page<[
  Query.Pages.prop.PageImages<[
    Query.Pages.prop.PageImages_thumbnail
  ]>
]>;
const { data: resp } = useWikiFetch<API.Response<[
  Query.Query<[
    Query.Pages.Pages<[
      Query.Pages.prop.PageImages<[
        Query.Pages.prop.PageImages_thumbnail
      ]>
    ]>
  ]>
]>>('/query', {
  query: {
    "generator": "categorymembers",
    "gcmtitle": page,
    "gcmlimit": limit+1,
    "gcmprop": "title",
    "prop": "pageimages",
    "piprop": "thumbnail"
  }
})
const {data:catinfo} = useWikiFetch<API.Response<[
  Query.Query<[
    Query.Pages.Pages<[
      Query.Pages.prop.CategoryInfo
    ]>
  ]>
]>>('/query', {
  query: {
    "prop": "categoryinfo",
    "titles": page,
  }
})

const theme = useCookie("theme", { default: () => "Dark" });

const groupedMembers = computed(() => {
  if (!resp.value) return {};
  const unordered = resp.value.query.pages.reduce((groups: Record<string, mambo[]>, member: mambo) => {
    let unnamespacedTitle = member.title;
    // if member.ns is not 0 then we're sure as hell everything before the first : is the namespace
    if (member.ns !== 0) {
      unnamespacedTitle = member.title.substring(member.title.indexOf(":") + 1);
    }
    const firstChar = unnamespacedTitle.charAt(0).toUpperCase();
    if (!groups[firstChar]) {
      groups[firstChar] = [];
    };
    if (member.thumbnail) {
      member.thumbnail.source = member.thumbnail.source
        .replace("https://", "http://localhost:3000/api/assets/")
        .replace(/scale-to-width-down\/\d*/g, "smart/width/40/height/30");
    }
    groups[firstChar].push(member);
    return groups;
  }, {});
  return Object.keys(unordered).sort().reduce(
    (obj, key) => {
      obj[key] = unordered[key]!;
      return obj;
    },
    <Record<string, mambo[]>>{}
  );
});

</script>