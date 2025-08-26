/// a nitro endpoint that returns the content of https://${site}.fandom.com/wiki/Special:FilePath/Site-favicon.ico (this is a redirect url)

import { type } from "~~/shared/utils/utils";

export default defineEventHandler(async (event) => {
    const { site } = event.context.params as { site: string };

    
    const res = await $fetch.raw(`https://${site}.fandom.com/wiki/Special:FilePath/Site-favicon.ico`, {
        redirect: 'follow',
        responseType: 'arrayBuffer'
    });
    
    if (!res.ok) {
        event.node.res.statusCode = res.status;
        return `Error fetching favicon: ${res.statusText}`;
    }
    
    event.node.res.setHeader('Content-Type', res.headers.get('Content-Type') || 'image/x-icon');
    event.node.res.setHeader('Content-Length', res.headers.get('Content-Length') || (res._data as ArrayBuffer).byteLength);
    event.node.res.setHeader('cache-control', 'public, max-age=86400, stale-while-revalidate=3600');
    console.log(type(res._data));
    console.log(res.headers.get('content-type'));
    
    event.node.res.end(Buffer.from(res._data as ArrayBuffer));
}
);