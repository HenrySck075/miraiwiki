export default defineEventHandler((e)=>{
    return $fetch(`https://${getRouterParam(e, "site")}.fandom.com/wikia.php?controller=ArticleCommentsController&method=getComments&title=${decodeURI(getRouterParam(e, "page")!)}&namespace=0&hideDeleted=true`)
})