export function convertURL(url: string) {
    return url.replace(/https:\/\/([a-zA-Z0-9-_]+)\.fandom\.com/g, (balls, args) => {
        return `/${args[0]}`
    })
}
export function convertAssetsURL(url: string) {
    return url.replace("https://", '/api/assets/');
}

export function removePrefix(str: string, prefix: string) {
    if (str.startsWith(prefix)) {
        return str.slice(prefix.length);
    }
    return str;
}

export function relativeTimeOf(epochSecond: number) {
    const date = new Date(epochSecond*1000);

    const now = new Date();
    const diffMilliseconds = date.getTime() - now.getTime();
    const diffSeconds = Math.round(diffMilliseconds / 1000);
    const diffMinutes = Math.round(diffSeconds / 60);
    const diffHours = Math.round(diffMinutes / 60);
    const diffDays = Math.round(diffHours / 24);
    
    if (Math.abs(diffDays) <= 14) {
        const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

        let relativeTime;
        if (Math.abs(diffDays) >= 1) {
            relativeTime = rtf.format(diffDays, 'day');
        } else if (Math.abs(diffHours) >= 1) {
            relativeTime = rtf.format(diffHours, 'hour');
        } else if (Math.abs(diffMinutes) >= 1) {
            relativeTime = rtf.format(diffMinutes, 'minute');
        } else {
            relativeTime = rtf.format(diffSeconds, 'second');
        }

        return relativeTime;
    } else {
        return date.toLocaleDateString();
    }
}