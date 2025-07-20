export default defineEventHandler((e) => {
    const wiki = getRouterParam(e, "wiki");
    const file = getRouterParam(e, "file")!;
    if (wiki) {
        e.node.res.setHeader("cache-control", "max-age=1800");
        return $fetch(`https://${wiki}.fandom.com/wiki/Special:FilePath/${file}`);
    }
});