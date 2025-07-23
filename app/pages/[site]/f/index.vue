<template>
  <div v-if="data" class="px-3">
    <div id="threadsListView" class="flex flex-col !space-y-4">
      <div class="flex flex-row">
        <UPopover mode="hover">
          <UButton trailing-icon="material-symbols:keyboard-arrow-down-rounded">Categories</UButton>
          <template #content>
            <div class="max-h-96 overflow-x-hidden overflow-y-scroll">
              <div class="flex flex-col">
                <template v-for="forum in data._embedded.forums.toSorted((a,b)=>threadCountOf(b)-threadCountOf(a))">
                  <UButton color="neutral" variant="ghost">
                    <div class="flex flex-col" style="text-align: left;">
                      <span>{{ forum.name == "Root Forum" ? "All" : forum.name }}</span>
                      <span class="text-gray-400">
                        <strong>{{ forum.name == "Root Forum" ? data.threadCount : forum.threadCount }}</strong>
                        posts
                      </span>
                    </div>
                  </UButton>
                </template>
              </div>
            </div>
          </template>
        </UPopover>
      </div>
      <template v-for="thread in data._embedded.threads">
        <DiscussionPost :data="thread" class="fancybreeze-post__constrained" />
      </template>
    </div>
  </div>
  <div v-else>
    Loading...
  </div>
</template>

<script setup lang="ts">
import type { Forum } from '~~/shared/types/forum/forum';
import type { DiscussionThreads } from '~~/shared/types/forum/resp';

function threadCountOf(forum: Forum) {
  return forum.name == "Root Forum" ? data.value!.threadCount : forum.threadCount;
}

definePageMeta({
  layout: "wiki"
})

const {data: data} = await useFetch<DiscussionThreads>("/api/samples/f");

</script>

<style>
.fancybreeze-post__constrained {
  --max-content-height: 700px;
}
.fancybreeze-post__constrained .fancybreeze-post__content {
	max-height: var(--max-content-height) !important;
  position: relative;
  overflow-y: hidden;
}
.fancybreeze-post__constrained .fancybreeze-post__content::before {
	background: linear-gradient(to bottom,color-mix(in oklab, var(--ui-bg-accented) 0%, transparent) 300px,var(--ui-bg-accented) 100%);
	height: var(--max-content-height);
	pointer-events: none;
	content: "";
	position: absolute;
	width: 100%;
	z-index: 7777;
}
</style>