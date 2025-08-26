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

// this one is from mdn docs of typeof
export function type(value: any) {
  if (value === null) {
    return "null";
  }
  const baseType = typeof value;
  // Primitive types
  if (!["object", "function"].includes(baseType)) {
    return baseType;
  }

  // Symbol.toStringTag often specifies the "display name" of the
  // object's class. It's used in Object.prototype.toString().
  const tag = value[Symbol.toStringTag];
  if (typeof tag === "string") {
    return tag;
  }

  // If it's a function whose source code starts with the "class" keyword
  if (
    baseType === "function" &&
    Function.prototype.toString.call(value).startsWith("class")
  ) {
    return "class";
  }

  // The name of the constructor; for example `Array`, `GeneratorFunction`,
  // `Number`, `String`, `Boolean` or `MyCustomClass`
  const className = value.constructor.name;
  if (typeof className === "string" && className !== "") {
    return className;
  }

  // At this point there's no robust way to get the type of value,
  // so we use the base implementation.
  return baseType;
}