<template>
  <div class="px-3 mx-auto" style="max-width: var(--f-max-width);" v-if="data">
    <DiscussionPost :data="data">
      <template #header>
        <UButton class="!mx-0" variant="link" color="neutral" to="../" icon="material-symbols:arrow-left-alt-rounded">
          All Posts
        </UButton>
      </template>
      <template #content>
        <div class="flex flex-col !space-y-2 !mt-2" v-if="data._embedded['doc:posts'] && data._embedded['doc:posts'].length != 0">
          <template v-for="reply in data._embedded['doc:posts']">
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
import type { ThreadExtra } from '~~/shared/types/forum/thread';
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
  const {data} = await useFetch<ThreadExtra>(
    `/api/${route.params.site}/DiscussionThread/getThread`,
    {
      query: {
        "threadId":route.params.id,
        "responseGroup":"full",
        "sortDirection":"descending",
        "sortKey":"creation_date",
        "viewableOnly":"false"
      }
    }
  )
  //console.log(data.value?._embedded['doc:posts']?.[0]?._embedded)
</script>