<template>
  <div class="flex flex-col items-center justify-center min-h-screen">
    <SettingsMenu v-model="isSettingsModalOpen">
      <UButton class="mt-8" @click="isSettingsModalOpen = true">
        Open Settings
      </UButton>
    </SettingsMenu>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useSettings } from '~/composables/settings';

// Local state to control the modal visibility
const isSettingsModalOpen = ref(false);

// Use our settings composable
const { settings } = useSettings();
</script>