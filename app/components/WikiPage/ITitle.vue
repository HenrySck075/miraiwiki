<template>
  <div class="page-header__bottom">
    <div class="page-header__title-wrapper">
      <h1 id="firstHeading" class="page-header__title" v-html="displayTitleHtml" ref="title">
      </h1>
      <div class="page-header__page-subtitle" v-if="namespacedPage(page)">
        {{ page.substring(0, page.search(":")) }} page
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  displayTitleHtml: string,
  /// TODO: the display title element already contains the namespace
  page: string
}>();

const title = useTemplateRef("title");
onMounted(()=>{

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
</script>