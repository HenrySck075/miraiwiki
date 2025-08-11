<template>
  <WikiPageBase>
    <template #headers>
      <WikiPageITitle page="Special:RecentChanges" display-title-html="Recent changes" />
    </template>
    <template #content>
      <span>Track the most recent changes to the wiki on this page.</span>
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
const days = ref(Number.parseInt(r.query["days"] as string ?? "0"));

const data = ref<Query.objs.HistoryEntry[]>();
const amog = useRouter();

const { addSheet } = useSheets();
addSheet(`modules=mediawiki.feedlink,helplink|mediawiki.interface.helpers.styles|mediawiki.rcfilters.filters.base.styles|mediawiki.special.changeslist|mediawiki.special.changeslist.enhanced,legend|mediawiki.widgets.styles|skin.fandomdesktop.RecentChanges.css`);

function joke() {
  useWikiFetch<API.Response<[
  Query.Query<[
    Query.list.RecentChanges
  ]>
]>>("/query", {
    query: {
      "list": "recentchanges",
      "rclimit": limit,
      "rcprop": "title|timestamp|ids|parsedcomment|sizes|loginfo|flags|comment|user"
    }
  }).then((v)=>data.value = v.data.value.query.recentchanges)
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