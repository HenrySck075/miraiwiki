export default defineCachedEventHandler(async (e)=>{
    return (await $fetch(
        `/api/${getRouterParam(e,"site")}/query`,
        {
            query: {
                meta: "siteinfo"
            }
        }
    ))["query"]["general"]
}, {
    maxAge: 60*60*7
})