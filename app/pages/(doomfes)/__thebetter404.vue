<template>
  <div class="flex flex-col items-center justify-center min-h-screen py-16">
    <div class="text-center" style="max-width: 520px">
      <h1 class="sm:text-[110px] text-[80px] font-semibold text-neutral mb-4 leading-none tabular-nums">404</h1>
      <h2 class="sm:text-3xl text-2xl font-semibold mb-2">Page not found: {{ decodeURI($route.fullPath) }}</h2>
      <p class="text-md text-[#64748B] mb-4">
        Seems like you forget to specify where this belongs to. Where did you want to go, explorer?
      </p>
      <div class="flex flex-col gap-4 items-center">
        <UButton
          color="neutral"
          variant="ghost"
          class="underline font-bold"
          :disabled="!lastVisitedWiki"
          @click="goToLastVisited"
        >
          Go back home
        </UButton>
        <div class="w-full max-w-xs">
          <UInput
            id="other-wiki"
            v-model="otherWiki"
            type="text"
            placeholder="...or to another place (enter wiki name)"
            class="input input-bordered w-full"
            @keyup.enter="goToOtherWiki"
          >
            <template #trailing>
              <UButton
                color="neutral"
                variant="ghost"
                :disabled="!otherWiki"
                icon="mdi:send-variant"
                @click="goToOtherWiki"
              />
            </template>
          </UInput>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter, useCookie } from '#imports'
import { ref } from 'vue'

const route = useRoute()
const router = useRouter()
const path = route.fullPath.replace(/^\/+/, '') // remove leading slash

const lastVisitedWiki = useCookie('lastVisitedWiki').value
const otherWiki = ref('')

function goToLastVisited() {
  if (lastVisitedWiki) {
    router.push(`/${lastVisitedWiki}/${path}`)
  }
}

function goToOtherWiki() {
  if (otherWiki.value) {
    router.push(`/${otherWiki.value}/${path}`)
  }
}

definePageMeta({
  alias: ["/wiki/:page(.*)*", "/f", "/f/p/:id"]
});

useSeoMeta({
    "ogTitle": "Not the path you're looking for.",
    "title": `404 - Page not found: ${route.fullPath} | Nuxt`,
    "description": "...but you might know where to go."
})
</script>

<style>
:root {
  --ui-bg: #020420 !important;
}
</style>