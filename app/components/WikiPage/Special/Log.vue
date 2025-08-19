<template>
  <WikiPageBase>
    <template #headers>
      <WikiPageITitle page="Special:Log" :display-title-html="logTypeMap[logtype]!" />
    </template>
    <template #content>
      <p>Combined display of all available logs of {{ bob.site }}. You can narrow down the view by selecting a log type, the username (case-sensitive), or the affected page (also case-sensitive).</p>
      <div class="border-2 rounded-2xl w-full">
        <b>Logs</b>
        <UInputMenu></UInputMenu>
      </div>
      <div v-if="data">
        <WikiPageSpecialLogNavigator v-on="navigatorEvents" v-bind="navigatorProps" />
        <ul>
          <li class="amoungus_gamers" v-for="log in data">
            <span>
              <ULink :to="`?logid=${log.logid}`">{{ 
                // format log.timestamp as human readable datetime (hh:mm, dd month yyyy)
                new Date(log.timestamp).toLocaleString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'long', year: 'numeric' })
              }}</ULink>
            </span>

            <span v-if="log.type==='newusers'">
              User account
            </span>
            <span>
              <WikiPageLink :title="`User:${log.user}`">{{ log.user }}</WikiPageLink>
            </span>
            <span>
              <span class="brackets">
                <WikiPageLink :title="`Message_Wall:${log.user}`">Message Wall</WikiPageLink>
                |
                <WikiPageLink :title="`Special:Contributions/${log.user}`">contribs</WikiPageLink>
              </span>
            </span>
            <WikiPageLogDesc :log="log" />
            <i v-if="log.parsedcomment.trim() !== ''">
              (<span v-html="log.parsedcomment"></span>)
            </i>
          </li>
        </ul>
        <WikiPageSpecialLogNavigator v-on="navigatorEvents" v-bind="navigatorProps" />
      </div>
      <UProgress v-else></UProgress>
    </template>
  </WikiPageBase>
</template>

<script setup lang="ts">
import { logTypeMap } from '~/composables/global_consts';
import type { API } from '~~/shared/types/actionapi';

const {params} = defineProps<{
  params: string[]
}>();

if (params[0]) {
  await navigateTo(`../Special:Log?type=${params[0]}`, { replace: true });
}
const route = useRoute();

const logtype = ref((route.query["type"] as string|null ?? "").trim());
if (!Object.keys(logTypeMap).includes(logtype.value)) {
  logtype.value = "";
};
const offset = ref(route.query["offset"] as string ?? "");
const limit = ref(Number.parseInt(route.query["limit"] as string ?? "50"));
let flipDirection = route.query["dir"] === "prev"; // true if dir is specified as "prev"


let updatedByYarsTrully = false;

watch(()=>route.query, (i)=>{
  // if a query change is not caused by the main watcher below (aka browser back & forward button)
  if (!updatedByYarsTrully) {
    updatedByYarsTrully = true;
    // update the refs when necessary
    logtype.value = i["type"] as string|null ?? "";
    offset.value = i["offset"] as string|null ?? "";
    limit.value = Number.parseInt(i["limit"] as string|null ?? "50");
    flipDirection = i["dir"] === "prev";
    updatedByYarsTrully = false;
  }
})

const data = shallowRef<Query.objs.LogEvent.Everything[]>();

function createOffsetId(obj: Query.objs.LogEvent.Base | undefined) {
  if (obj  === undefined) return "";
  /// yyyymmddHHMMSS
  const date = new Date(obj.timestamp);
  return `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}${String(date.getHours()).padStart(2, '0')}${String(date.getMinutes()).padStart(2, '0')}${String(date.getSeconds()).padStart(2, '0')}|${obj.logid}`;
}
async function joke() {
  data.value = undefined;
  const d = await useWikiFetch<API.Response<[
  Query.Query<[
    Query.list.LogEvents
  ]>
]>>("/uncached/query", {
    query: {
      "list": "logevents",
      ...(logtype.value !== "" && {"letype": logtype.value}),
      ...(offset.value !== "" && {"lecontinue": offset.value}),
      "ledir": flipDirection ? "newer" : "older",
      "lelimit": limit.value,
      "leprop": "ids|title|type|user|timestamp|details|parsedcomment"
    }
  });
  const ret = d.data.value.query.logevents;
  if (flipDirection) ret.reverse();
  data.value = ret;/*.filter((v)=>new Date(v.timestamp).getTime() >= Date.now()-days.value*8.64e+7)*/
}


const amog = useRouter();
watch([logtype, limit, offset], async ()=>{
  data.value = undefined;
  if (!updatedByYarsTrully) {
    updatedByYarsTrully = true;
    amog.push(`?type=${logtype.value}&limit=${limit.value}&dir=${flipDirection ? 'prev' : ''}&offset=${offset.value}`);
    updatedByYarsTrully = false;
  }
  await joke();
});

await joke();


const navigatorProps = {
  limit: limit.value,
  type: logtype.value,
  first: "",
  last: "",
  reslen: 0
}
watch([
  computed(()=>createOffsetId(data.value?.[0])),
  computed(()=>createOffsetId(data.value?.[data.value.length - 1]))
], ([f, l])=>{
  navigatorProps.limit = limit.value;
  navigatorProps.first = f;
  navigatorProps.last = l;
  navigatorProps.type = logtype.value;
  navigatorProps.reslen = data.value?.length ?? 0;
}, {immediate: true});
console.log(navigatorProps);
const navigatorEvents = {
  view: (offsetId: string, prev: boolean) => {
    console.log(offsetId);
    flipDirection = prev;
    offset.value = offsetId;
    //joke();
  },
  setLimit: (newLimit: number) => {
    limit.value = newLimit;
    //joke();
  }
}

const bob = useWikiMeta();
useSeoMeta({
  title: `${logTypeMap[logtype.value]} | ${bob.value.site} | MiraiWiki`
})

</script>

<style>
.amoungus_gamers > span::before {
  content: " ";
}
</style>