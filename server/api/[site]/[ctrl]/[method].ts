export default defineCachedEventHandler((e)=>{
    // convoluted but gets the job done (it can be a regex replace tho)
    return $fetch(`/api/${getRouterParam(e, "site")}/uncached/${getRouterParam(e, "ctrl")}/${getRouterParam(e, "method")}`, {
        query: getQuery(e),
        headers: e.node.req.headers as Record<string, string>
    });
}, {
    maxAge: 60*10,
    swr: true
})