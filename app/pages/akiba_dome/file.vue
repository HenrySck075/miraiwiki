<script setup lang="ts">
import FileViewerModal from '~/components/FileViewerModal.vue';

const overlay = useOverlay();
const modal = overlay.create(FileViewerModal, {
    props: {
        file: "LL-COUNTDOWN-01.jpg",
        site: "love-live"
    }
})

setTimeout(()=>{modal.open();}, 1000);
</script>

<template>
</template>