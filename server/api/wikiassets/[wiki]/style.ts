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
export default defineEventHandler(async (e) => {
    const wiki = getRouterParam(e, "wiki");
    const theme = getQuery(e)["variant"] ?? "dark"
    const type = getQuery(e)["type"];
    e.node.res.setHeader("content-type", "text/css")
    if (wiki) {
        let css: string = ""
        if (type === "main") {
            css = await $fetch(
                `https://${wiki}.fandom.com/load.php?lang=en&modules=${sheetModules.join("|")}&only=styles&skin=fandomdesktop`,
                {headers: {
                    cookie: `theme=${theme}; leftPaneOpen=0;`
                }}
            );
            css = css.replaceAll("background-color:var(--theme-body-background-color);", "").replace('table.diff [class*="mw-diff-inline-"]{ins{background:var(--theme-success-color)}del{background:var(--theme-alert-color)}}', "");
            
        } else if (type === "wikiTheme") {
            css = await $fetch(`https://${wiki}.fandom.com/load.php?mode=articles&articles=MediaWiki:Themes.css&only=styles`)
        } else if (type === "category") {
            css = await $fetch(`https://${wiki}.fandom.com/load.php?lang=en&modules=ext.fandom.CategoryPage.category-layout-selector.css%7Cext.fandom.CategoryPage.category-page3.css&only=styles&skin=fandomdesktop`)
        } else if (type === "themeVars") {
            css = await $fetch(`https://${wiki}.fandom.com/wikia.php?controller=ThemeApi&method=themeVariables&variant=${theme}`)
        }
        else {
            /// return 404
            e.node.res.statusCode = 404;
            e.node.res.end("what (allowed types are 'main' and 'wikiTheme')");
        }
            
        const cssTree = cssParser.parse(css);
        const rules = cssTree.stylesheet!.rules;

        rules.sort((a,b)=>{
            if (b.type === "import") return 1;
            if (a.type === "import") return -1;
            return 0;
        })
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
                rule.selectors = rule.selectors!.map((s) => `div#__nuxt.isolate #wiki_content ${s}`);
            })
        }
        css = cssParser.stringify(cssTree) + (type === "main" ? 'table.diff [class*="mw-diff-inline-"]{ins{background:var(--theme-success-color)}del{background:var(--theme-alert-color)}}' : "");

        for (const domain of assetsDomains) {
            css = css.replaceAll(domain, `/api/assets/${domain.substring(8)}`)
        }
        css = css
            .replaceAll("/wiki/Special:FilePath", `/api/wikiassets/${wiki}/filepath`)
            .replaceAll("/load.php", `https://${wiki}.fandom.com/load.php`)
        return css
    }
});