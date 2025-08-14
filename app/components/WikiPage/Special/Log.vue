<template>
  <WikiPageBase>
    <template #headers>
      <WikiPageITitle page="Special:Log" :display-title-html="logTypeMap[type]!" />
    </template>
    <template #content>
      <p>Combined display of all available logs of {{ bob.site }}. You can narrow down the view by selecting a log type, the username (case-sensitive), or the affected page (also case-sensitive).</p>
      <div v-if="data">
        <ul>
          <li v-for="log in data">
            <span>
              <ULink :to="`?logid=${log.logid}`">{{ 
                // format log.timestamp as human readable datetime (hh:mm, dd month yyyy)
                new Date(log.timestamp).toLocaleString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'long', year: 'numeric' })
               }}</ULink>
            </span>
            {{ " " }}
            <span>
              <WikiPageLink :title="`User:${log.user}`">{{ log.user }}</WikiPageLink>
            </span>
          </li>
        </ul>
      </div>
    </template>
  </WikiPageBase>
</template>

<script setup lang="ts">
import { logTypeMap } from '~/composables/global_consts';
import type { API } from '~~/shared/types/actionapi';

const route = useRoute();
const type = (()=>{
  const ret = route.query["type"] as string|null ?? route.params["page"]![1] ?? "";
  return Object.keys(logTypeMap).includes(ret) ? ret : "";
})();

const r = useRoute();

const limit = ref(Number.parseInt(r.query["limit"] as string ?? "50"));

const data = ref<Query.objs.LogEvent.Everything[]>();

function joke() {
  return useWikiFetch<API.Response<[
  Query.Query<[
    Query.list.LogEvents
  ]>
]>>("/uncached/query", {
    query: {
      "list": "logevents",
      "lelimit": limit.value,
      "leprop": "ids|title|type|user|timestamp|details|parsedcomment"
    }
  }).then((v)=>data.value = v.data.value.query.logevents/*.filter((v)=>new Date(v.timestamp).getTime() >= Date.now()-days.value*8.64e+7)*/)
}

await joke();

const bob = useWikiMeta();
useSeoMeta({
  title: `${logTypeMap[type]} | ${bob.value.site} | MiraiWiki`
})

</script>
