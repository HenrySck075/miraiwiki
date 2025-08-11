<template>
    <ULink :to="`./${title.replaceAll(' ', '_')}`">{{ label ?? title }}</ULink>
</template>

<script setup lang="ts">
defineProps<{
    title: string,
    label?: string
}>();
</script>