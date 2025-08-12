<template>
  <div class="flex w-full h-full flex-col overflow-y-hidden">
    <div class="space-x-1 p-3 flex">
      <template v-for="(tlhead, idx) in headers">
        <UDropdownMenu :items="tlhead.children">
          <UButton size="lg" variant="outline" color="neutral">
            {{ tlhead.label }}
          </UButton>
        </UDropdownMenu>
      </template>
      <div style="flex-grow: 1"></div>
      <UButton icon="mdi:github" to="https://github.com/HenrySck075/miraiwiki" variant="ghost" color="neutral" title="Source code"></UButton>
      <Search>
      </Search>
      <UButton @click="currentTheme = currentTheme == 'dark' ? 'light' : 'dark'" :icon="themeItems.find((v) => v.label == currentTheme)?.icon" variant="ghost" color="neutral" title="Theme"/>
    </div>
    <div id="miraiwiki-content" class="overflow-y-scroll">
      <slot></slot>
    </div>
  </div>
</template>

<style>
#miraiwiki-content > div {
  --f-max-width: 988px;
}
</style>

<script setup lang="ts">
import {load as cheerioLoad} from 'cheerio';


type mope = {
    label: string,
    to: string,
    icon?: string,
    "class"?: string,
    children?: mope[]
}

const currentTheme = useCookie("theme", { "default": () => "dark", watch: "shallow" });
const themeItems = [
  { label: "light", icon: "mdi:white-balance-sunny", onSelect: () => { currentTheme.value = "light"; } },
  { label: "dark", icon: "mdi:weather-night", onSelect: () => { currentTheme.value = "dark"; } },
  //{label: "System"}
]
const route = useRoute();
const headers = await useFetch(
  `/api/${route.params.site}/parse`,
  {
    query: {
      "page": "MediaWiki:Wiki-navigation",
      "prop": "wikitext|iwlinks"
    }
  }
).then((data) => {
  const content: string = data.data.value["parse"]["wikitext"];
  function airth(str: string): mope[] {
    const ret = [];
    for (const match of str.matchAll(/^\*([^*]+)\n((?:\*\*(?:[^\n$]*)[\n$])*)/gm)) {
      /// Subitems declaration string
      /// (with a \n as a failsafe because i cant match eol in char classes sadge)
      const cleanedSubDecl = match[2]!.replace(/^\*+/gm, (m) => m.slice(1)).trim()+"\n";
      /// obvious
      const isPlainLink = match[1]!.includes('<span class="plainlinks">')
      /// 
      const page = (match[1]!.includes('|') ? match[1]!.substring(0, match[1]!.indexOf('|')) : match[1]!).trim().replaceAll(" ", "_");
      /// the item's display label
      let label = removePrefix((match[1]!.includes('|') ? match[1]!.substring(match[1]!.indexOf('|') + 1) : match[1]!).trim(), ":");
      if (label.includes("<")) label = cheerioLoad(label, {}, false)("*").text();
      /// the url for the item
      let dest: string;
      if (isPlainLink) {
        dest = "#";
      }
      else if (/^\[[^\[\]]+\]$/.test(page)) {
        dest = page.slice(1, -1);
      } else {
        const maybeInterwikiPage = page.replace(/^\[\[|\]\]$/g, "");
        const iwlink = data.data.value["parse"]["iwlinks"].find((e: any) => e.title == maybeInterwikiPage);
        dest = iwlink ? convertURL(iwlink.url) : `/${route.params.site}/wiki/${page}`;
      }
      ret.push({
        "label": label,
        "to": cleanedSubDecl.length != 1 ? "#" : dest,
        "children": cleanedSubDecl.length != 1 ? (!isPlainLink ? [{label: label, to: dest, "class": "font-bold"}, ...airth(cleanedSubDecl)] : airth(cleanedSubDecl)) : undefined
      });
    }
    return ret
  }
  return [
    {
      label: "Explore",
      to: "#",
      children: [
        {
          label: "Main Page",
          icon: "mdi:home",
          to: "/"+route.params.site
        },
        {
          label: "Discuss",
          icon: "mdi:forum-outline",
          to: `/${route.params.site}/f`
        },
        {
          label: "All pages",
          to: `/${route.params.site}/wiki/Special:AllPages`
        }
      ]
    },
    ...airth(content)
  ];
})
</script>