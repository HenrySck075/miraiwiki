<template>
  <WikiPageBase>
    <template #headers>
      <WikiPageITitle page="Special:AllPages" display-title-html="All Pages" />
    </template>
    <template #content>
      <div class="border-2 rounded-2xl w-full">
        <p>Display page starting at</p>
        <UInput v-model="start" class="w-4/5"></UInput>
        <br>
        <p>...and ends at</p>
        <UInput v-model="end" class="w-4/5"></UInput>
        <br>
        <p>Namespace</p>
        <USelectMenu v-model="nsId" :items="Object.values(namespaces)" value-key="id" label-key="name" class="w-4/5"></USelectMenu>
        <br>
        <UButton @click="query">Go</UButton>
      </div> 
      <div style="columns: 22rem 3; break-inside: avoid">
        <ul class="list-disc" style="margin: 6px 0 18px 36px">
          <template v-for="page in pages">
            <li :class="page.isRedirect ? 'apredirect':''">
              <ULink :title="page.title" :href="`/${route.params.site}/wiki/${page.page}`">{{ page.title }}</ULink>
            </li>
          </template>
        </ul>
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

async function query() {
  const q: Record<string, string> = {
    "list": "allpages",
    "apfilterredir": "nonredirects",
    "aplimit": "390"
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
  }).concat(resR.value.query.allpages.map(p=>{
    return {
      "title": p.title,
      "isRedirect": true,
      "page": p.title.replaceAll(" ","_")
    }
  })).toSorted((a,b)=>a.title.localeCompare(b.title));
}

await query();

</script>

<style>
.apredirect {
  font-style: italic;
}
</style>