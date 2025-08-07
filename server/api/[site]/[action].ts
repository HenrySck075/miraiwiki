export default defineCachedEventHandler((e)=>{
    // /api/:site/:action ----> /api/:site/uncached/:action
    return $fetch(`/api/${getRouterParam(e, "site")}/uncached/${getRouterParam(e, "action")}`, {
        query: getQuery(e),
        headers: e.node.req.headers as Record<string, string>
    });
}, {
    maxAge: 60*10,
    swr: true
})