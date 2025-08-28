<template></template>
<script setup lang="ts">

    const site = useRoute().params.site as string;
    // if site string looks like a filename, cancels loading
    if (site.match(/\.[a-zA-Z0-9]+$/)) {
        console.error(useRoute().fullPath);
        throw new Error('if useFetch calls this i will kms')
    }
    import fs from 'fs'
    import path from 'path'
    if (import.meta.server) {

        const publicDir = path.resolve(process.cwd(), 'public')
        const publicFiles = fs.readdirSync(publicDir)

        if (publicFiles.includes(site)) {
            throw new Error('if useFetch calls this i will kms')
        }
    }
    const res = await $fetch<{ parse: { wikitext: string } }>(
        `/api/${site}/parse`,
        { 
            query: {
                page: 'MediaWiki:Mainpage',
                prop: 'wikitext'
            },
            responseType: "json"
        },    
    )

    console.log(res);

    const mainpage = res.parse.wikitext.trim().replaceAll(" ", "_")

    // Redirect to the mainpage
    navigateTo(`/${site}/wiki/${mainpage}`)

    definePageMeta({
        alias: ["/:site/wiki"]
    })
</script>