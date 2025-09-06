<template>
    <div class="bg-elevated rounded-2xl !mt-2 !p-4 miraiwiki-footer lg:flex">
        <div class="flex-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="115" height="155" viewBox="372.6 -5 115 157" fill="none"><path stroke-width="9" stroke="#00DC82" d="M478.6 71.94 407.42.78a2.63 2.63 0 0 0-2.862-.572 2.63 2.63 0 0 0-1.628 2.422v59.84l-21.56-21.54a2.635 2.635 0 0 0-2.867-.57 2.63 2.63 0 0 0-1.623 2.43v61.79a14.68 14.68 0 0 0 4.31 10.42l28.05 28a14.77 14.77 0 0 0 10.4 4.3h20.53a14.72 14.72 0 0 0 10.39-4.3l28.05-28a14.67 14.67 0 0 0 4.3-10.39V82.34a14.66 14.66 0 0 0-4.31-10.4z"/><path stroke="#FDC700" stroke-width="6" d="M456.89 98a4.42 4.42 0 0 1-1.29 3.11L433 123.79a4.405 4.405 0 0 1-4.818.964 4.4 4.4 0 0 1-1.432-.964l-22.55-22.71a4.42 4.42 0 0 1-1.3-3.08v-8.66a4.42 4.42 0 0 1 1.3-3.12l8.12-8.12a4.42 4.42 0 0 1 6.24 0l11.35 11.36 11.33-11.36a4.42 4.42 0 0 1 6.24 0l8.11 8.12a4.4 4.4 0 0 1 1.3 3.12z"/></svg>
            <p style="font-size: 8px;">(lamest logo edit ever this is just fandom flame recolored to nuxt ui color)</p>
            <ULink to="https://github.com/HenrySck075/miraiwiki" style="text-decoration-line: underline;">MiraiWiki source code</ULink>
        </div>
        <div class="flex-1">
            <p><slot></slot></p>
            <p>Text content on wikis run by Fandom is available under the Creative Commons Attribution-Share Alike License 3.0 (Unported) unless stated otherwise, <ULink to="https://fandom.com/licensing">see license info</ULink>. Media files and official Fandom documents may have different copying restrictions.</p>
            <p>Fandom is a trademark of Fandom, Inc. This project is not affiliated with Fandom. (poof)</p>
        </div>
    </div>
</template>

<style>
.miraiwiki-footer > * {
    margin: 4px 0;
}
</style>