<script setup lang="ts">
import type { API, Query } from '~~/shared/types/actionapi';

await navigateTo(`/${useRoute().params.site}/wiki/`+(await useWikiFetch<API.Response<[Query.Query<[{
    "random": {title: string}[]
}]>]>>("/uncached/query?list=random&rnnamespace=0&rnfilterredir=nonredirects")).data.value!["query"]["random"][0]!["title"].replaceAll(" ", "_"))
</script>