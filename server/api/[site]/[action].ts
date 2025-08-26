export default defineCachedEventHandler(async (e)=>{
    // /api/:site/:action ----> /api/:site/uncached/:action
    const resp = await $fetch.raw(`/api/${getRouterParam(e, "site")}/uncached/${getRouterParam(e, "action")}`, {
        query: getQuery(e),
        headers: e.node.req.headers as Record<string, string>,
        responseType: "text"
    });
    // copies headers over
    e.node.res.setHeaders(resp.headers);
    e.node.res.statusCode = resp.status;
    e.node.res.write(resp._data);
    e.node.res.end();
}, {
    maxAge: 60*10,
    swr: true
})