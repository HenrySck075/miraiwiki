<template>
  <div class="w-full flex items-center">
    <div class="flex flex-col flex-1">
      <div class="text-sm font-semibold text-gray-900 dark:text-white">{{title}}</div>
      <div class="text-xs text-gray-500">{{subtitle}}</div>
    </div>
    <div class="ml-auto text-gray-400">
      <slot></slot>
    </div>
  </div>
</template>


<script setup lang="ts">
defineProps<{
  title: string;
  subtitle: string;
}>();
</script>