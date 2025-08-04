<template>
  <div class="px-3 mx-auto" style="max-width: var(--f-max-width);" v-if="data">
    <!--TODO: uhh maybe move welcome container to the left on widescreen-->
    <div class="flex flex-row mb-2" style="grid-area: main">
      <UPopover mode="hover" v-model:open="popoverState">
        <UButton trailing-icon="mdi:keyboard-arrow-down">Categories</UButton>
        <template #content>
          <div class="max-h-96 overflow-x-hidden overflow-y-scroll">
            <div class="flex flex-col">
              <template v-for="forum in forums">
                <UButton color="neutral" variant="ghost" @click="setCurrentThread(forum.id)">
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
    <div class="grid gap-4" style="grid-template-columns: 2fr 1fr;">
      <div id="threadsListView" class="flex flex-col !space-y-4">
        <template v-for="thread in threads">
          <DiscussionPost :data="thread" class="fancybreeze-post__constrained" />
        </template>
        <UButton class="w-full" style="text-align: center;" @click="fetchThreads()" loading-auto>Load more</UButton>
      </div>
      <div id="rightPane" v-if="feeds">
        <div class="right-pane-element" style="text-align: center; align-content: center; align-items: center;" v-once>
          <strong>Welcome to the community!</strong>
          <span style="margin-top: -2px">{{ feeds.wikiVariables.wikiDescription }}</span>
          <USeparator class="py-2 border-accented" size="lg"/>
            <span>Help us grow {{ feeds.wikiVariables.name }}</span>
            <div class="flex flex-row-reverse" id="avatars" style="justify-content: center;">
              <template v-for="user in feeds.wikiDetails.topUsers.toReversed()">
                <UAvatar class="amogus" :src="user.avatarUrl"></UAvatar>
              </template>
            </div>
            <div class="flex flex-row justify-around w-full mx-3" style="text-align: center; max-width: 170px;">
              <div style="overflow-wrap: anywhere">
                <div><strong>{{ feeds.wikiDetails.editCount }}</strong></div>
                <div style="text-transform: uppercase;">edits</div>
              </div>
              <div style="overflow-wrap: anywhere">
                <div><strong>{{ feeds.wikiDetails.pageCount }}</strong></div>
                <div style="text-transform: uppercase;">pages</div>
              </div>
            </div>
            <UButton :to="feeds.wikiVariables.getStartedUrl">Get Started</UButton>
        </div>
        <div class="right-pane-element" v-once>
          <strong>Explore</strong>
          <USeparator class="border-accented"></USeparator>
          <ul class="grid" style="grid-template-columns: repeat(3,1fr);">
            <template v-for="page in feeds.topArticles">
              <li style="margin: 0 6px 18px; text-align: center;">
                <ULink :to="`/${route.params.site}`+convertURL(page.url)">
                  <div :style="{'background-image': `url('${convertAssetsURL(page.image)}')`}" class="piratadescagar"></div>
                  <div class="label">{{ page.title }}</div>
                </ULink>
              </li>
            </template>
          </ul>
        </div>
        <div class="right-pane-element sticky top-4" v-once>
          <strong>Activity</strong>
          <USeparator class="border-accented"></USeparator>
          <div class="flex flex-col">
            <template v-for="forum in data._embedded.forums">
              <UButton color="neutral" variant="ghost" v-if="forum.name != 'Root Forum'" :to="`?catId=${forum.id}`">
                <div class="flex flex-row w-full">
                  <div>
                    <div class="flex flex-col" style="text-align: left;">
                      <span>{{ forum.name }}</span>
                      <span class="text-gray-400" style="font-size: 12px">
                        <span>
                          <strong>{{ forum.threadCount }}</strong>
                          Posts
                        </span>
                        <template v-if="forum.latestContribution.date">
                          <span class="px-1">·</span>
                          <span>New reply </span>
                          <span>{{ relativeTimeOf(forum.latestContribution.date.epochSecond) }}</span>
                        </template>
                      </span>
                    </div>
                  </div>
                  <div class="flex-1"></div>
                  <div>
                    <div class="flex flex-row-reverse" id="avatars" style="justify-content: center;">
                      <template v-for="user in forum.recentContributors.toReversed()">
                        <UAvatar class="amogus" :src="user.avatarUrl ?? '/defaultpfp.jpg'"></UAvatar>
                      </template>
                    </div>
                  </div>
                </div>
              </UButton>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    Loading...
  </div>
</template>

<script setup lang="ts">
import type { FeedsAndPosts } from '~~/shared/types/feeds';
import type { Forum } from '~~/shared/types/forum/forum';
import type { DiscussionThreads } from '~~/shared/types/forum/resp';
import type { Thread } from '~~/shared/types/forum/thread';
import { convertAssetsURL, relativeTimeOf } from '~~/shared/utils/utils';
const popoverState = ref(false);
const route = useRoute();
function threadCountOf(forum: Forum) {
  return forum.name == "Root Forum" ? data.value!.threadCount : forum.threadCount;
}

definePageMeta({
  layout: "wiki",
  // setting the page key prevents nuxt app from being accessible
  //key: "discussions"
})

const threads= ref<Thread[]>([])
const data = ref<DiscussionThreads>();
const forumId = ref(useRoute().query["catId"] as string ?? "");
let nextThreadsUrl: string | null = "https://love-live.fandom.com/wikia.php?controller=DiscussionThread&method=getThreads&responseGroup=small&sortDirection=descending&sortKey=trending&viewableOnly=true&limit=20&page=0";

async function fetchThreads() {
  let uri = URL.parse(nextThreadsUrl!);
  const params = uri!.searchParams;
  const ctrl = params.get("controller")!;
  const method = params.get("method")!;
  params.delete("controller");
  params.delete("method");
  if (forumId.value !== "") {
    params.append("forumId", forumId.value);
  }
  const q = await useFetch<DiscussionThreads>(
    `/api/${route.params.site}/${ctrl}/${method}?${params.toString()}`
  ).then((d)=>{
    threads.value.push(...d.data.value!._embedded.threads);
    nextThreadsUrl = d.data.value!._links.next?.[0]?.href || null;
    triggerRef(threads);
    return d.data.value!;
  });
  if (data.value === undefined) data.value = q;
}
await fetchThreads();

const banger = useRouter();
function setCurrentThread(id: string) {
  forumId.value = id;
  popoverState.value = false;
  banger.push({
    query: {
      "catId": id
    }
  })
  threads.value = [];
  return fetchThreads();
}

const forums = computed(()=>data.value!._embedded.forums.toSorted((a,b)=>threadCountOf(b)-threadCountOf(a)))


const {data: feeds} = await useFetch<FeedsAndPosts>(`/api/${route.params.site}/FeedsAndPosts/getAll`)
useSeoMeta({
  title: ()=>`Discuss everything about ${feeds.value?.wikiVariables.name} | FancyBreeze`
})
</script>

<style>
@reference "tailwindcss";

.fancybreeze-post__constrained {
  --max-content-height: 700px;
}
.fancybreeze-post__constrained .fancybreeze-post__content {
	max-height: var(--max-content-height) !important;
  position: relative;
  overflow-y: hidden;
}
.fancybreeze-post__constrained .fancybreeze-post__content::before {
	background: linear-gradient(to bottom,color-mix(in oklab, var(--ui-bg-elevated) 0%, transparent) 300px,var(--ui-bg-elevated) 100%);
	height: var(--max-content-height);
	pointer-events: none;
	content: "";
	position: absolute;
	width: 100%;
	z-index: 7777;
}
#avatars .amogus:not(:last-child) {
  margin-left: -10px;
}
#rightPane > * {
  margin-bottom: 18px;
}

.right-pane-element {
  @apply rounded-sm flex flex-col space-y-4 p-2;
  background-color: var(--ui-bg-elevated);
}

.piratadescagar {
  background-color: unset;
	background-repeat: no-repeat;
	background-size: cover;
	/*border: 1px solid var(--theme-border-color);*/
	border-radius: 3px;
	margin-bottom: 8px;
	padding-top: 100%;
	position: relative;
	width: 100%;
}
.right-pane-element .label {
	color: var(--text-color-default);
	font-size: 12px;
	letter-spacing: .3px;
	line-height: 1.17em;
	margin-top: 9px;
	overflow: hidden;
	text-overflow: ellipsis;
	/*transition: color .3s;*/
	word-break: break-word;
}
</style>