export function convertURL(url: string) {
    return url.replace(/https:\/\/([a-zA-Z0-9-_]+)\.fandom\.com/g, (balls, args) => {
        return `/${args[0]}`
    })
}

export function removePrefix(str: string, prefix: string) {
    if (str.startsWith(prefix)) {
        return str.slice(prefix.length);
    }
    return str;
}