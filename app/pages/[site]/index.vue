<template></template>
<script setup lang="ts">

    const site = useRoute().params.site;

    const res = await $fetch<{ parse: { wikitext: string } }>(
        `/api/${site}/parse`,
        { query: {
            page: 'MediaWiki:Mainpage',
            prop: 'wikitext'
        } }
    )

    const mainpage = res.parse.wikitext.trim()

    // Redirect to the mainpage
    navigateTo(`/${site}/wiki/${mainpage}`)
</script>