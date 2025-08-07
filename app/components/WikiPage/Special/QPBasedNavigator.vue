<template>
  <p>
    <span>View (</span>
      <a v-if="offset > 0" @click.prevent="$emit('prev')" :href="queryParams(Math.max(offset-limit, 0), limit)">previous {{limit}}</a>
      <span v-else>previous {{limit}}</span>
      <span> | </span>
      <a v-if="results.length >= limit" @click.prevent.stop="$emit('next')" :href="queryParams(offset+limit, limit)">next {{limit}}</a>
      <span v-else>next {{limit}}</span>
    <span>) (</span>
      <template v-for="(l, idx) in [20, 50, 100, 250, 500]">
        <a v-if="l !== limit" @click.prevent.stop="$emit('setLimit', l)" :href="queryParams(offset, l)">{{l}}</a>
        <span v-else>{{l}}</span>
        <span v-if="idx<4"> | </span>
      </template>
    <span>)</span>
  </p>
</template>


<script setup lang="ts">
defineProps<{
  results: {
    value: string;
    ns: number;
    title: string;
  }[],
  offset: number,
  limit: number,
}>();

defineEmits<{
  (e: 'prev'): void
  (e: 'next'): void
  (e: 'setLimit', limit: number): void
}>();

function queryParams(lim: number, off: number) {
  return `?limit=${lim}&offset=${off}`
}
</script>