export function wikiUrlOf(page: string) {
    return `/${useWikiMeta().value.site}/wiki/${page}`
}