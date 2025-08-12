<template>
  <UApp>
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
</script>

<style>
body, html, #__nuxt {
  width: 100%;
  height: 100%;
}
</style>