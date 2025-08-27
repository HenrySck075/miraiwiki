<template>
  <WikiPageBase>
    <!--cascading slots-->
    <template #top>
      <component is="script" src="/mw/startup.js"></component>
      <component is="script" :src="`/api/wikiassets/${site}/js?lang=en&modules=ext.fandom.ContentReview.legacyLoaders.js&skin=fandomdesktop&version=erl10`"></component>
      <component is="script" :src="importsUrl"></component>
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
            <span v-if="idx < 6 && idx < data.parse.categories.length-1">, </span>
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
      <slot name="footer"></slot>
    </template>
  </WikiPageBase>
</template>


<script setup lang="ts">

import { FileViewerModal } from '#components';
import * as cheerio from 'cheerio';
import { Element as SElement } from 'domhandler';

import { useSheets } from '#imports';
import type { MiraiWiki } from '~~/shared/types/miraiwiki';
import type { API, Parse} from '~~/shared/types/actionapi';

const {site, page: pageWithParams} = defineProps<{
  site: string,
  page: MiraiWiki.absymal
}>();

const imports = (await useWikiFetch<API.Response<[
  Parse.Parse<[
    Parse.prop.Wikitext
  ]>
]>>('/parse', {
  query: {
    "page": "MediaWiki:ImportJS",
    "prop": "wikitext"
  }
})).data.value.parse.wikitext.split("\n");

const route = useRoute();
const files = imports.map((file)=>file.startsWith("dev:") ? `u:dev:MediaWiki:${file.substring(file.indexOf(':')+1)}` : `MediaWiki:${file}`).join("|");
const importsUrl = `/api/wikiassets/${route.params.site}/js?modules=${files}`

const page = [pageWithParams.page, ...pageWithParams.params].join("/");

function updateTree(e: cheerio.Cheerio<SElement>) {
  e.removeAttr("srcset")
  e.removeClass("lazyload")
  e.remove(".mw-editsection");
  if (e.is("img")) e.attr("loading", "lazy"); /*e.addClass("miraiwiki-disabledImages");*/
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
      } else if (elem.attribs["href"]) {
        // try to replace (?:https://)?([a-zA-Z0-9-_]*)\.fandom\.com with /$1
        const fandomMatch = elem.attribs["href"]!.match(/^(?:https?:\/\/)?([a-zA-Z0-9-_]*)\.fandom\.com(\/.*)?$/);
        if (fandomMatch) {
          elem.attribs["href"] = `/${fandomMatch[1]}${fandomMatch[2] ?? ""}`;
        }
      }
    } else if (elem.tagName == "audio" && elem.attribs["src"]) {
      elem.attribs["src"] = elem.attribs["src"]!.replace("https://", '/api/assets/');
      elem.attribs["preload"] = "none";
      delete elem.attribs["width"];
      //elem.tagName = "miraiwiki-audio";
    }
  }
}

const currentTheme = useCookie("theme", { "default": () => "Dark", watch: "shallow" });
const { data: data } = await useWikiFetch<API.Response<[
  Parse.Parse<[
    Parse.prop.Text,
    Parse.prop.LangLinks,
    Parse.prop.Categories,
    Parse.prop.DisplayTitle,
    Parse.opts.Redirects
    //Parse.prop.Properties,
    //Parse.prop.Parsewarnings
  ]>
]>>(
  `/parse`,
  {
    query: {
      "page": page,
      "redirects": true,
      "prop": "text|langlinks|categories|displaytitle|properties|parsewarnings",
    }
  }
).then(async (resp) => {
  const data = resp.data;
  if (data.value.parse.redirects && data.value.parse.redirects[0]) {
    if (import.meta.server) {
      await navigateTo(`/${site}/wiki/${data.value.parse.redirects[0].to.replaceAll(" ", "_")}`);
    }
  }
  // update the image srcs
  const $ = cheerio.load(data.value.parse.text);
  const doc = $("body > div").find("img, a, span, audio");
  $('<button type="button" class="mw-collapsible-toggle mw-collapsible-toggle-default" aria-expanded="false" onclick="this.ariaExpanded = this.ariaExpanded === \'true\' ? \'false\' : \'true\'" tabindex="0"><span class="mw-collapsible-text"></span></button>')
  .prependTo($("body > div div.mw-collapsible, body > div table.mw-collapsible > tbody > tr:first-child > th"));
  updateTree(doc);
  const sliders = $("div.fandom-slider");
  const extraSheets = [];
  if (sliders.length != 0) {
    extraSheets.push('ext.fandom.slider.css')
    sliders.find(".fandom-slider__nav__caption div:first-child").addClass("miraiwiki-slider__caption-cur");
    //includeWDSIcons = true;
  }
  // adding stylesheets on demand

  // slideshow & gallery
  {
    const slideshowCount = $("div.wikia-slideshow").length;
    if (sliders.length != 0 || $("div.wikia-gallery").length != 0 || slideshowCount != 0) {
      extraSheets.push('ext.fandom.photoGallery.gallery.css')
    }
    if (slideshowCount != 0) {
      extraSheets.push('ext.fandom.photoGallery.slideshow.css')
    }
  }

  // balancedtabber
  {
    if ($("ul.tabs__caption").length) {
      extraSheets.push("u:dev:MediaWiki:BalancedTabber.css")
    }
  }
  if (extraSheets.length != 0) {
    const { addSheet } = useSheets();
    addSheet(`modules=${extraSheets.join("|")}`)
  }
  data.value.parse.text = $("body > div").html() as string;
  //
  return { data: data };
})

const content = useTemplateRef("content");
onMounted(() => {
  //customElements.define("miraiwiki-audio", defineCustomElement(FAudio))
  console.warn("Heads up! We'll be adding some more hydrations to the page!");
  const amogus = useRouter();
  
  // pretend that jquery exists

  const contentNode = content.value!;

  // tabber 2
  if (location.hash) {
    const hash = location.hash.replace(/^#/, "");
    contentNode.querySelectorAll("div.wds-tabber").forEach(tabber => {
      const tabs = tabber.querySelectorAll(".wds-tabs__wrapper > .wds-tabs > li");
      tabs.forEach((tab, idx) => {
        if ((tab as HTMLLIElement).dataset["hash"] === hash) {
          // Set tab button as current
          tabs.forEach((t, i) => {
            t.classList.toggle("wds-is-current", i === idx);
          });
          // Set tab content as current
          tabber.querySelectorAll(".wds-tab__content").forEach((content, i) => {
            content.classList.toggle("wds-is-current", i === idx);
          });
        }
      });
    });
  }

  // tabber
  contentNode.querySelectorAll("div.wds-tabber").forEach(e => e.querySelectorAll(".wds-tabs__wrapper > .wds-tabs > li").forEach((elem, idx) => {
    elem.addEventListener("click", (e) => {
      amogus.replace({
        // this is dangerous
        hash: "#" + (elem as HTMLLIElement).dataset["hash"]?.trim() // for some reason it always has a leading hash
      })
      // remove .wds-is-current from all .wds-tab__content
      // and add it back to the content corresponds to the index
      elem.closest(".wds-tabber")?.querySelectorAll(".wds-tab__content").forEach((tabContent, i) => {
        tabContent.classList.toggle("wds-is-current", i === idx);
      });
      // do the same to the tab buttons
      elem.closest(".wds-tabs")?.querySelectorAll("li").forEach((tabButton, i) => {
        tabButton.classList.toggle("wds-is-current", i === idx);
      });
    });
  }));

  // balancedtabber
  contentNode.querySelectorAll("ul.tabs__caption").forEach(tabber => {
    const tabs = tabber.querySelectorAll("li");
    tabs.forEach((tab, idx) => {
      tab.addEventListener("click", (e) => {
        // Set tab button as current
        tabs.forEach((t, i) => {
          t.classList.toggle("active", i === idx);
        });
        // Set tab content as current
        tabber.parentElement?.querySelectorAll("div.tabs__content").forEach((content, i) => {
          content.classList.toggle("active", i === idx);
        });
      });
    });
  });

  // idk
  contentNode.querySelectorAll("audio.mw-file-element").forEach((v)=>{
    (v as HTMLAudioElement).style.minWidth = (v as HTMLAudioElement).style.width;
  })
  
  // gallery slider
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
      sliderCaptions.querySelector("div.miraiwiki-slider__caption-cur")!.classList.remove("miraiwiki-slider__caption-cur");
      sliderCaptions.querySelector(`div[data-index="${idx}"]`)!.classList.add("miraiwiki-slider__caption-cur")
    }, 8000)
  }
  // gallery slideshow (which is simpler actually)
  // div.wikia-slideshow-wrapper
  // - wikia-slideshow-prev-next
  // - - a.wikia-slideshow-prev
  // - - a.wikia-slideshow-next
  // - div.wikia-slideshow-images-wrapper
  // - - ul.wikia-slideshow-images 
  // - - - li.wikia-slideshow-current
  // - - - li
  // - - - li
  // similar to gallery slider but without autoseek and data-index (its placed where it should be nor do we care about it)
  for (const slideshow of contentNode.querySelectorAll("div.wikia-slideshow-wrapper")) {
    const imagesWrapper = slideshow.querySelector(".wikia-slideshow-images-wrapper");
    if (!imagesWrapper) continue;
    const imagesList = imagesWrapper.querySelector("ul.wikia-slideshow-images");
    if (!imagesList) continue;
    const slides = imagesList.querySelectorAll("li");
    let currentIdx = 0;

    // Find the counter element
    const counter = slideshow.querySelector(
      "div.wikia-slideshow-toolbar > div > span.wikia-slideshow-toolbar-counter"
    );

    function showSlide(idx: number) {
      slides.forEach((slide, i) => {
        slide.classList.toggle("wikia-slideshow-current", i === idx);
      });
      currentIdx = idx;
      // Update counter text
      if (counter) {
        counter.textContent = `${idx + 1}/${slides.length}`;
      }
    }

    // Initial display
    showSlide(currentIdx);

    // Prev/Next controls
    const prevBtn = slideshow.querySelector(".wikia-slideshow-prev");
    const nextBtn = slideshow.querySelector(".wikia-slideshow-next");

    if (prevBtn) {
      prevBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const idx = (currentIdx - 1 + slides.length) % slides.length;
        showSlide(idx);
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const idx = (currentIdx + 1) % slides.length;
        showSlide(idx);
      });
    }
  }

  // file viewer modal handler
  const overlay = useOverlay();
  contentNode.querySelectorAll("figure[typeof^=\"mw:File\"], span[typeof^=\"mw:File\"], figure.pi-image, div.gallery-image-wrapper").forEach((elem) => {
    let fileName = elem.querySelector("a > img[data-image-name]")?.getAttribute("data-image-name");
    if (fileName === null) fileName = elem.querySelector("a > img[data-video-name]")?.getAttribute("data-video-name");
    if (fileName) {
      // disable anchor element from redirecting
      const anchor = elem.querySelector("a");

      if (anchor) {
        anchor.setAttribute("miraiwiki-file-viewer-hook", "");
        anchor.addEventListener("click", (e) => {
          e.preventDefault();
        });
      }

      elem.addEventListener("click", () => {
        const modal = overlay.create(FileViewerModal, {
          props: {
            file: fileName,
            site: site
          }
        });
        modal.open();
      });
    }
  });


  // bind onclick to all anchor elements (that is obviously clickable) to call navigateTo
  contentNode.querySelectorAll("a").forEach((elem) => {
    if (elem.href && !elem.href.startsWith("#") && !elem.hasAttribute("miraiwiki-file-viewer-hook")) {
      elem.addEventListener("click", (e) => {
        e.preventDefault();
        navigateTo(elem.href.replace(location.origin, ""), {external: !elem.href.includes(location.origin)});
      });
    }
  });
})
</script>

<style>
div#toc.toc ul {
  list-style-type: none !important;
  margin: 0 !important;
}
div#__nuxt.isolate #wiki_content figure[typeof^="mw:File"] > a,
div#__nuxt.isolate #wiki_content figure.pi-image > a,
div#__nuxt.isolate #wiki_content div.gallery-image-wrapper > a {
  pointer-events:none;
}


button.mw-collapsible-toggle::before {
  content: "[";
}
button.mw-collapsible-toggle::after {
  content: "]";
}

div.mw-collapsible button.mw-collapsible-toggle[aria-expanded=true] > span.mw-collapsible-text::before {
  content: "Hide";
}
div.mw-collapsible button.mw-collapsible-toggle[aria-expanded=false] > span.mw-collapsible-text::before {
  content: "Show";
}
div.mw-collapsible:has(button.mw-collapsible-toggle[aria-expanded=false]) > div.mw-collapsible-content {
  display: none;
}

table.mw-collapsible button.mw-collapsible-toggle[aria-expanded=true] > span.mw-collapsible-text::before {
  content: "Collapse";
}
table.mw-collapsible button.mw-collapsible-toggle[aria-expanded=false] > span.mw-collapsible-text::before {
  content: "Expand";
}
table.mw-collapsible:has(tbody > tr:first-child > th > button.mw-collapsible-toggle[aria-expanded=false]) > tbody > tr:last-child {
  display: none;
}

ul.wikia-slideshow-images > li {
  opacity: 0;
  transition: opacity 0.4s;
  display: none !important;
}

ul.wikia-slideshow-images > li.wikia-slideshow-current {
  opacity: 1;
  display: block !important;
  transition: opacity 0.4s;
}

.wds-tabs {
  overflow-x: auto;
}
</style>