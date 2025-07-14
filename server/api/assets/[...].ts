export default defineEventHandler((e)=>{
    const path = getRouterParams(e);
    if (path) {
        e.node.res.setHeader("cache-control", "max-age=1800");
        return $fetch(`https://${path._}`)
    }
})