<template>
  <div class="w-full min-h-full overflow-y-clip">
    <div class="p-3 bg-default/60 backdrop-blur sticky top-0 z-[1000] w-full rounded-none">
      <div class="flex gap-2 ">
        <template v-for="(tlhead, idx) in headers" v-if="!isMobile">
          <UDropdownMenu :items="tlhead.children">
            <UButton size="lg" variant="outline" color="neutral" class="bg-default/0">
              {{ tlhead.label }}
            </UButton>
          </UDropdownMenu>
        </template>
        <div style="flex-grow: 1"></div>
        <UButton icon="mdi:github" to="https://github.com/HenrySck075/miraiwiki" variant="ghost" color="neutral" title="Source code"></UButton>
        <Search>
        </Search>
        <UButton @click="currentTheme = currentTheme == 'dark' ? 'light' : 'dark'" :icon="themeItems.find((v) => v.label == currentTheme)?.icon" variant="ghost" color="neutral" title="Theme"/>
        <SettingsMenu v-model="settingsDialog">
          <UButton icon="mdi:cog" variant="ghost" color="neutral" title="Settings" @click="settingsDialog = true"></UButton>
        </SettingsMenu>
        <UButton variant="ghost" color="neutral" icon="mdi:menu" @click="mobileNavOpen = !mobileNavOpen" v-if="isMobile"></UButton>
      </div>
      <WikiNav v-model:open="mobileNavOpen" :headers="headers"></WikiNav>
    </div>
    <div id="miraiwiki-content">
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
import type { API, Parse } from '~~/shared/types/actionapi';

const crack = useViewport();

const isMobile = computed(()=>crack.isLessOrEquals("tablet")) /*(typeof useCookie("mobile").value) === "string"*/;

const mobileNavOpen = ref(false);

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
const headersData = await useWikiFetch<API.Response<[
  Parse.Parse<[
    Parse.prop.Wikitext,
    Parse.prop.IWLinks
  ]>
]>>(
  '/parse',
  {
    query: {
      "page": "MediaWiki:Wiki-navigation",
      "prop": "wikitext|iwlinks"
    }
  }
);
  const content: string = headersData.data.value["parse"]["wikitext"];
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
      if (isPlainLink || page.trimStart().startsWith("#")) {
        dest = "#";
      }
      else if (/^\[[^\[\]]+\]$/.test(page)) {
        dest = page.slice(1, -1);
      } else {
        const maybeInterwikiPage = page.replace(/^\[\[|\]\]$/g, "");
        const iwlink = headersData.data.value["parse"]["iwlinks"].find((e: any) => e.title == maybeInterwikiPage);
        const deadass = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/
        dest = iwlink || deadass.test(page) ? convertURL(iwlink?.url ?? page) : `/${route.params.site}/wiki/${page}`;
      }
      ret.push({
        "label": label,
        "to": cleanedSubDecl.length != 1 ? "#" : dest,
        "children": cleanedSubDecl.length != 1 ? (!isPlainLink || dest !== "#" ? [{label: label, to: dest, "class": "font-bold"}, ...airth(cleanedSubDecl)] : airth(cleanedSubDecl)) : undefined
      });
    }
    return ret
  }
  const headers = [
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


const settingsDialog = ref(false);
</script>