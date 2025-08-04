<template>
  <div class="px-3 mx-auto" style="max-width: var(--f-max-width);" v-if="data">
    <DiscussionPost :data="data">
      <template #header>
        <UButton class="!mx-0" variant="link" color="neutral" to="../" icon="mdi:arrow-left">
          All Posts
        </UButton>
      </template>
      <template #content>
        <div class="flex flex-col !space-y-2 !mt-2"
          v-if="posts && posts.length != 0">
          <UButton @click="query" v-if="prev != null" loading-auto>Older posts</UButton>
          <template v-for="reply in posts.toSorted((a, b) => a.position - b.position)">
            <Reply :data="threadPostAsPost(reply)"></Reply>
          </template>
        </div>
      </template>
    </DiscussionPost>
  </div>
  <div v-else>
    Loading...
  </div>
</template>

<script setup lang="ts">
import type { Thread, ThreadExtra } from '~~/shared/types/forum/thread';
import type { ThreadPost } from '~~/shared/types/forum/thread_post';
import type { Post } from '~~/shared/types/post';

definePageMeta({
  layout: "wiki"
})
function threadPostAsPost(tp: ThreadPost): Post {
  return {
    id: tp.id,
    createdBy: tp.createdBy,
    creationDate: tp.creationDate,
    userData: {
      postId: Number.parseInt(tp.id),
      hasUpvoted: tp._embedded.userData?.[0]?.hasUpvoted ?? false,
      permissions: {
        canEdit: tp.isEditable,
        canDelete: tp.isEditable,
      },
      isReported: tp._embedded.userData?.[0]?.hasReported ?? false
    },
    jsonModel: tp.jsonModel,
    attachments: tp._embedded.attachments[0]!,
    upvoteCount: tp.upvoteCount,
  }
}
const route = useRoute();
const posts = ref<ThreadPost[]>([]);

let prev = ref<string | null>("");

let author = "";
let title = "";

let data: globalThis.Ref<ThreadExtra | undefined, ThreadExtra | undefined> | null = null;
async function query() {
  
  data = ((prev.value != null && prev.value?.length == 0) ? await useFetch<ThreadExtra>(
    `/api/${route.params.site}/DiscussionThread/getThread`,
    {
      query: {
        "threadId": route.params.id,
        "responseGroup": "full",
        "sortDirection": "descending",
        "sortKey": "creation_date",
        "viewableOnly": "false"
      }
    }
  ) : await useFetch<ThreadExtra>(prev.value!)).data;
  posts.value.unshift(...data.value!._embedded['doc:posts']);
  author = data.value!.createdBy.name;
  title = data.value!.title;
  
  prev.value = data.value!._links.next?.[0]?.href ?? null;
  if (prev.value) {
    let u = URL.parse(prev.value)!;
    let c = useRequestURL();
    u.host = c.host;
    u.protocol = c.protocol;
    u.pathname = `/api/${route.params.site}/DiscussionThread/getThread`
    u.searchParams.delete('controller');
    u.searchParams.delete('method');

    prev.value = u.toString();

    
  }
}  

await query();

useSeoMeta({
  title: ()=>`From ${author}: ${title} | FancyBreeze`
})
//
</script>