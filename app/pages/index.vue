<template>
  <div>
    <h1>About MiraiWiki</h1>
    <br>
    MiraiWiki is a reimplementation of <ULink href="https://breezewiki.com">BreezeWiki</ULink>, which 
    aims to provide slightly more features (known to be) programmatically accessible without scraping (i dont like scraping) (some of them still needs scraping),
    and a modern (but sometimes inconsistent lmao) user interface. <br/>
    Other than that: <br/>
    <h2>MiraiWiki makes wiki pages on Fandom readable</h2>
    It removes ads, videos, and suggested content, leaving you with a clean page that doesn't slow down your device or use up your data, hopefully. <br>
    To use MiraiWiki, as of now there's a little bit of work to set up compared to BreezeWiki:
    <ul class="list-disc">
      <li>Download the source code <a href="https://github.com/HenrySck075/miraiwiki">here</a></li>
      <li>Install the dependencies using any of Node.js' package managers</li>
      <li>Run the server. It will be available on localhost:3000 on the default configuration.</li>
      <li>To switch to MiraiWiki from a wiki, insert "localhost:3000" before the wiki domain (the "${wiki}.fandom.com" part)</li>
    </ul>

    <h2>Find a page</h2>
    
    <UInput v-model="sitename" placeholder="Wiki name" id="sitename-input" />
    <br/>
    <UInput v-model="pagename" placeholder="Page name" id="pagename-input" />
    <br/>
    <UButton @click="onClick2ah">Go</UButton>

    <br>
    <br>

    <h2>Testimonials</h2>
    <p class="text-green-600">&gt;hi my name is firee —firee</p>
    <p class="text-green-600">&gt;rabu raibu —GiIvaSunner</p>
    <p class="text-green-600">&gt;oh btw i moved my wiki go check it out on siivagunner.wiki —GiIvaSunner</p>
    <p class="text-green-600">&gt;I am now going to list some big names in the Geode SDK community who are actual frauds and lie directly to the community: -Cvolton: amogus —HJFod</p>
    <p class="text-green-600">&gt;attempting to go to a wiki's forum page with miraiwiki works, which is ironic and unbased honestly —Not Tom Skeleton</p>
    <Footer></Footer>
  </div>
</template>

<script setup lang="js">
const sitename = ref("");
const pagename = ref("");

function onClick2ah() {
  navigateTo(`${sitename.value}/wiki/${pagename.value}`);
}

useHead({
  title: "About | MiraiWiki",
});
useSeoMeta({
  title: "About | MiraiWiki",
  description: "A decorated better world of fan wiki platform!"
});
</script>

<style scoped>
@reference "tailwindcss";

h1 {
  @apply text-4xl;
}
h2 {
  @apply text-2xl;
}
</style>
