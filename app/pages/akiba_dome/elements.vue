<template>
    <div>
        <!--<FAudio src="/api/assets/static.wikia.nocookie.net/love-live/images/a/ad/Snow_halation_%28Off_Vocal%29.ogg/revision/latest?cb=20160725134813"></FAudio>-->
        <WikiPageRCFilters v-model="d" />
        <UButton @click="d = !d">a</UButton>
    </div>
</template>


<script setup lang="ts">
const d = ref(false);

watch(d, ()=>console.log(d.value));
</script>