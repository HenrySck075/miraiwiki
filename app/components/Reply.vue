<template>
    <div class="inline-flex space-x-4">
        <div class="w-3 h-full bg-elevated"></div>
        <CommentBase :data="data" class="bg-elevated"></CommentBase>
    </div>
</template>

<script setup lang="ts">


    const {data} = defineProps<{
        data: Post
    }>();
</script>