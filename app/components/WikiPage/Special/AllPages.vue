<template>
  <WikiPageBase>
    <template #headers>
      <WikiPageITitle page="Special:AllPages" display-title-html="All pages" />
    </template>
    <template #content>
      <div class="border-2 rounded-2xl w-4/5">
        <p class="!m-0">Display page starting at</p>
        <UInput v-model="start" class="w-full"></UInput>
        <br>
        <br>
        <p class="!m-0">...and ends at</p>
        <UInput v-model="end" class="w-full"></UInput>
        <br>
        <br>
        <p class="!m-0">Namespace</p>
        <USelectMenu v-model="nsId" :items="Object.values(namespaces)" value-key="id" label-key="name" class="w-full"></USelectMenu>
        <br>
        <UButton @click="query" class="my-2">Go</UButton>
      </div> 
      <UProgress v-if="queryExecuting"></UProgress>
      <div v-else>
        <WikiPageSpecialAllPagesNavigator :prev="prev" :next="next" :nav-prev="navPrev" :nav-next="navNext"></WikiPageSpecialAllPagesNavigator>
        <div style="columns: 22rem 3; break-inside: avoid">
          <ul class="list-disc" style="margin: 6px 0 18px 36px">
            <template v-for="page in pages">
              <li :class="page.isRedirect ? 'apredirect':''">
                <ULink :title="page.title" :href="`/${route.params.site}/wiki/${page.page}`">{{ page.title }}</ULink>
              </li>
            </template>
          </ul>
        </div>
        <!--goated name-->
        <WikiPageSpecialAllPagesNavigator :prev="prev" :next="next" :nav-prev="navPrev" :nav-next="navNext"></WikiPageSpecialAllPagesNavigator>
      </div>
    </template>
  </WikiPageBase>
</template>

<script setup lang="ts">
import { useWikiFetch } from '~/composables/api';
import type { APIResponse, Query, Query_LAllPages, Query_MSiteInfo_namespace } from '~~/shared/types/actionapi';

//const {site} = defineProps<{site: string}>();

const route = useRoute();
const start = ref((route.query["from"] as string | null)?.replaceAll("+", "") ?? "");
const end = ref((route.query["to"] as string | null)?.replaceAll("+", "") ?? "");
const prev = ref("");
const next = ref("");

function navPrev() {
  start.value = prev.value;
  end.value = '';
  return query();
}
function navNext() {
  start.value = next.value;
  end.value = '';
  return query();
}

const nsId = ref(Number.parseInt((route.query["namespace"] as string | null) ?? "0"));

const namespaces = (await useWikiFetch<
APIResponse<[
  Query<[
    Query_MSiteInfo_namespace
  ]>
]>
>('/query?meta=siteinfo&siprop=namespaces%7Cnamespacealiases')).data.value.query.namespaces;
delete namespaces["-2"]
delete namespaces["-1"]
namespaces["0"]!.name = "(Main)";


type pageinfo = {
  title: string,
  page: string,
  isRedirect: boolean,
}
const pages = ref<pageinfo[]>([]);

const limit = 345;

const queryExecuting = ref(false);
async function query() {
  queryExecuting.value = true;

  // set the page query params
  useRouter().push({
    query: {
      "from": start.value.trim().length > 0 ? start.value.replaceAll(" ", "+") : undefined,
      "to": end.value.trim().length > 0 ? end.value.replaceAll(" ", "+") : undefined,
      "namespace": nsId.value != 0 ? nsId.value.toString() : undefined
    }
  })

  const q: Record<string, string> = {
    "list": "allpages",
    "aplimit": (limit+1).toString()
  };
  if (start.value.trim().length != 0) {
    q["apfrom"] = start.value.replaceAll(" ", "+");
  }
  if (end.value.trim().length != 0) {
    q["apto"] = end.value.replaceAll(" ", "+");
  }
  if (nsId.value != 0) {
    q["apnamespace"] = nsId.value.toString();
  }
  const {data: resNR} = await useWikiFetch<
    APIResponse<[
      Query<[
        Query_LAllPages
      ]>
    ]>
  >("/query", {
    query: q
  });

  q["apfilterredir"] = "redirects";
  const {data: resR} = await useWikiFetch<
    APIResponse<[
      Query<[
        Query_LAllPages
      ]>
    ]>
  >("/query", {
    query: q
  });

  pages.value = resNR.value.query.allpages.map(p=>{
    return {
      "title": p.title,
      "isRedirect": false,
      "page": p.title.replaceAll(" ","_")
    }
  })
  let idx = -1;
  for (let i of resR.value.query.allpages) {
    // find the index of the exact entry in pages
    idx = pages.value.findIndex((c, idx2)=>idx2 > idx && c.title === i.title);
    pages.value[idx]!.isRedirect = true;
  }

  // this isnt sorted in the same order as ascending...
  prev.value = pages.value[0] ? (await useWikiFetch<
    APIResponse<[
      Query<[
        Query_LAllPages
      ]>
    ]>
  >("/query", {
    query: {
      "list": "allpages",
      "apfrom": pages.value[0]!.title,
      "aplimit": (limit+1).toString(),
      "apdir": "descending"
    }
  }).then((d)=>{
    return d.data.value.query.allpages.length > 1 ? d.data.value.query.allpages[d.data.value.query.allpages.length-1]?.title ?? "" : "";
  })) : "";
  next.value = pages.value.length > limit ? pages.value.pop()!.title : "";
  
  queryExecuting.value = false;
}

if (import.meta.server) {
  const bob = useWikiMeta();
  useSeoMeta({
    title: `All pages | ${bob.value.site} | FancyBreeze`
  })
}

await query();
</script>

<style>
.apredirect {
  font-style: italic;
}
</style>