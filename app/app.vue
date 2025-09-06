<template>
  <UApp>
    <!--because nuxt wipes the eentire head content away-->
    <div id="mw-scripts"></div>
    <NuxtLoadingIndicator />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<script setup lang="ts">
useRouter().options.scrollBehavior = (to, from, savedPosition) => {
  console.log(savedPosition);
  // If a saved position exists (e.g., from browser back/forward navigation),
  // restore it.
  if (to.hash) {
      // If a hash exists in the target route, scroll to that element
      return {
        el: to.hash,
        behavior: 'smooth', // Optional: for smooth scrolling
      };
    }
  else if (savedPosition) {
    return savedPosition;
  }

  // Otherwise, scroll to the top of the page.
  return { top: 0, behavior: 'instant' }; // 'instant' for immediate scroll, 'smooth' for animation
};

import {UAParser} from 'ua-parser-js';

const c = useCookie("deviceTypeDetected");

if (import.meta.server && !c.value) {
  const agent = useRequestHeader("user-agent");
  const parser = new UAParser(agent);
  const deviceType = parser.getDevice().type; // 'mobile', 'tablet', 'smarttv', etc.
  useCookie("mobile").value = deviceType === 'mobile' || deviceType === 'tablet' ? "" : null;
  c.value = "";
}
</script>

<style>
body, html, #__nuxt {
  width: 100%;
  height: 100%;
}

html {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
html::-webkit-scrollbar {
  display: none
}

.brackets::before {
  content: "("
}
.brackets::after {
  content: ")"
}
</style>