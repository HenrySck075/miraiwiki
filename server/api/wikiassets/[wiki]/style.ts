const sheetModules = [
    "ext.cite.styles",
    "ext.fandom.ArticleInterlang.css",
    "ext.fandom.ArticleVideo.desktop.css",
    //"ext.fandom.CreatePage.css",
    "ext.fandom.Experiments.TRFC147",
    //"ext.fandom.GlobalComponents.CommunityHeader.css",
    "ext.fandom.GlobalComponents.CommunityHeaderBackground.css",
    //"ext.fandom.GlobalComponents.CommunityNavigation.css",
    "ext.fandom.GlobalComponents.GlobalComponentsTheme.light.css",
    "ext.fandom.GlobalComponents.GlobalExploreNavigation.css",
    "ext.fandom.GlobalComponents.GlobalFooter.css",
    "ext.fandom.GlobalComponents.GlobalNavigationTheme.light.css",
    "ext.fandom.GlobalComponents.GlobalTopNavigation.css",
    "ext.fandom.GlobalComponents.StickyNavigation.css",
    "ext.fandom.HighlightToAction.css",
    "ext.fandom.PortableInfoboxFandomDesktop.css",
    //"ext.fandom.ServerSideExperiments.splitTrafficReleaseNewNav.css",
    //"ext.fandom.SuggestedPages.css",
    "ext.fandom.Thumbnails.css",
    "ext.fandom.ThumbnailsViewImage.css",
    //"ext.fandom.Uncrawlable.css",
    //"ext.fandom.ae.odyssey.desktop.css",
    //"ext.fandom.bannerNotifications.desktop.css",
    //"ext.fandom.sitenotice.desktop.css",
    //ext.cite.styles%7Cext.fandom.ArticleInterlang.css%7Cext.fandom.CreatePage.css%7Cext.fandom.Experiments.TRFC147%7Cext.fandom.GlobalComponents.CommunityHeader.css%7Cext.fandom.GlobalComponents.CommunityHeaderBackground.css%7Cext.fandom.GlobalComponents.CommunityNavigation.css%7Cext.fandom.GlobalComponents.GlobalComponentsTheme.dark.css%7Cext.fandom.GlobalComponents.GlobalExploreNavigation.css%7Cext.fandom.GlobalComponents.GlobalFooter.css%7Cext.fandom.GlobalComponents.GlobalNavigationTheme.dark.css%7Cext.fandom.GlobalComponents.GlobalTopNavigation.css%7Cext.fandom.GlobalComponents.StickyNavigation.css%7Cext.fandom.HighlightToAction.css%7Cext.fandom.PortableInfoboxFandomDesktop.css%7Cext.fandom.ServerSideExperiments.splitTrafficReleaseNewNav.css%7Cext.fandom.SuggestedPages.css%7Cext.fandom.Thumbnails.css%7Cext.fandom.ThumbnailsViewImage.css%7Cext.fandom.Uncrawlable.css%7Cext.fandom.ae.odyssey.noads.css%7Cext.fandom.bannerNotifications.desktop.css%7Cext.fandomVideo.css%7Cext.staffSig.css%7Cext.visualEditor.desktopArticleTarget.noscript%7Cskin.fandomdesktop.CargoTables-ext.css%7Cskin.fandomdesktop.Math.css%7Cskin.fandomdesktop.rail.css%7Cskin.fandomdesktop.styles%7Cvendor.tippy.css
    //"ext.fandomVideo.css",
    //"ext.staffSig.css",
    //"ext.visualEditor.desktopArticleTarget.noscript",
    "jquery.makeCollapsible.styles",
    "skin.fandomdesktop.CargoTables-ext.css",
    "skin.fandomdesktop.Math.css",
    "skin.fandomdesktop.rail.css",
    "skin.fandomdesktop.styles",
    //"vendor.tippy.css",
    "site.styles"
]
const assetsDomains = [
    "https://images.wikia.com",
    "https://images.wikia.com",
    "https://static.wikia.com",
    "https://static.wikia.nocookie.net",
    "https://img.wikia.nocookie.net",
    "https://img1.wikia.nocookie.net",
    "https://img2.wikia.nocookie.net",
    "https://img3.wikia.nocookie.net",
    "https://img4.wikia.nocookie.net",
    "https://img5.wikia.nocookie.net",
    "https://images.wikia.nocookie.net",
    "https://images1.wikia.nocookie.net",
    "https://images2.wikia.nocookie.net",
    "https://images3.wikia.nocookie.net",
    "https://images4.wikia.nocookie.net",
    "https://images5.wikia.nocookie.net",
    "https://vignette.wikia.nocookie.net",
    "https://vignette1.wikia.nocookie.net",
    "https://vignette2.wikia.nocookie.net",
    "https://vignette3.wikia.nocookie.net",
    "https://vignette4.wikia.nocookie.net",
    "https://vignette5.wikia.nocookie.net"
]
import * as cssParser from "css";
import { removePrefix } from "~~/shared/utils/utils"; /// vscode is bad at noticing that these are autoimported
export default defineEventHandler(async (e) => {
    const wiki = getRouterParam(e, "wiki");
    const theme = getQuery(e)["variant"] ?? "dark"
    const type = getQuery(e)["type"];
    const headers = {headers: {
        cookie: `theme=${theme}; leftPaneOpen=0;`
    }}
    if (wiki) {
        let css: string = ""
        if (type === "main") {
            css = await $fetch(
                `https://${wiki}.fandom.com/load.php?lang=en&modules=${sheetModules.join("|")}&only=styles&skin=fandomdesktop`,
                headers
            );
            css = css.replaceAll("background-color:var(--theme-body-background-color);", "").replace('table.diff [class*="mw-diff-inline-"]{ins{background:var(--theme-success-color)}del{background:var(--theme-alert-color)}}', "");
            e.node.res.setHeader("content-type", "text/css")
        } else if (type === "wikiTheme") {
            css = await $fetch(`https://${wiki}.fandom.com/load.php?mode=articles&articles=MediaWiki:Themes.css&only=styles`) /// TODO: remove as its loaded with site.styles
            e.node.res.setHeader("content-type", "text/css")
        } else if (type === "category") {
            css = await $fetch(`https://${wiki}.fandom.com/load.php?lang=en&modules=ext.fandom.CategoryPage.category-layout-selector.css%7Cext.fandom.CategoryPage.category-page3.css&only=styles&skin=fandomdesktop`, headers)
            e.node.res.setHeader("content-type", "text/css")
        } else if (type === "themeVars") {
            css = await $fetch(`https://${wiki}.fandom.com/wikia.php?controller=ThemeApi&method=themeVariables&variant=${theme}`, headers)
            e.node.res.setHeader("content-type", "text/css")
        }
        else {
            const query = Object.assign({
                "skin": "fandomdesktop",
                ...(((getQuery(e)["modules"] as string | null)?.includes(".css")) ? {"only": "styles"} : {"version": "ztntf"})
            }, getQuery(e));
            delete query["variant"];
            const queryStr = Object.keys(query).map((key) => `${key}=${query[key]}`).join("&");
            const data = await $fetch.raw(`https://${wiki}.fandom.com/load.php?lang=en&${queryStr}`, headers);
            css = data._data as string;
            /// copies all file-related headers over
            for (const key of ['content-type', /*'content-length'*/] /*data.headers.keys().filter((e)=>!(e.startsWith('x-') || ['set-cookie', 'access-control-allow-origin', 'strict-transport-security'].includes(e)))*/) {
                e.node.res.setHeader(key, data.headers.get(key)!);
            }
            e.node.res.statusCode = data.status;
            // early return if content-type is not css
            if (!data.headers.get("content-type")?.includes("text/css") || data.status !== 200) {
                e.node.res.write(css);
                e.node.res.end();
                return;
            }
        }

        // convert the import directives into one single format of @import url("url");
        css = 
        // 1. @import url(urlUnquoted)
        css.replaceAll(/@import\s+url\(([^"]+?)\);/g, '@import url("$1");')
        // 2. @import "url"
        .replaceAll(/@import\s+"([^"]+?)";/g, '@import url("$1");')
        // remove all import rules from the css and store them somewhere
        let importRules: string[] = [];
        css = css.replace(/@import\s+url\(([^)]+?)\);/g, (match, url) => {
            importRules.push(match);
            return '';
        });
/*
        return beautify.default.css(css, {
            indent_size: 2,
            indent_char: " "
        });
*/
        const cssTree = cssParser.parse(/*beautify.default.css(css)*/css);
        const rules = cssTree.stylesheet!.rules;

        if (type === "main") {
            // and delete height, margin-bottom, position, transform from those rules
            // of course it is not sequentially next to each other

            // Move rule .fandom-community-header__background to .fandomdesktop-background
            rules.filter((v)=>v.type === "rule" && v.selectors?.find((s)=>s.includes(".fandom-community-header__background"))).forEach((v)=>{
                const rule = v as cssParser.Rule;
                rule.selectors = rule.selectors!.map((s)=>s.replace(".fandom-community-header__background", ".fandomdesktop-background"));
                // Remove height, margin-bottom, position, transform from the rule
                rule.declarations = rule.declarations!.filter((v)=>v.type === "declaration" && !["height", "margin-bottom", "position", "transform", "display"].includes(v.property!));
            })
            

            rules.filter((v)=>v.type === "rule" && v.selectors?.find((s)=>s.includes(".theme-fandomdesktop-"))).forEach((v)=>{
                /// find the background-image decl and mark it as important
                const rule = v as cssParser.Rule;
                rule.declarations = rule.declarations!.map((decl)=>{
                    if (decl.type === "declaration" && decl.property === "background-image") {
                        decl.value = `${decl.value} !important`;
                    }
                    return decl;
                });
            })
        }
        if (type !== "themeVars") {
            rules.filter((v)=>v.type === "rule").forEach((v)=>{
                const rule = v as cssParser.Rule;
                // prepend "div#__nuxt.isolate #wiki_content" into selectors
                rule.selectors = rule.selectors!.map((s) => `div#__nuxt.isolate #wiki_content ${removePrefix(s, 'body')}`);
            })
        }
        css = cssParser.stringify(cssTree) + (type === "main" ? 'table.diff [class*="mw-diff-inline-"]{ins{background:var(--theme-success-color)}del{background:var(--theme-alert-color)}}' : "");

        for (const domain of assetsDomains) {
            css = css.replaceAll(domain, `/api/assets/${domain.substring(8)}`)
        }
        const imports = importRules.map((e)=>{
            /// replace urls that has the /load.php path (aka url string startsWith /load.php) to /api/wikiassets/${wiki}/style
            if (e.startsWith('@import url("/load.php')) {
                return `@import url("/api/wikiassets/${wiki}/style?`+e.substring(e.indexOf("/load.php") + 10);
            }
        }).join("\n").trim();
        css = imports + (imports.length == 0 ? '' : "\n") + css
            .replaceAll("/wiki/Special:FilePath", `/api/wikiassets/${wiki}/filepath`)
            .replaceAll("/load.php", `https://${wiki}.fandom.com/load.php`)
        return css
    }
});