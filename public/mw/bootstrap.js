function removePrefix(str, prefix) {
    if (str.startsWith(prefix)) {
        return str.slice(prefix.length);
    }
}

(function(){
    // This code assumes that it's loaded after the mw object is available
    const site = removePrefix(window.location.pathname, '/').split('/')[0];

    if (!site) {
        console.error("are you fucking serious right now?");
        return;
    }

    // mediawiki.base mods
    const conf = mw.loader.moduleRegistry['mediawiki.base'].script.files['config.json'];
    conf.wgArticlePath = `/${site}/wiki/$1`;
    // {current server url}/site
    conf.wgServer = `${window.location.protocol}//${window.location.host}/${site}`;
    conf.wgServerName = window.location.host;

    // load fandomRequire.js and wait then load the other one

    function buildScriptURL(module) {
        const version = mw?.loader?.moduleRegistry[module]?.version;
        if (!version) {
            console.warn(`Version not found for module: ${module}. Either that or the mw object somehow still doesn't exist.`);
        }
        return `/api/wikiassets/${site}/js?modules=${module}&site=fandomdesktop${version ? `&version=version` : ''}`;
    }

    mw.loader.addScriptTag(buildScriptURL('fandomRequire.js'));
    mw.loader.using("fandomRequire.js", () => {
        mw.loader.addScriptTag(buildScriptURL('ext.fandom.ContentReview.legacyLoaders.js'));
    })

    /*
    const basedModules = ["fandomRequire.js", "ext.fandom.ContentReview.legacyLoaders.js"]


    // for each modules, look up its version from the registry
    // and load the script from constructing this url:
    // `/api/wikiassets/${site}/js?modules=${module}&site=fandomdesktop&version=${version}`
    // 
    // group modules with same version to save requests

    const versionGroups = new Map();

    basedModules.forEach(module => {
        const version = mw?.loader?.moduleRegistry[module]?.version;
        if (!version) {
            console.warn(`Version not found for module: ${module}. Either that or the mw object somehow still doesn't exist.`);
            return;
        }
        if (!versionGroups.has(version)) {
            versionGroups.set(version, []);
        }
        versionGroups.get(version).push(module);
    });

    versionGroups.entries().forEach(([version, modules]) => {
        const modulesParam = modules.join(',');
        const url = `/api/wikiassets/${site}/js?modules=${encodeURIComponent(modulesParam)}&site=fandomdesktop&version=${encodeURIComponent(version)}`;
        // look "exposed for internal use only" were never a good thing just hide it behind something
        // this is what happens when you did exactly that.
        mw.loader.addScriptTag(url)
    });
    */

})()