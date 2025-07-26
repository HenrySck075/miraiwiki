<template>
  <WikiPageBase>
    <!--cascading slots-->
    <template #top>
      <slot name="top"></slot>
    </template>
    <template #headers>
      <template v-if="!page.startsWith('User:')">
        <div class="page-header__categories" v-if="data.parse.categories.length != 0">
          <span class="page-header__categories-in">in: </span>
          <template v-for="(cat, idx) in data.parse.categories.slice(0, 6)">
            <a :href="`/${site}/wiki/Category:${cat.category}`"
              :title="`Category:${cat.category.replaceAll('_', ' ')}`">
              {{ cat.category.replaceAll("_", " ") }}
            </a>
            <span v-if="idx < 6">, </span>
          </template>
          <template v-if="data.parse.categories.length > 6">
            <template v-for="(cat, idx) in data.parse.categories.slice(6, 8)"
              v-if="data.parse.categories.length <= 8">
              <a :href="`/${site}/wiki/Category:${cat.category}`"
                :title="`Category:${cat.category.replaceAll('_', ' ')}`">
                {{ cat.category.replaceAll("_", " ") }}
              </a>
              <span v-if="idx < 1">, </span>
            </template>
            <template v-else>
              and
              <UPopover mode="hover">
                <a href="#">{{ data.parse.categories.length - 6 }} more</a>
                <template #content>
                  <div class="flex flex-col flex-1/2 overflow-y-scroll h-96 p-4">
                    <template v-for="cat in data.parse.categories.slice(6)">
                      <ULink :href="`/${site}/wiki/Category:${cat.category}`"
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
        <WikiPageITitle :page="page" :display-title-html="data.parse.displaytitle"></WikiPageITitle>
      </template>
    </template>
    <template #content>
      <div v-html="data.parse.text" ref="content"></div>
    </template>
  </WikiPageBase>
</template>


<script setup lang="ts">

const {site, page} = defineProps<{
  site: string,
  page: string
}>();

const emit = defineEmits<{
  sheetAdd: [string]
}>();


import * as cheerio from 'cheerio';
import { Element as SElement } from 'domhandler';

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
        elem.attribs["src"] = convertAssetsURL(src);
      }
    } else if (elem.tagName == "a") {
      if (elem.attribs["href"]?.startsWith("/wiki/")) {
        /// TODO: more endpoints
        elem.attribs["href"] = elem.attribs["href"]!.replaceAll("/wiki", `/${site}/wiki`)
      }
    } else if (elem.tagName == "audio" && elem.attribs["src"]) {
      elem.attribs["src"] = elem.attribs["src"]!.replace("https://", '/api/assets/');
      elem.attribs["preload"] = "none";
      delete elem.attribs["width"];
      //elem.tagName = "fancybreeze-audio";
    }
  }
}
const currentTheme = useCookie("theme", { "default": () => "Dark", watch: "shallow" });
const { data: data } = await useFetch(
  `/api/${site}/parse`,
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
    emit("sheetAdd", `/api/wikiassets/${site}/style?variant=${currentTheme.value.toLowerCase()}&modules=ext.fandom.slider.css|ext.fandom.photoGallery.gallery.css`)
    sliders.find(".fandom-slider__nav__caption div:first-child").addClass("fancybreeze-slider__caption-cur");
    //includeWDSIcons = true;
  }
  data.value.parse.text = $("body > div").html();
  //console.log(data);
  return { data: data };
})

const content = useTemplateRef("content");
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
</script>