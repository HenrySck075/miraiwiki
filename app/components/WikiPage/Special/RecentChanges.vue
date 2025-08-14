<template>
  <WikiPageBase>
    <template #headers>
      <WikiPageITitle page="Special:RecentChanges" display-title-html="Recent changes" />
    </template>
    <template #content>
      <span>Track the most recent changes to the wiki on this page.</span>
      <div class="inline-flex w-full">
        <UButton>amogus</UButton>
        <div class="flex-1"></div>
        <UPopover>
          <UButton icon="mdi:cog-outline" color="neutral" variant="outline" class="w-46">{{ limit }} changes, {{ days }} days</UButton>
          <template #content>
            <div class="p-4">
              <h4 class="text-lg font-bold">Results to show</h4>
              <UButtonGroup>
                <template v-for="lim in [50,100,250,500,1000,2000,3000,4000]">
                  <UButton @click="limit = lim" :color="limit === lim ? 'primary' : 'neutral'" :variant="limit === lim ? 'solid' : 'outline'">{{ lim }}</UButton>
                </template>
              </UButtonGroup>
              <h4 class="text-lg font-bold mt-4">Time period to search</h4>
              <p class="text-md text-gray-500">Recent days</p>
              <UButtonGroup>
                <template v-for="lim in [1,3,7,14,30]">
                  <UButton @click="days = lim" :color="days === lim ? 'primary' : 'neutral'" :variant="days === lim ? 'solid' : 'outline'">{{ lim }}</UButton>
                </template>
              </UButtonGroup>
            </div>
          </template>
        </UPopover>
      </div>
      <WikiPageEditHistory :entries="data" v-if="data" />
      <UProgress v-else></UProgress>
    </template>
  </WikiPageBase>
</template>

<script setup lang="ts">
import { useSheets } from '#imports';
import type { API } from '~~/shared/types/actionapi';

const r = useRoute();
const limit = ref(Number.parseInt(r.query["limit"] as string ?? "50"));
const days = ref(Number.parseInt(r.query["days"] as string ?? "7"));

const data = ref<Query.objs.HistoryEntry[]>();
const amog = useRouter();

const { addSheet } = useSheets();
addSheet(`modules=mediawiki.feedlink,helplink|mediawiki.interface.helpers.styles|mediawiki.rcfilters.filters.base.styles|mediawiki.special.changeslist|mediawiki.special.changeslist.enhanced,legend|mediawiki.widgets.styles|skin.fandomdesktop.RecentChanges.css`);

function joke() {
  return useWikiFetch<API.Response<[
  Query.Query<[
    Query.list.RecentChanges
  ]>
]>>("/uncached/query", {
    query: {
      "list": "recentchanges",
      "rclimit": limit.value,
      "rcprop": "title|timestamp|ids|parsedcomment|sizes|loginfo|flags|comment|user"
    }
  }).then((v)=>data.value = v.data.value.query.recentchanges.filter((v)=>new Date(v.timestamp).getTime() >= Date.now()-days.value*8.64e+7))
}
watch([limit, days], ()=>{
  data.value = undefined;
  amog.push({
    query: {
      "limit": limit.value.toString(),
      "days": days.value.toString(),
    }
  })
  // Yes I can do {immediate: true} but it will kills hydration because of mismatches
  // should i do useState?
  joke();
});

await joke();
const bob = useWikiMeta();
useSeoMeta({
  title: `Recent changes | ${bob.value.site} | MiraiWiki`
})

</script>