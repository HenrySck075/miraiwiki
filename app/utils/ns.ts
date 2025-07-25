
const namespaces = [
  //"Media",
  "Special",
  "Talk",
  "User",
  "User talk",
  "Project",
  "Project talk",
  "File",
  "File talk",
  "MediaWiki",
  "MediaWiki talk",
  "Template",
  "Template talk",
  "Help",
  "Help talk",
  "Category",
  "Category talk",
  // TODO: wiki ns
]
export function namespacedPage(page:string) {
  return namespaces.some(ns => page.startsWith(`${ns}:`));
}

export function getPageNamespace(page:string) {
    const ns = namespaces.find(ns => page.startsWith(`${ns}:`));
    return ns ? ns : "Main";
}