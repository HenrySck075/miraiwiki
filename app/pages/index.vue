<template>
  <div>
    <UInput v-model="sitename" placeholder="Site" id="sitename-input" />
    <br/>
    <UInput v-model="pagename" placeholder="Page" id="pagename-input" />
    <UButton @click="onClick2ah">Go</UButton>
  </div>
</template>

<script setup lang="js">
const sitename = ref("");
const pagename = ref("");

function onClick2ah() {
  navigateTo(`${sitename.value}/wiki/${pagename.value}`);
}
</script>
