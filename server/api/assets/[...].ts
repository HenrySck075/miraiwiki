export default defineEventHandler((e)=>{
    const path = getRouterParams(e)
    if (path) {
        return $fetch(`https://${path._}`)
    }
})