/**
 * Filters an object according to a Google API-style fields string.
 * Example: fields="id,name,profile(email,age)"
 */
export function filterObjectByFields(obj: any, fields: string): any {
    function parseFields(str: string): any {
        const result: any = {};
        let i = 0;
        while (i < str.length) {
            let key = '';
            while (i < str.length && /[\w$]/.test(str[i]!)) key += str[i++];
            if (!key) { i++; continue; }
            if (str[i] === '(') {
                let depth = 1, start = ++i;
                while (i < str.length && depth > 0) {
                    if (str[i] === '(') depth++;
                    else if (str[i] === ')') depth--;
                    i++;
                }
                result[key] = parseFields(str.slice(start, i - 1));
            } else {
                result[key] = true;
            }
            while (i < str.length && (str[i] === ',' || str[i] === ' ')) i++;
        }
        return result;
    }

    function filter(obj: any, fieldsObj: any): any {
        if (typeof obj !== 'object' || obj === null) return obj;
        const out: any = Array.isArray(obj) ? [] : {};
        for (const key in fieldsObj) {
            if (fieldsObj[key] === true) {
                if (key in obj) out[key] = obj[key];
            } else if (typeof fieldsObj[key] === 'object' && key in obj) {
                if (Array.isArray(obj[key])) {
                    out[key] = obj[key].map((item: any) => filter(item, fieldsObj[key]));
                } else {
                    out[key] = filter(obj[key], fieldsObj[key]);
                }
            }
        }
        return out;
    }

    const fieldsObj = parseFields(fields);
    return filter(obj, fieldsObj);
}