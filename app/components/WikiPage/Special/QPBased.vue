<template>
  <WikiPageBase>
    <template #headers>
      <WikiPageITitle page="Special:" :display-title-html="titleAndDesc[qppage]![0]" />
    </template>
    <template #content>
      <div class="border-2 rounded-2xl w-4/5" v-if="data">
        <p class="!m-0" v-if="data.query.querypage.cached">
          The following data is cached, and was last updated {{ new Date(data.query.querypage.cachedtimestamp).toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'long', year: 'numeric' }) }}. A maximum of {{ data.query.querypage.maxresults.toLocaleString() }} results are available in the cache.
        </p>
        <p v-if="titleAndDesc[qppage]![1]">{{ titleAndDesc[qppage]![1] }}</p>
        <p>Showing below up to <strong>{{limit}}</strong> results in range <strong>#{{offset+1}}</strong> to <strong>#{{offset+data.query.querypage.results.length}}</strong>.</p>
        <WikiPageSpecialQPBasedNavigator 
          :results="data.query.querypage.results" :offset="offset" :limit="limit" 
          v-on="everybodyKnows"
        />
        <ol style="list-style-type: decimal; margin-left: 48px">
          <li v-for="res in data.query.querypage.results">
            <a :href="`./${res.title.replaceAll(' ', '_')}`" :title="res.title">{{ res.title }}</a>
          </li>
        </ol>
        <WikiPageSpecialQPBasedNavigator 
          :results="data.query.querypage.results" :offset="offset" :limit="limit" 
          v-on="everybodyKnows"
        />
      </div> 
      <UProgress v-else></UProgress>
    </template>
  </WikiPageBase>
</template>

<script setup lang="ts">
import type { API, Query } from '~~/shared/types/actionapi';

const types = [
  "AllInfoboxes",
  "Ancientpages",
  "BrokenRedirects",
  "Deadendpages",
  "DisambiguationPageLinks",
  "DisambiguationPages",
  "DoubleRedirects",
  "Fewestrevisions",
  "ListDuplicatedFiles",
  "Listredirects",
  "Lonelypages",
  "Longpages",
  "MediaStatistics",
  "Mostcategories",
  "Mostimages",
  "Mostinterwikis",
  "Mostlinked",
  "Mostlinkedcategories",
  "Mostlinkedtemplates",
  "Mostrevisions",
  "NonportableInfoboxes",
  "Shortpages",
  "Uncategorizedcategories",
  "Uncategorizedimages",
  "Uncategorizedpages",
  "Uncategorizedtemplates",
  "UnorganizedTemplates",
  "Unusedcategories",
  "Unusedimages",
  "Unusedtemplates",
  "Unwatchedpages",
  "Wantedcategories",
  "Wantedfiles",
  "Wantedpages",
  "Wantedtemplates",
  "Withoutimages",
  "Withoutinterwiki"
]
/// title and desc of qp based special pages
const titleAndDesc: Record<string, [string, string | null]> = {
  "AllInfoboxes": ["All infoboxes", "A list of all infobox templates used on the wiki."],
  "Ancientpages": ["Ancient pages", "Pages that have not been edited for the longest time."],
  "BrokenRedirects": ["Broken redirects", "Redirects that point to non-existent pages."],
  "Deadendpages": ["Dead-end pages", "Pages with no links to other pages."],
  "DisambiguationPageLinks": ["Disambiguation page links", "Pages linking to disambiguation pages."],
  "DisambiguationPages": ["Disambiguation pages", "Pages that help resolve title conflicts."],
  "DoubleRedirects": ["Double redirects", "Redirects that point to other redirects."],
  "Fewestrevisions": ["Fewest revisions", "Pages with the fewest number of revisions."],
  "ListDuplicatedFiles": ["Duplicated files", "Files that are exact duplicates of each other."],
  "Listredirects": ["List redirects", "A list of all redirect pages."],
  "Lonelypages": ["Orphaned pages", "Pages not linked from any other page."],
  "Longpages": ["Long pages", "Pages with the most content."],
  "MediaStatistics": ["Media statistics", "Statistics about files and media on the wiki."],
  "Mostcategories": ["Most categories", "Pages with the most category memberships."],
  "Mostimages": ["Most images", "Pages with the most images."],
  "Mostinterwikis": ["Most interwikis", "Pages with the most interwiki links."],
  "Mostlinked": ["Most linked pages", "Pages with the most incoming links."],
  "Mostlinkedcategories": ["Most linked categories", "Categories with the most incoming links."],
  "Mostlinkedtemplates": ["Most linked templates", "Templates with the most incoming links."],
  "Mostrevisions": ["Most revisions", "Pages with the most revisions."],
  "NonportableInfoboxes": ["Non-portable infoboxes", "Infoboxes that are not portable."],
  "Shortpages": ["Short pages", "Pages with the least content."],
  "Uncategorizedcategories": ["Uncategorized categories", "Categories not belonging to any other category."],
  "Uncategorizedimages": ["Uncategorized images", "Images not in any category."],
  "Uncategorizedpages": ["Uncategorized pages", "Pages not in any category."],
  "Uncategorizedtemplates": ["Uncategorized templates", "Templates not in any category."],
  "UnorganizedTemplates": ["Unorganized templates", "Templates not organized into categories."],
  "Unusedcategories": ["Unused categories", "Categories not used by any page."],
  "Unusedimages": ["Unused images", "Images not used on any page."],
  "Unusedtemplates": ["Unused templates", "Templates not used on any page."],
  "Unwatchedpages": ["Unwatched pages", "Pages not watched by any user."],
  "Wantedcategories": ["Wanted categories", "Categories that are linked to but do not exist."],
  "Wantedfiles": ["Wanted files", "Files that are linked to but do not exist."],
  "Wantedpages": ["Wanted pages", "Pages that are linked to but do not exist."],
  "Wantedtemplates": ["Wanted templates", "Templates that are linked to but do not exist."],
  "Withoutimages": ["Pages without images", "Pages that do not contain any images."],
  "Withoutinterwiki": ["Pages without interwiki", "Pages that do not have interwiki links."]
}
const { type } = defineProps<{
  type: string
}>();
const r = useRoute();
const limit = ref(Number.parseInt(r.query["limit"] as string ?? "50"));
const offset = ref(Number.parseInt(r.query["offset"] as string ?? "0"));
const typelc = type.toLowerCase();
const qppage = types.find((v) => v.toLowerCase() == typelc)!;

const everybodyKnows = {
  prev:()=>offset.value = Math.max(offset.value-limit.value, 0) , next:()=>offset.value = Math.min(offset.value+limit.value, data.value!.query.querypage.maxresults), "set-limit":(l:number)=>limit.value=l
}

type macaroni = API.Response<[
  Query.Query<[
    Query.list.QueryPage
  ]>
]>;
const data = ref<macaroni>();
const amog = useRouter();
watch([limit, offset], ()=>{
  data.value = undefined;
  amog.push({
    query: {
      "limit": limit.value.toString(),
      "offset": offset.value.toString(),
    }
  })
  useWikiFetch<macaroni>("/query", {
    query: {
      "list": "querypage",
      "qppage": qppage,
      "qplimit": limit,
      "qpoffset": offset
    }
  }).then((v)=>data.value = v.data.value);
});
data.value = await useWikiFetch<macaroni>("/query", {
  query: {
    "list": "querypage",
    "qppage": qppage,
    "qplimit": limit,
    "qpoffset": offset
  }
}).then((v)=>v.data.value)

const bob = useWikiMeta();
useSeoMeta({
  title: `${titleAndDesc[qppage]![0]} | ${bob.value.site} | MiraiWiki`
})
</script>