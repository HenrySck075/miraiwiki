<template>
  <p>
    <span>View (</span>
      <a v-if="results[0]!.value !== '0'" @click="$emit('prev')">previous {{limit}}</a>
      <span v-else>previous {{limit}}</span>
      <span> | </span>
      <a v-if="results.length >= limit" @click="$emit('next')">next {{limit}}</a>
      <span v-else>next {{limit}}</span>
    <span>) (</span>
      <template v-for="(l, idx) in [20, 50, 100, 250, 500]">
        <a v-if="l !== limit" @click="$emit('setLimit', l)">{{l}}</a>
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
  limit: number
}>();

defineEmits<{
  (e: 'prev'): void
  (e: 'next'): void
  (e: 'setLimit', limit: number): void
}>();
</script>