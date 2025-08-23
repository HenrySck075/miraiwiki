import { useState, watch } from '#imports'
import { ref, onMounted } from 'vue'

export interface Settings {
  enableExploreNav: boolean
}

export function useSettings() {
  // Define default settings
  const defaultSettings: Settings = {
    enableExploreNav: false, // nobody wants to
  }

  // Reactive state for settings.
  // We'll use `useState` to ensure it's SSR-friendly.
  const settings = useState<Settings>('app-settings', () => defaultSettings)

  // A boolean to track if the settings have been loaded from localStorage
  const isSettingsLoaded = ref(false)

  // Watch for changes and save to localStorage
  watch(settings, (newSettings) => {
    if (import.meta.client) {
      localStorage.setItem('app-settings', JSON.stringify(newSettings))
    }
  }, { deep: true })

  // Load settings from localStorage when the component is mounted
  onMounted(() => {
    // in which case is onMounted runs on ssr
    if (import.meta.client) {
      const storedSettings = localStorage.getItem('app-settings')
      if (storedSettings) {
        try {
          settings.value = JSON.parse(storedSettings)
        } catch (error) {
          console.error('Failed to parse settings from localStorage:', error)
          // If parsing fails, reset to default
          settings.value = defaultSettings
        }
      }
    }
    isSettingsLoaded.value = true
  })

  return {
    settings,
    isSettingsLoaded,
  }
}