export default defineEventHandler((e)=>{
    const sitename = getRouterParam(e, "site")!
    const query = getQuery(e);
    query["action"] = getRouterParam(e, "action")!
    query["formatversion"] = "2"
    query["format"] = "json"
    return $fetch(`https://${sitename}.fandom.com/api.php`, {
        query: query
    })
})