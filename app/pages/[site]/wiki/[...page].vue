<template>
  <div id="wiki_content">
    <div :class="`theme-fandomdesktop-${currentTheme.toLowerCase()} fandomdesktop-background skin-fandomdesktop`">
      <div class="main-container m-auto">
        <div class="fandom-community-header__background cover fullScreen"
          style="background-attachment: fixed; background-position: center top; background-repeat: no-repeat;"></div>
        <div class="resizable-container">
          <div class="page__main page" style="padding: 2rem">
            <div ref="themeVarsSheet">
              <template v-for="sheet in sheets">
                <link rel="stylesheet" v-bind:href="sheet">
              </template>
            </div>
            <UserInfo v-if="page.startsWith('User:')"></UserInfo>
            <div v-if="tuah != null">
              <div id="page-header" class="page-header" v-once>
                <a :href="`https://${route.params.site}.fandom.com/wiki/${page}`">Link to the FANDOM page</a>
                <template v-if="!page.startsWith('User:')">
                  <div class="page-header__categories" v-if="tuah.parse.categories.length != 0">
                    <span class="page-header__categories-in">in: </span>
                    <template v-for="(cat, idx) in tuah.parse.categories.slice(0, 6)">
                      <a :href="`/${route.params.site}/wiki/Category:${cat.category}`"
                        :title="`Category:${cat.category.replaceAll('_', ' ')}`">{{ cat.category.replaceAll("_", " ")
                        }}</a>
                      <span v-if="idx < tuah.parse.categories.length - 1">, </span>
                    </template>
                    <template v-if="tuah.parse.categories.length > 6">
                      and
                      <UPopover mode="hover">
                        <a href="#">{{ tuah.parse.categories.length - 6 }} more</a>
                        <template #content>
                          <div class="flex flex-col flex-1/2 overflow-y-scroll h-96 p-4">
                            <template v-for="cat in tuah.parse.categories.slice(6)">
                              <ULink :href="`/${route.params.site}/wiki/Category:${cat.category}`"
                                :title="`Category:${cat.category.replaceAll('_', ' ')}`">{{ cat.category.replaceAll("_",
                                "") }}
                              </ULink>
                            </template>
                          </div>
                        </template>
                      </UPopover>
                    </template>
                  </div>
                  <div class="page-header__bottom">
                    <div class="page-header__title-wrapper">
                      <h1 id="firstHeading" class="page-header__title" v-html="tuah.parse.displaytitle" ref="title">
                      </h1>
                      <div class="page-header__page-subtitle" v-if="namespacedPage()">{{ page.substring(0,
                        page.search(":")) }} page</div>
                    </div>
                  </div>
                </template>
              </div>
              <div id="content" class="page-content">
                <div v-html="tuah.parse.text" ref="content"></div>
                <CategoryMembers v-if="page.startsWith('Category:')" /> <!--Category page-->
              </div>
            </div>
          </div>
          <div id="recursion" class="min-h-12 w-full bg-elevated flex flex-col !space-y-2 rounded-md !p-4"
            style="margin-top: 8px" ref="commentsNode">
            <template v-if="comments">
              <span class="font-bold">
                {{ comments.totalCount }} comments
              </span>
              <template v-for="cmt in comments.threads">
                <Comment :data="cmt"></Comment>
              </template>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as cheerio from 'cheerio';
import { Element as SElement } from 'domhandler';

import { useElementVisibility } from '@vueuse/core';

definePageMeta({
  layout: "wiki"
})

const currentTheme = useCookie("theme", { "default": () => "Dark", watch: "shallow" });

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
  return namespaces.some(ns => route.params.page![0]!.startsWith(`${ns}:`));
}

function updateTree(e: cheerio.Cheerio<SElement>) {
  e.removeAttr("srcset")
  e.removeClass("lazyload")
  e.remove(".mw-editsection");
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
      }
    }
  }
}
const { data: tuah } = await useFetch(
  `/api/${route.params.site}/parse`,
  {
    query: {
      "page": page,
      "prop": "text|langlinks|categories|displaytitle|properties|parsewarnings",
    }
  }
).then((resp) => {
  const data = resp.data;
  // update the image srcs
  const $ = cheerio.load(data.value.parse.text);
  const doc = $("body > div").find("img, a, span");
  updateTree(doc);
  data.value.parse.text = $("body > div").html();
  //console.log(data);
  return { data: data };
})
const displayTitle = cheerio.load(tuah.value.parse.displaytitle, null, false)("*").text();

const sheets = [
  `/api/wikiassets/${route.params.site}/style?variant=${currentTheme.value.toLowerCase()}&type=main`,
  `/api/wikiassets/${route.params.site}/style?variant=${currentTheme.value.toLowerCase()}&type=wikiTheme`,
  `/api/wikiassets/${route.params.site}/style?variant=${currentTheme.value.toLowerCase()}&type=themeVars`,
  /*
  `https://${route.params.site}.fandom.com/load.php?mode=articles&articles=u:dev:MediaWiki:Global_Lua_Modules/Navbox.css&only=styles`,
  `https://${route.params.site}.fandom.com/load.php?mode=articles&articles=u:dev:MediaWiki:DropdownMenu.css&only=styles`,
  */
]

const content = useTemplateRef("content");
const title = useTemplateRef("title");
onMounted(() => {
  content.value?.querySelectorAll("div.wds-tabber").forEach(e => e.querySelectorAll(".wds-tabs__wrapper > .wds-tabs > li").forEach((elem, idx) => {
    elem.addEventListener("click", (e) => {
      // remove .wds-is-current from all .wds-tab__content
      // and add it back to the content corresponds to the index
      elem.closest(".wds-tabber")?.querySelectorAll(".wds-tab__content").forEach((tabContent, i) => {
        if (i === idx) {
          tabContent.classList.add("wds-is-current");
        } else {
          tabContent.classList.remove("wds-is-current");
        }
      });
      // do the same to the tab buttons
      elem.closest(".wds-tabs")?.querySelectorAll("li").forEach((tabButton, i) => {
        if (i === idx) {
          tabButton.classList.add("wds-is-current");
        } else {
          tabButton.classList.remove("wds-is-current");
        }
      });
    });
  }))

  // bind onclick to all anchor elements (that is obviously clickable) to call navigateTo
  content.value?.querySelectorAll("a").forEach((elem) => {
    if (elem.href && !elem.href.startsWith("#")) {
      elem.addEventListener("click", (e) => {
        e.preventDefault();
        navigateTo(elem.href.replace(location.origin, ""));
      });
    }
  });

  // remove every elements in title that is not span.mw-page-title-main
  if (title.value) {
    title.value.querySelectorAll("*").forEach((elem) => {
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
watch(currentTheme, () => {
  document.documentElement.className = currentTheme.value.toLowerCase();
  Array.prototype.filter.call(themeVarsSheet.value?.querySelectorAll("link[rel='stylesheet']"), (e) => e.href.includes("wikia.php") || e.href.includes("/api/wikiassets")).forEach(
    (v) => { v.href = v.href.replace(/variant=([a-z]*)/g, `variant=${currentTheme.value.toLowerCase()}`); }
  );
  //console.log("Theme changed to: ", currentTheme.value);
});

// https://love-live.fandom.com/wikia.php?controller=ArticleCommentsController&method=getComments&title=Hanamaru Kunikida&namespace=0&hideDeleted=true
type beef = ({
  links: any[],
  threads: Comment[],
  totalCount: number,
  readOnlyMode: boolean
});
let comments: Ref<beef | null> = ref(null);
const isCommentsVisible = useElementVisibility(useTemplateRef("commentsNode"));
watch(isCommentsVisible, async (e) => {
  if (e && comments.value == null) {
    comments.value = (await useFetch<beef>(`/api/${route.params.site}/ArticleCommentsController/getComments`, {
      query: {
        title: displayTitle,
        namespace: "0", /// TODO
        hideDeleted: true
      }
    })).data.value!
  }
});

const { data: meta } = await useFetch(`/api/${route.params.site}/meta`)
useHead({
  link: [{
    rel: "icon",
    type: 'image/x-icon',
    href: meta.value["favicon"].replace("$wgUploadPath", `https://static.wikia.nocookie.net/${route.params.site}/images`)
  }]
})
useSeoMeta({
  title: `${displayTitle} | ${meta.value.sitename} + FancyBreeze`
})
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