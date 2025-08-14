<template>
    <ULink :to="`./${title.replaceAll(' ', '_')}`">
        <slot>
        {{ label ?? title }}
        </slot>
    </ULink>
</template>

<script setup lang="ts">
defineProps<{
    title: string,
    label?: string
}>();
</script>