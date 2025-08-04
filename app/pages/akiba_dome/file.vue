<script setup lang="ts">
import FileViewerModal from '~/components/FileViewerModal.vue';

const overlay = useOverlay();
const modal = overlay.create(FileViewerModal, {
    props: {
        file: "【PREVIEW】AiScReam Debut Single \"Ai♡Scream!\"",
        site: "love-live"
    }
})

setTimeout(()=>{modal.open();}, 1000);
</script>

<template>
</template>