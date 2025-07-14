<template>
  <div class="flex w-full h-full flex-col overflow-y-hidden">
    <div class="space-x-1 p-3 flex">
      <template v-for="(tlhead, idx) in headers">
        <UDropdownMenu
        :items="tlhead.children"
        >
          <UButton
            size="lg" variant="outline" color="neutral"
          >
            {{ tlhead.label }}
          </UButton>
        </UDropdownMenu>
      </template>
      <div style="flex-grow: 1"></div>
      <UDropdownMenu :items="themeItems">
        <UButton :icon="themeItems.find((v)=>v.label == currentTheme)?.icon" variant="ghost" color="neutral"></UButton>
      </UDropdownMenu>
    </div>
    <div id="wiki_content" class="overflow-y-scroll">
      <div :class="`theme-fandomdesktop-${currentTheme.toLowerCase()} fandomdesktop-background`">
        <div class="main-container m-auto">
          <div class="fandom-community-header__background cover fullScreen" style="background-attachment: fixed; background-position: center top; background-repeat: no-repeat;"></div>
          <div class="resizable-container">
            <div class="page__main page" style="padding: 3rem">
              <div ref="themeVarsSheet">
                <template v-for="sheet in sheets">
                  <link rel="stylesheet" v-bind:href="sheet">
                </template>
              </div>
              <div v-if="tuah != null">
                <div id="page-header" class="page-header" v-once>
                  <div class="page-header__categories">
                    <span class="page-header__categories-in">in: </span>
                    <template v-for="(cat, idx) in tuah.parse.categories.slice(0, 6)">
                      <a 
                      :href="`/${route.params.site}/wiki/Category:${cat.category}`"
                      :title="`Category:${cat.category.replaceAll('_', ' ')}`"
                      >{{ cat.category.replaceAll("_", " ") }}</a>
                      <span v-if="idx < tuah.parse.categories.length - 1">, </span>
                    </template>
                    <template v-if="tuah.parse.categories.length > 6">
                       and 
                      <UPopover mode="hover">
                        <a href="#">{{ tuah.parse.categories.length-6 }} more</a>
                        <template #content>
                          <div class="flex flex-col flex-1/2 overflow-y-scroll h-96 p-4">
                            <template v-for="cat in tuah.parse.categories.slice(6)">
                              <ULink 
                              :href="`/${route.params.site}/wiki/Category:${cat.category}`"
                              :title="`Category:${cat.category.replaceAll('_', ' ')}`"
                              >{{ cat.category.replaceAll("_", " ") }}</ULink>
                            </template>
                          </div>
                        </template>
                      </UPopover>
                    </template>
                  </div>
                  <div class="page-header__bottom">
                    <div class="page-header__title-wrapper">
                      <h1 id="firstHeading" class="page-header__title" v-html="tuah.parse.displaytitle" ref="title"></h1> 
                      <div class="page-header__page-subtitle" v-if="namespacedPage()">{{page.substring(0, page.search(":"))}} page</div>
                    </div>
                  </div>
                </div>
                <div id="content" class="page-content">
                  <div v-html="tuah.parse.text" ref="content"></div>
                  <CategoryMembers v-if="page.startsWith('Category:')" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import * as cheerio from 'cheerio';
  import {Element as SElement} from 'domhandler';


  const currentTheme = useCookie("theme", {"default": ()=>"Dark", watch: "shallow"});
  const themeItems = [
    {label: "Light", icon: "material-symbols:light-mode-rounded", onSelect:()=>{currentTheme.value = "Light";}},
    {label: "Dark", icon: "material-symbols:dark-mode-rounded", onSelect:()=>{currentTheme.value = "Dark";}},
    //{label: "System"}
  ]

  
  const route = useRoute();
  const namespaces = [
    "Media",
    "Special",
    "Talk",
    "User",
    "User_talk",
    "Project",
    "Project_talk",
    "File",
    "File_talk",
    "MediaWiki",
    "MediaWiki_talk",
    "Template",
    "Template_talk",
    "Help",
    "Help_talk",
    "Category",
    "Category_talk",
    // TODO: wiki ns
  ]
  const page = (route.params.page as string[]).join("/")
  function namespacedPage() {
    return namespaces.some(ns => route.params.page[0].startsWith(`${ns}:`));
  }

  function updateTree(e: cheerio.Cheerio<SElement>) {
    e.removeAttr("srcset")
    e.removeClass("lazyload")
    if (e.is("img")) e.attr("loading", "lazy"); /*e.addClass("fancybreeze-disabledImages");*/
    for (const elem of e) {
      if (elem.tagName == "img") {
        // replace the src prefix from https:// to /wikiassets/
        // but if it has a data-src then replace that one and copy it to the src param
        const dataSrc = elem.attribs['data-src'];
        const src = elem.attribs['src'];
        if (dataSrc) {
          const newSrc = dataSrc.replace("https://", '/api/assets/');
          //e.attr('data-src', newSrc);
          elem.attribs['src'] = newSrc;
          delete elem.attribs['data-src']
        } else if (src) {
          elem.attribs["src"] = src.replace("https://", '/api/assets/');
        }
      } else if (elem.tagName == "a") {
        if (elem.attribs["href"]?.startsWith("/wiki/")) {
          /// TODO: more endpoints
          elem.attribs["href"] = elem.attribs["href"]!.replaceAll("/wiki", `/${route.params.site}/wiki`)
        } else {
          const ba = e.find(elem);
          if (ba.hasClass("mw-editsection-visualeditor")) ba.remove();
        }
      }
    }
  }
  const {data: tuah} = await useFetch(
    `/api/${route.params.site}/parse`,
    {
      query: {
        "page": page,
        "prop": "text|langlinks|categories|displaytitle|properties|parsewarnings",
      }
    }
  ).then((resp)=>{
    const data = resp.data;
    // update the image srcs
    const $ = cheerio.load(data.value.parse.text);
    const doc = $("body > div").find("img, a");
    updateTree(doc);
    data.value.parse.text = $("body > div").html();
    //console.log(data);
    return {data: data};
  })
  const {data: headers} = await useFetch(`/api/${route.params.site}/headers`)

  const sheets = [
    `/api/wikiassets/${route.params.site}/style?variant=${currentTheme.value.toLowerCase()}&type=main`,
    `/api/wikiassets/${route.params.site}/style?variant=${currentTheme.value.toLowerCase()}&type=wikiTheme`,
    `/api/wikiassets/${route.params.site}/style?variant=${currentTheme.value.toLowerCase()}&type=themeVars`,
    `https://${route.params.site}.fandom.com/load.php?mode=articles&articles=u:dev:MediaWiki:Global_Lua_Modules/Navbox.css&only=styles`,
    `https://${route.params.site}.fandom.com/load.php?mode=articles&articles=u:dev:MediaWiki:DropdownMenu.css&only=styles`,
  ]

  const content = useTemplateRef("content");
  const title = useTemplateRef("title");
  onMounted(()=>{
    content.value?.querySelectorAll("div.wds-tabber").forEach(e=> e.querySelectorAll(".wds-tabs__wrapper > .wds-tabs > li").forEach((elem, idx)=>{
      elem.addEventListener("click", (e)=>{
        // remove .wds-is-current from all .wds-tab__content
        // and add it back to the content corresponds to the index
        elem.closest(".wds-tabber")?.querySelectorAll(".wds-tab__content").forEach((tabContent, i)=>{
          if (i === idx) {
            tabContent.classList.add("wds-is-current");
          } else {
            tabContent.classList.remove("wds-is-current");
          }
        });
        // do the same to the tab buttons
        elem.closest(".wds-tabs")?.querySelectorAll("li").forEach((tabButton, i)=>{
          if (i === idx) {
            tabButton.classList.add("wds-is-current");
          } else {
            tabButton.classList.remove("wds-is-current");
          }
        });
      });
    }))

    // bind onclick to all anchor elements (that is obviously clickable) to call navigateTo
    content.value?.querySelectorAll("a").forEach((elem)=>{
      if (elem.href && !elem.href.startsWith("#")) {
        elem.addEventListener("click", (e)=>{
          e.preventDefault();
          navigateTo(elem.href.replace(location.origin, ""));
        });
      }
    });

    // remove every elements in title that is not span.mw-page-title-main
    if (title.value) {
      title.value.querySelectorAll("*").forEach((elem)=>{
        if (elem.tagName !== "SPAN" || !elem.classList.contains("mw-page-title-main")) {
          elem.remove();
        } /*else {
          // remove the mw-editsection-visualeditor class from the span
          elem.classList.remove("mw-editsection-visualeditor");
        }*/
      });
    }
  })

  const themeVarsSheet = useTemplateRef("themeVarsSheet");
  watch(currentTheme, ()=>{
    document.documentElement.className = currentTheme.value.toLowerCase();
    Array.prototype.filter.call(themeVarsSheet.value?.querySelectorAll("link[rel='stylesheet']"), (e)=>e.href.includes("wikia.php")||e.href.includes("/api/wikiassets")).forEach(
      (v)=>{v.href = v.href.replace(/variant=([a-z]*)/g, `variant=${currentTheme.value.toLowerCase()}`);}
    );
    //console.log("Theme changed to: ", currentTheme.value);
  });
</script>



<style>
.balls {
  flex-grow: 1;
}
.toc {
  max-width: 22rem;
}
.fandomdesktop-background {
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;
  background-position: center top;
}
.fancybreeze-disabledImages {
  display: none;
}
</style>