<template>
  <UModal title="Settings" v-model="isOpen">
    <slot></slot>

    <template #body>
      <div class="space-y-4">
        <SettingsMenuEntry title="Enable explore navigation bar" subtitle="Toggle the explore navigation bar, well, that bar on the left suggesting pages related to the current page, yknow">
          <USwitch v-model="settings.enableExploreNav" class="mt-1" />
        </SettingsMenuEntry>
        <!--
        <div class="flex items-center justify-between">
          <SettingsMenuEntry title="Color Mode" subtitle="Switch between light and dark mode" class="w-full">
            <USelectMenu v-model="settings.colorMode" :items="['light', 'dark']" class="mt-1" />
          </SettingsMenuEntry>
        </div>
        -->
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { useSettings } from '~/composables/settings';

const isOpen = defineModel<boolean>();

// Use our settings composable
const { settings } = useSettings();
</script>