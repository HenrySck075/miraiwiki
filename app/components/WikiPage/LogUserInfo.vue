<template>
  <span class="mw-changeslist-line-inner-userLink">
    <WikiPageLink :title="`User:${user}`" :label="user" />
  </span>
  {{ " " }}
  <span>
    (<span>
      <WikiPageLink :title="`Message_Wall:${user}`" label="Message Wall" />
    </span>
    |
    <span>
      <WikiPageLink :title="`Special:Contributions/${user}`" label="contribs" />
    </span>)
  </span>
</template>

<script setup lang="ts">
defineProps<{
  user: string
}>();
</script>