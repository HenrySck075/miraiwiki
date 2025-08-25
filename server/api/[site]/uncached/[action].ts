import UserAgent from 'user-agents';

export default defineEventHandler(async (e)=>{
    const sitename = getRouterParam(e, "site")!
    const query = getQuery(e);
    const headers = {...{
        "Accept": "*/*",
        "Cookie": "",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br"
    }, ...e.node.req.headers as Record<string, string>, ...{
        "User-Agent": (new UserAgent()).toString() /*e.node.req.headers["user-agent"] || "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"*/,
        "Referer": `https://${sitename}.fandom.com/`,
        "Origin": `https://${sitename}.fandom.com`,
    }}
    query["action"] = getRouterParam(e, "action")!;
    query["formatversion"] = "2";
    query["format"] = "json";
    const ret = await $fetch.raw(`https://${sitename}.fandom.com/api.php`, {
        query: query,
        headers: headers,
        responseType: "text"
    },);

    e.node.res.statusCode = ret.status;
    e.node.res.setHeaders(new Map(ret.headers.entries().filter(
        (v)=>!v[0].toLowerCase().startsWith("x-") && !["access-control-allow-origin", 'access-control-allow-credentials', 'content-length', 'content-encoding'].includes(v[0].toLowerCase())
    )));
    /// this endpoint is guaranteed json-only
    e.node.res.setHeader("Content-Type", "application/json");
    e.node.res.write(ret._data);
    e.node.res.end();
})