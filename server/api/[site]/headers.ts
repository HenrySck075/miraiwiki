import { useNuxtApp } from "nuxt/app";
import * as cheerio from "cheerio";
import { Element } from 'domhandler';
import { createDatabase } from "db0";
import sqlite from "db0/connectors/better-sqlite3";

const db = createDatabase(sqlite({
    "path": ".data/headers.sqlite3"
}));
db.exec('CREATE TABLE IF NOT EXISTS headers (site TEXT PRIMARY KEY, headers TEXT)');

async function getHeaders(site: string) {
    // get the headers of a site, returns a json-serialized object of it or null if it doesnt exist
    const row = await (db.prepare('SELECT headers FROM headers WHERE site = ?').get(site)) as ({site: string, headers: string});
    return row ? JSON.parse(row.headers) : null;
}
function setHeaders(site: string, headers: Array<object>) {
    // set the headers of a site, if it exists, update it, otherwise insert it
    const serializedHeaders = JSON.stringify(headers);
    db.prepare('INSERT OR REPLACE INTO headers (site, headers) VALUES (?, ?)').run(site, serializedHeaders);
}

type mope = {
    label: string,
    to: string,
    "class"?: string,
    children?: mope[]
}
export default defineEventHandler(async (e)=>{
    const site = getRouterParam(e, "site")!

    if (e.method === "DELETE") {
        db.prepare('DELETE FROM headers WHERE site = ?').run(site);
        return { success: true };
    }

    const headers = await getHeaders(site);
    if (headers) {
        // If headers exist, return them
        return headers
    } else {
        // If no headers found:
        // - Create a request to https://${site}.fandom.com/wiki/Special:ApiSandbox
        // - const $ = cheerio(resp)
        // - match ".main-container .resizable-container .community-header-wrapper nav.fandom-community-header__local-navigation ul li" to get all the tabs
        // - for each tabs:
        // - - extract tab label from "div.wds-tabs__tab-label a span"
        // - - check for its child by matching either "div.wds-dropdown__content ul li" or "div.wds-dropdown-level-nested__content ul li"
        // - - repeat those 2 steps for all the children
        // - store them to the database
        // 
        // header item object format: 
        // {
        //   label: "label",
        //   children: {(also a header object)}
        // }
        const resp = await $fetch<string>(`https://${site}.fandom.com/wiki/Special:ApiSandbox`);
        const $ = cheerio.load(resp);

        function parseTab(tabElem: Element, level: number | null = 1): mope | null {
            let labelNode: cheerio.Cheerio<Element>;
            if (level !== null) {
                const dataTrackingValue = `custom-level-${level}`;
                labelNode = $(`div.wds-tabs__tab-label > a[data-tracking='${dataTrackingValue}'] > span, a[data-tracking='${dataTrackingValue}'] > span`, tabElem).first()
            } else {
                /// explore tab
                labelNode = $(`div.wds-tabs__tab-label > a > span, a > span`)
            }
            const label = labelNode.text().trim();
            if (label === "") return null;
            const page = labelNode.parent().first().attr("href")?.replace(/https:\/\/([a-zA-Z0-9-]+)\.fandom\.com\/(.*)/g, "/$1/$2") ?? "#";
            const children: mope[] = [];

            // Check for dropdown children
            $(tabElem)
                .find("div.wds-dropdown__content > ul > li, div.wds-dropdown-level-nested__content > ul > li")
                .each((_, childElem) => {
                    const v = parseTab(childElem, $(childElem).hasClass("explore-menu") ? null : level!+1);
                    if (v === null) return;
                    children.push(v);
                });

            return children.length > 0
                ? { label, to: "#", children: [{label: label, to: page, "class": "font-bold"}, ...children] }
                : { label, to: page };
        }

        const headerItems: mope[] = [];
        $(".main-container .resizable-container .community-header-wrapper nav.fandom-community-header__local-navigation > ul > li").each((_, tabElem) => {
            headerItems.push(parseTab(tabElem)!);
        });

        setHeaders(site, headerItems);
        return headerItems;
    }
});