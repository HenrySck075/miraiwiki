<template>
  <UButton icon="mdi:search" variant="ghost" color="neutral" v-if="!open" @click="open=true"/>

  <div class="w-1/4" v-else>
    <UInputMenu :arrow="false" v-model:search-term="query" v-model="m" :items="items" value-key="label" class="w-full"></UInputMenu>
  </div>
</template>

<script setup lang="ts">
  const open = ref(false);
  /// Searching (or rather, this component) usually operates on a specific site
  /// (not like we can search the whole fandom by our own anyway)
  /// if its not then we're probably on the playground so lets pick a test subject
  const site = useRoute().params.site ?? "love-live";
  type OpensearchResult = ({
    label: string, // page
    redirectedFrom: string,
    url: string
  });
  const items = ref<OpensearchResult[]>([]);
  const query = ref<string>("");
  const m = ref("");
  watch(m, (v)=>{
    navigateTo(items.value.find(item => item.label === v)?.url ?? `/${site}/search?q=${encodeURI(v)}`);
  })
  let timeoutId: string | number | NodeJS.Timeout | null = null;
  watch(query, (v)=>{
    if (timeoutId) clearTimeout(timeoutId);
    if (v === "") {
      items.value = [];
      return;
    }
    timeoutId = setTimeout(()=>{
      useFetch(
        `/api/${site}/opensearch`,
        {
          query: {
            "search": v,
            "limit": 5
          }
        }
      ).then((res)=>{
        const results: [
          string,   /// query
          string[], /// pages
          string[], /// redirects
          string[], /// urls
        ] = res.data.value;
        items.value = results[1].map((page, idx) => ({
          label: page,
          redirectedFrom: results[2][idx],
          url: results[3][idx].replace("https:/", "").replace(".fandom.com", "")
        }));
      })
    }, 400);
  })
</script>