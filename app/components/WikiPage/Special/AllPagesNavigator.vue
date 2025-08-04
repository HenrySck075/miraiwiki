<template>
    <span >
        <ULink v-if="prev !== ''" @click="navPrev">Previous page ({{ prev }})</ULink>
        <span class="!px-1" v-if="prev !== '' && next !== ''">|</span>
        <ULink v-if="next !== ''" @click="navNext">Next page ({{ next }})</ULink>
    </span>
</template>

<script setup lang="ts">
defineProps<{
    prev: string,
    next: string,
    navPrev: ()=>void,
    navNext: ()=>void,
}>();
</script>