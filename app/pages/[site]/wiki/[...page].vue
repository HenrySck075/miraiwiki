<template>
  <div id="wiki_content" v-if="hatred">
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
                        :title="`Category:${cat.category.replaceAll('_', ' ')}`">
                        {{ cat.category.replaceAll("_", " ") }}
                      </a>
                      <span v-if="idx < 6">, </span>
                    </template>
                    <template v-if="tuah.parse.categories.length > 6">
                      <template v-for="(cat, idx) in tuah.parse.categories.slice(6, 8)" v-if="tuah.parse.categories.length <= 8">
                        <a :href="`/${route.params.site}/wiki/Category:${cat.category}`"
                          :title="`Category:${cat.category.replaceAll('_', ' ')}`">
                          {{ cat.category.replaceAll("_", " ") }}
                        </a>
                        <span v-if="idx < 1">, </span>
                      </template>
                      <template v-else>
                        and
                        <UPopover mode="hover">
                          <a href="#">{{ tuah.parse.categories.length - 6 }} more</a>
                          <template #content>
                            <div class="flex flex-col flex-1/2 overflow-y-scroll h-96 p-4">
                              <template v-for="cat in tuah.parse.categories.slice(6)">
                                <ULink :href="`/${route.params.site}/wiki/Category:${cat.category}`"
                                  :title="`Category:${cat.category.replaceAll('_', ' ')}`">{{ cat.category.replaceAll("_",
                                  " ") }}
                                </ULink>
                              </template>
                            </div>
                          </template>
                        </UPopover>
                      </template>
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
            style="margin-top: 8px" ref="commentsNode" v-if="!page.startsWith('Category:')">
            <template v-if="comments">
              <span class="font-bold">
                {{ comments.totalCount }} comments
              </span>
              <template v-for="cmt in comments.threads">
                <Comment :data="cmt"></Comment>
              </template>
            </template>
          </div>
          <div class="h-96"></div>
        </div>
      </div>
    </div>
  </div>
  <span v-else>
    not doing allat
  </span>
</template>

<script setup lang="ts">
import * as cheerio from 'cheerio';
import { Element as SElement } from 'domhandler';

import { useElementVisibility } from '@vueuse/core';
import { defineCustomElement } from 'vue';
import { FAudio } from '#components';
const route = useRoute();
if ((route.params.site! as string).endsWith(".fandom.com")) {
  await navigateTo(route.fullPath.replace(".fandom.com", ""));
}

definePageMeta({
  layout: "wiki"
})

const currentTheme = useCookie("theme", { "default": () => "Dark", watch: "shallow" });

const namespaces = [
  //"Media",
  "Special",
  "Talk",
  "User",
  "User talk",
  "Project",
  "Project talk",
  "File",
  "File talk",
  "MediaWiki",
  "MediaWiki talk",
  "Template",
  "Template talk",
  "Help",
  "Help talk",
  "Category",
  "Category talk",
  // TODO: wiki ns
]
const page = (route.params.page as string[]).join("/")
function namespacedPage() {
  return namespaces.some(ns => route.params.page![0]!.startsWith(`${ns}:`));
}

const hatred = !page.startsWith("User blog:")
if (!hatred) {
  await navigateTo(`/${route.params.site}`)
}

const sheets = [
  `/api/wikiassets/${route.params.site}/style?variant=${currentTheme.value.toLowerCase()}&type=main`,
  `/api/wikiassets/${route.params.site}/style?variant=${currentTheme.value.toLowerCase()}&type=wikiTheme`,
  `/api/wikiassets/${route.params.site}/style?variant=${currentTheme.value.toLowerCase()}&type=themeVars`,
  /*
  `https://${route.params.site}.fandom.com/load.php?mode=articles&articles=u:dev:MediaWiki:Global_Lua_Modules/Navbox.css&only=styles`,
  `https://${route.params.site}.fandom.com/load.php?mode=articles&articles=u:dev:MediaWiki:DropdownMenu.css&only=styles`,
  */
];

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
    } else if (elem.tagName == "audio" && elem.attribs["src"]) {
      elem.attribs["src"] = elem.attribs["src"]!.replace("https://", '/api/assets/');
      elem.attribs["preload"] = "none";
      delete elem.attribs["width"];
      //elem.tagName = "fancybreeze-audio";
    }
  }
}
let includeWDSIcons = false;
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
  const doc = $("body > div").find("img, a, span, audio");
  updateTree(doc);
  
  const sliders = $("div.fandom-slider");
  if (sliders.length != 0) {
    sheets.push(`/api/wikiassets/${route.params.site}/style?variant=${currentTheme.value.toLowerCase()}&modules=ext.fandom.slider.css|ext.fandom.photoGallery.gallery.css`)
    sliders.find(".fandom-slider__nav__caption div:first-child").addClass("fancybreeze-slider__caption-cur");
    includeWDSIcons = true;
  }
  data.value.parse.text = $("body > div").html();
  //console.log(data);
  return { data: data };
})
const displayTitle = cheerio.load(tuah.value.parse.displaytitle, null, false)("*").text();

const content = useTemplateRef("content");
const title = useTemplateRef("title");
onMounted(() => {
  //customElements.define("fancybreeze-audio", defineCustomElement(FAudio))

  const contentNode = content.value!;

  contentNode.querySelectorAll("div.wds-tabber").forEach(e => e.querySelectorAll(".wds-tabs__wrapper > .wds-tabs > li").forEach((elem, idx) => {
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
  contentNode.querySelectorAll("a").forEach((elem) => {
    if (elem.href && !elem.href.startsWith("#")) {
      elem.addEventListener("click", (e) => {
        e.preventDefault();
        navigateTo(elem.href.replace(location.origin, ""));
      });
    }
  });

  contentNode.querySelectorAll("audio.mw-file-element").forEach((v)=>{
    (v as HTMLAudioElement).style.minWidth = (v as HTMLAudioElement).style.width;
    (v as HTMLAudioElement).style.width = ""
  })

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
  
  for (const slider of contentNode.querySelectorAll("div.fandom-slider")) {
    const sliderList: HTMLDivElement = slider.querySelector(".fandom-slider__list")!;
    const sliderCaptions = slider.querySelector(".fandom-slider__nav .fandom-slider__nav__caption")!;

    const count = sliderList.getElementsByClassName("gallerybox").length;
    let idx = 0;
    let shift = 0;
    setInterval(()=>{
      if (idx+1==count) {
        shift=0;
        idx=0;
      }
      else {
        shift+=(sliderList.querySelector(`.gallerybox[data-index="${idx}"]`)! as HTMLDivElement).offsetWidth;
        idx++;
      }
      sliderList.style.marginLeft = -(shift).toString()+"px";
      sliderCaptions.querySelector("div.fancybreeze-slider__caption-cur")!.classList.remove("fancybreeze-slider__caption-cur");
      sliderCaptions.querySelector(`div[data-index="${idx}"]`)!.classList.add("fancybreeze-slider__caption-cur")
    }, 8000)
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
  }],
  /// TODO: no mediawiki engine object we need to do this ourselves
  /*
  script: ()=>{
    return includeWDSIcons ? [
      {
        src: `/api/wikiassets/${route.params.site}/style?variant=${currentTheme.value.toLowerCase()}&modules=u:dev:MediaWiki:WDSIcons/code.js`
      }
    ] : []
  }
  */
})
useSeoMeta({
  title: `${displayTitle} | ${meta.value.sitename} | FancyBreeze`
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

.fancybreeze-slider__caption-cur {
  display: block !important;
  opacity: 1 !important;
}
</style>