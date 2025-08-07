<template>
  <WikiPageBase>
    <template #headers>
      <WikiPageITitle page="Special:SpecialPages" display-title-html="Special pages" />
    </template>
    <template #content>
      <link rel="stylesheet" :href="`/api/wikiassets/${site}/style?variant=${currentTheme.toLowerCase()}&modules=mediawiki.helplink,special|mediawiki.special.changeslist.legend|skin.fandomdesktop.SpecialPageGlobal.css|skin.fandomdesktop.SpecialPagesLists.css`">
      <!--copied directly from the special pages html-->
      <div class="mw-changeslist-legend mw-specialpages-notes">Legend<ul><li>Normal special pages.</li>
      <li><span class="mw-specialpagerestricted">Restricted special pages.</span></li></ul></div><div id="toc" class="toc" role="navigation" aria-labelledby="mw-toc-heading"><input type="checkbox" role="button" id="toctogglecheckbox" class="toctogglecheckbox" style="display:none" aria-label="show"><div class="toctitle" lang="en" dir="ltr"><h2 id="mw-toc-heading"><svg class="wds-icon wds-icon-tiny">
      <use href="#wds-icons-bullet-list-tiny"></use>
      </svg>Contents</h2><span class="toctogglespan"><label class="toctogglelabel" for="toctogglecheckbox" aria-label="show"></label></span></div>
      <ul>
      <li class="toclevel-1 tocsection-1"><a href="#mw-specialpagesgroup-maintenance"><span class="tocnumber">1</span> <span class="toctext">Maintenance reports</span></a></li>
      <li class="toclevel-1 tocsection-2"><a href="#mw-specialpagesgroup-pages"><span class="tocnumber">2</span> <span class="toctext">Lists of pages</span></a></li>
      <li class="toclevel-1 tocsection-3"><a href="#mw-specialpagesgroup-users"><span class="tocnumber">3</span> <span class="toctext">Users and rights</span></a></li>
      <li class="toclevel-1 tocsection-4"><a href="#mw-specialpagesgroup-login"><span class="tocnumber">4</span> <span class="toctext">Account management</span></a></li>
      <li class="toclevel-1 tocsection-5"><a href="#mw-specialpagesgroup-changes"><span class="tocnumber">5</span> <span class="toctext">Recent changes and logs</span></a></li>
      <li class="toclevel-1 tocsection-6"><a href="#mw-specialpagesgroup-media"><span class="tocnumber">6</span> <span class="toctext">Media reports and uploads</span></a></li>
      <li class="toclevel-1 tocsection-7"><a href="#mw-specialpagesgroup-wiki"><span class="tocnumber">7</span> <span class="toctext">Data and tools</span></a></li>
      <li class="toclevel-1 tocsection-8"><a href="#mw-specialpagesgroup-redirects"><span class="tocnumber">8</span> <span class="toctext">Redirecting special pages</span></a></li>
      <li class="toclevel-1 tocsection-9"><a href="#mw-specialpagesgroup-highuse"><span class="tocnumber">9</span> <span class="toctext">High use pages</span></a></li>
      <li class="toclevel-1 tocsection-10"><a href="#mw-specialpagesgroup-pagetools"><span class="tocnumber">10</span> <span class="toctext">Page tools</span></a></li>
      <li class="toclevel-1 tocsection-11"><a href="#mw-specialpagesgroup-other"><span class="tocnumber">11</span> <span class="toctext">Other special pages</span></a></li>
      </ul>
      </div>
      <h2 class="mw-specialpagesgroup" id="mw-specialpagesgroup-maintenance">Maintenance reports</h2>
      <div class="mw-specialpages-list"><ul><li class="mw-specialpagecached"><a href="../wiki/Special:BrokenRedirects" title="Special:BrokenRedirects">Broken redirects</a></li>
      <li class="mw-specialpagecached"><a href="../wiki/Special:DeadendPages" title="Special:DeadendPages">Dead-end pages</a></li>
      <li class="mw-specialpagecached"><a href="../wiki/Special:DoubleRedirects" title="Special:DoubleRedirects">Double redirects</a></li>
      <li><a href="../wiki/Special:LongPages" title="Special:LongPages">Long pages</a></li>
      <li><a href="../wiki/Special:NonportableInfoboxes" title="Special:NonportableInfoboxes">Non-portable infoboxes</a></li>
      <li class="mw-specialpagecached"><a href="../wiki/Special:AncientPages" title="Special:AncientPages">Oldest pages</a></li>
      <li class="mw-specialpagecached"><a href="../wiki/Special:LonelyPages" title="Special:LonelyPages">Orphaned pages</a></li>
      <li class="mw-specialpagecached"><a href="../wiki/Special:FewestRevisions" title="Special:FewestRevisions">Pages with the fewest revisions</a></li>
      <li class="mw-specialpagecached"><a href="../wiki/Special:WithoutInterwiki" title="Special:WithoutInterwiki">Pages without language links</a></li>
      <li><a href="../wiki/Special:ProtectedPages" title="Special:ProtectedPages">Protected pages</a></li>
      <li><a href="../wiki/Special:ProtectedTitles" title="Special:ProtectedTitles">Protected titles</a></li>
      <li><a href="../wiki/Special:ShortPages" title="Special:ShortPages">Short pages</a></li>
      <li class="mw-specialpagecached"><a href="../wiki/Special:UncategorizedCategories" title="Special:UncategorizedCategories">Uncategorized categories</a></li>
      <li class="mw-specialpagecached"><a href="../wiki/Special:UncategorizedFiles" title="Special:UncategorizedFiles">Uncategorized files</a></li>
      <li class="mw-specialpagecached"><a href="../wiki/Special:UncategorizedPages" title="Special:UncategorizedPages">Uncategorized pages</a></li>
      <li class="mw-specialpagecached"><a href="../wiki/Special:UncategorizedTemplates" title="Special:UncategorizedTemplates">Uncategorized templates</a></li>
      <li><a href="../wiki/Special:UnorganizedTemplates" title="Special:UnorganizedTemplates">Unorganized templates</a></li>
      <li class="mw-specialpagecached"><a href="../wiki/Special:UnusedCategories" title="Special:UnusedCategories">Unused categories</a></li>
      <li class="mw-specialpagecached"><a href="../wiki/Special:UnusedFiles" title="Special:UnusedFiles">Unused files</a></li>
      <li class="mw-specialpagecached"><a href="../wiki/Special:UnusedTemplates" title="Special:UnusedTemplates">Unused templates</a></li>
      <li class="mw-specialpagecached"><a href="../wiki/Special:WantedCategories" title="Special:WantedCategories">Wanted categories</a></li>
      <li class="mw-specialpagecached"><a href="../wiki/Special:WantedFiles" title="Special:WantedFiles">Wanted files</a></li>
      <li class="mw-specialpagecached"><a href="../wiki/Special:WantedPages" title="Special:WantedPages">Wanted pages</a></li>
      <li class="mw-specialpagecached"><a href="../wiki/Special:WantedTemplates" title="Special:WantedTemplates">Wanted templates</a></li>
      </ul></div><h2 class="mw-specialpagesgroup" id="mw-specialpagesgroup-pages">Lists of pages</h2>
      <div class="mw-specialpages-list"><ul><li><a href="../wiki/Special:AllPages" title="Special:AllPages">All pages</a></li>
      <li><a href="../wiki/Special:PrefixIndex" title="Special:PrefixIndex">All pages with prefix</a></li>
      <li><a href="../wiki/Special:Categories" title="Special:Categories">Categories</a></li>
      <li><a href="../wiki/Special:CategoryTree" title="Special:CategoryTree">Category tree</a></li>
      <li><a href="../wiki/Special:DisambiguationPages" title="Special:DisambiguationPages">Disambiguation pages</a></li>
      <li><a href="../wiki/Special:LinkSearch" title="Special:LinkSearch">External links search</a></li>
      <li class="mw-specialpagecached"><a href="../wiki/Special:ListRedirects" title="Special:ListRedirects">List of redirects</a></li>
      <li class="mw-specialpagecached"><a href="../wiki/Special:DisambiguationPageLinks" title="Special:DisambiguationPageLinks">Pages linking to disambiguation pages</a></li>
      <li><a href="../wiki/Special:PagesWithProp" title="Special:PagesWithProp">Pages with a page property</a></li>
      <li><a href="../wiki/Special:TrackingCategories" title="Special:TrackingCategories">Tracking categories</a></li>
      </ul></div><h2 class="mw-specialpagesgroup" id="mw-specialpagesgroup-users">Users and rights</h2>
      <div class="mw-specialpages-list"><ul><li><a href="../wiki/Special:AutoblockList" title="Special:AutoblockList">Autoblocks</a></li>
      <li><a href="../wiki/Special:BlockList" title="Special:BlockList">Blocked users</a></li>
      <li><a href="../wiki/Special:ListGrants" title="Special:ListGrants">Grants</a></li>
      <li class="mw-specialpagerestricted"><a href="../wiki/Special:Notifications" title="Special:Notifications">Notifications</a></li>
      <li><a href="../wiki/Special:PasswordPolicies" title="Special:PasswordPolicies">Password policies</a></li>
      <li><a href="../wiki/Special:Contributions" title="Special:Contributions">User contributions</a></li>
      <li><a href="../wiki/Special:ListGroupRights" title="Special:ListGroupRights">User group rights</a></li>
      <li><a href="../wiki/Special:ListUsers" title="Special:ListUsers">User list</a></li>
      <li><a href="../wiki/Special:UserRights" title="Special:UserRights">User rights</a></li>
      </ul></div><h2 class="mw-specialpagesgroup" id="mw-specialpagesgroup-login">Account management</h2>
      <div class="mw-specialpages-list"><ul><li><a href="../wiki/Special:BotPasswords" title="Special:BotPasswords">Bot passwords</a></li>
      <li><a href="../wiki/Special:ChangeEmail" title="Special:ChangeEmail">Change email address</a></li>
      <li><a href="../wiki/Special:Preferences" title="Special:Preferences">Preferences</a></li>
      <li><a href="../wiki/Special:ResetTokens" title="Special:ResetTokens">Reset tokens</a></li>
      </ul></div><h2 class="mw-specialpagesgroup" id="mw-specialpagesgroup-changes">Recent changes and logs</h2>
      <div class="mw-specialpages-list"><ul><li><a href="../wiki/Special:AbuseLog" title="Special:AbuseLog">Abuse filter log</a></li>
      <li><a href="../wiki/Special:NewFiles" title="Special:NewFiles">Gallery of new files</a></li>
      <li><a href="../wiki/Special:Log" title="Special:Log">Logs</a></li>
      <li><a href="../wiki/Special:NewPages" title="Special:NewPages">New pages</a></li>
      <li><a href="../wiki/Special:RecentChanges" title="Special:RecentChanges">Recent changes</a></li>
      <li><a href="../wiki/Special:RecentChangesLinked" title="Special:RecentChangesLinked">Related changes</a></li>
      <li><a href="../wiki/Special:Tags" title="Special:Tags">Valid change tags</a></li>
      <li class="mw-specialpagerestricted"><a href="../wiki/Special:Watchlist" title="Special:Watchlist">Watchlist</a></li>
      </ul></div><h2 class="mw-specialpagesgroup" id="mw-specialpagesgroup-media">Media reports and uploads</h2>
      <div class="mw-specialpages-list"><ul><li><a href="../wiki/Special:ListFiles" title="Special:ListFiles">File list</a></li>
      <li class="mw-specialpagecached"><a href="../wiki/Special:ListDuplicatedFiles" title="Special:ListDuplicatedFiles">List of files with duplicates</a></li>
      <li><a href="../wiki/Special:MIMESearch" title="Special:MIMESearch">MIME search</a></li>
      <li class="mw-specialpagecached"><a href="../wiki/Special:MediaStatistics" title="Special:MediaStatistics">Media statistics</a></li>
      <li><a href="../wiki/Special:FileDuplicateSearch" title="Special:FileDuplicateSearch">Search for duplicate files</a></li>
      <li class="mw-specialpagerestricted"><a href="../wiki/Special:Upload" title="Special:Upload">Upload file</a></li>
      </ul></div><h2 class="mw-specialpagesgroup" id="mw-specialpagesgroup-wiki">Data and tools</h2>
      <div class="mw-specialpages-list"><ul><li><a href="../wiki/Special:ApiSandbox" title="Special:ApiSandbox">API sandbox</a></li>
      <li><a href="../wiki/Special:AbuseFilter" title="Special:AbuseFilter">Abuse filter management</a></li>
      <li><a href="../wiki/Special:BookSources" title="Special:BookSources">Book sources</a></li>
      <li><a href="../wiki/Special:ExpandTemplates" title="Special:ExpandTemplates">Expand templates</a></li>
      <li><a href="../wiki/Special:NamespaceInfo" title="Special:NamespaceInfo">Namespace information</a></li>
      <li><a href="../wiki/Special:Statistics" title="Special:Statistics">Statistics</a></li>
      <li><a href="../wiki/Special:AllMessages" title="Special:AllMessages">System messages</a></li>
      <li><a href="../wiki/Special:Version" title="Special:Version">Version</a></li>
      </ul></div><h2 class="mw-specialpagesgroup" id="mw-specialpagesgroup-redirects">Redirecting special pages</h2>
      <div class="mw-specialpages-list"><ul><li><a href="../wiki/Special:DeletePage" title="Special:DeletePage">Delete a page</a></li>
      <li><a href="../wiki/Special:Diff" title="Special:Diff">Differences</a></li>
      <li><a href="../wiki/Special:EditPage" title="Special:EditPage">Edit a page</a></li>
      <li><a href="../wiki/Special:NewSection" title="Special:NewSection">New section</a></li>
      <li><a href="../wiki/Special:PageHistory" title="Special:PageHistory">Page history</a></li>
      <li><a href="../wiki/Special:PageInfo" title="Special:PageInfo">Page info</a></li>
      <li><a href="../wiki/Special:PermanentLink" title="Special:PermanentLink">Permanent link</a></li>
      <li><a href="../wiki/Special:ProtectPage" title="Special:ProtectPage">Protect a page</a></li>
      <li><a href="../wiki/Special:Purge" title="Special:Purge">Purge</a></li>
      <li><a href="../wiki/Special:Random" title="Special:Random">Random page</a></li>
      <li><a href="../wiki/Special:RandomInCategory" title="Special:RandomInCategory">Random page in category</a></li>
      <li><a href="../wiki/Special:RandomRedirect" title="Special:RandomRedirect">Random redirect</a></li>
      <li><a href="../wiki/Special:RandomRootpage" title="Special:RandomRootpage">Random root page</a></li>
      <li><a href="../wiki/Special:Redirect" title="Special:Redirect">Redirect by file, user, page, revision, or log ID</a></li>
      </ul></div><h2 class="mw-specialpagesgroup" id="mw-specialpagesgroup-highuse">High use pages</h2>
      <div class="mw-specialpages-list"><ul><li><a href="../wiki/Special:MostLinkedCategories" title="Special:MostLinkedCategories">Most linked-to categories</a></li>
      <li class="mw-specialpagecached"><a href="../wiki/Special:MostLinkedFiles" title="Special:MostLinkedFiles">Most linked-to files</a></li>
      <li class="mw-specialpagecached"><a href="../wiki/Special:MostLinkedPages" title="Special:MostLinkedPages">Most linked-to pages</a></li>
      <li class="mw-specialpagecached"><a href="../wiki/Special:MostTranscludedPages" title="Special:MostTranscludedPages">Most transcluded pages</a></li>
      <li class="mw-specialpagecached"><a href="../wiki/Special:MostCategories" title="Special:MostCategories">Pages with the most categories</a></li>
      <li class="mw-specialpagecached"><a href="../wiki/Special:MostInterwikis" title="Special:MostInterwikis">Pages with the most interwikis</a></li>
      <li class="mw-specialpagecached"><a href="../wiki/Special:MostRevisions" title="Special:MostRevisions">Pages with the most revisions</a></li>
      </ul></div><h2 class="mw-specialpagesgroup" id="mw-specialpagesgroup-pagetools">Page tools</h2>
      <div class="mw-specialpages-list"><ul><li><a href="../wiki/Special:ComparePages" title="Special:ComparePages">Compare pages</a></li>
      <li><a href="../wiki/Special:Export" title="Special:Export">Export pages</a></li>
      <li><a href="../wiki/Special:WhatLinksHere" title="Special:WhatLinksHere">What links here</a></li>
      </ul></div><h2 class="mw-specialpagesgroup" id="mw-specialpagesgroup-other">Other special pages</h2>
      <div class="mw-specialpages-list"><ul><li><a href="../wiki/Special:Leaderboard" title="Special:Leaderboard">Achievements Leaderboard</a></li>
      <li><a href="../wiki/Special:UserRenameTool" title="Special:UserRenameTool">Change a user's name</a></li>
      <li><a href="../wiki/Special:CloseMyAccount" title="Special:CloseMyAccount">Close My Account</a></li>
      <li><a href="../wiki/Special:Community" title="Special:Community">Community</a></li>
      <li><a href="../wiki/Special:ConfirmEmail" title="Special:ConfirmEmail">Confirm email address</a></li>
      <li><a href="../wiki/Special:Contribute" title="Special:Contribute">Contribute</a></li>
      <li><a href="../wiki/Special:CreatePage" title="Special:CreatePage">Create a new page</a></li>
      <li><a href="../wiki/Special:CreateBlogListingPage" title="Special:CreateBlogListingPage">Create blog listing</a></li>
      <li><a href="../wiki/Special:DownloadYourData" title="Special:DownloadYourData">Download Your Data</a></li>
      <li><a href="../wiki/Special:SearchCommunity" title="Special:SearchCommunity">Find communities on FANDOM</a></li>
      <li class="mw-specialpagerestricted"><a href="../wiki/Special:InfoboxBuilder" title="Special:InfoboxBuilder">Infobox Builder</a></li>
      <li><a href="../wiki/Special:AllMaps" title="Special:AllMaps">Interactive Maps</a></li>
      <li><a href="../wiki/Special:JSPages" title="Special:JSPages">JavaScript pages</a></li>
      <li><a href="../wiki/Special:ListGlobalUsers" title="Special:ListGlobalUsers">List global users</a></li>
      <li><a href="../wiki/Special:UserLogin" title="Special:UserLogin">Log in / create account</a></li>
      <li><a href="../wiki/Special:UserLogout" title="Special:UserLogout">Log out</a></li>
      <li><a href="../wiki/Special:MapEditor" title="Special:MapEditor">Map editor</a></li>
      <li class="mw-specialpagecached"><a href="../wiki/Special:Withoutimages" title="Special:Withoutimages">Pages without images</a></li>
      <li><a href="../wiki/Special:Search" title="Special:Search">Search</a></li>
      <li><a href="../wiki/Special:SocialActivity" title="Special:SocialActivity">Social Activity</a></li>
      <li><a href="../wiki/Special:TagsReport" title="Special:TagsReport">Tags report</a></li>
      <li><a href="../wiki/Special:UserSignup" title="Special:UserSignup">UserSignup</a></li>
      </ul></div><div id="tooltip-storage" class="WikiaArticle" style="height: 0px; min-height: 0px; visibility: hidden; overflow: hidden; position: static; font-size: 14px;"><div class="main-tooltip tt-basic-tooltip" id="tooltip-basic-tooltip">Lorem ipsum dolor sit amet</div></div>
    </template>
  </WikiPageBase>
</template>


<script setup lang="ts"> 
const currentTheme = useCookie("theme", { "default": () => "Dark", watch: "shallow" });
const site = useRoute().params["site"]!;
const bob = useWikiMeta();
useSeoMeta({
  title: `Special pages | ${bob.value.site} | FancyBreeze`
})
</script>