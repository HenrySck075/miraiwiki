export default defineEventHandler((e) => {
    const wiki = getRouterParam(e, "wiki");
    const file = getRouterParam(e, "file")!;
    if (wiki) {
        return $fetch(`https://${wiki}.fandom.com/wiki/Special:FilePath/${file}`);
    }
});