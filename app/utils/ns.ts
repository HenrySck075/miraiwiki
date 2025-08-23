
const namespaces = [
  //"Media",
  "Special",
  "Talk",
  "User",
  "User talk",
  "User blog",
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
/// still does not account for this wiki's namespace
export function getUnnamespacedPage(page:string) {
  // tries to remove the namespace prefix from the provided string
  const ns = getPageNamespace(page);
  if (ns === "Main") return page;
  return page.slice(ns.length + 1); // +1 for the colon
}