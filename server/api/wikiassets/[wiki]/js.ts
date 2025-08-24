// proxies calls to https://${site}.fandom.com/load.php
export default defineEventHandler(async (e)=>{
    const resp = await $fetch.raw(`https://${getRouterParam(e, "wiki")}.fandom.com/load.php`, {
        query: getQuery(e),
        headers: e.node.req.headers as Record<string, string>
    });
    // copies headers over
    e.node.res.setHeaders(new Map(resp.headers.entries().filter(
        (v)=>!v[0].toLowerCase().startsWith("x-") && !["access-control-allow-origin", 'access-control-allow-credentials', 'content-encoding', 'content-length', 'set-cookie'].includes(v[0].toLowerCase())
    )));
    e.node.res.setHeader("sourcemap", e.node.req.url+"&sourcemap=1")
    e.node.res.statusCode = resp.status;
    return resp._data;
}/*, {
    maxAge: 60*10,
    swr: true
}*/)

