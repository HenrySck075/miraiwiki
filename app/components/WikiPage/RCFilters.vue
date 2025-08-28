<script setup lang="ts">

// Define the filter item interface
interface FilterItem {
  name: string
  desc: string
  onToggled: (state: boolean) => void
}

// Define the filter group interface
interface FilterGroup {
  title: string
  items: FilterItem[]
}

const filters = ref<FilterGroup[]>([
  {
    title: 'User registration and experience',
    items: [
      {
        name: 'Unregistered',
        desc: "Editors who aren't logged in",
        onToggled: (state: boolean) => {
          console.log(`0 0: ${state}`)
        },
      },
      {
        name: 'Registered',
        desc: 'Logged-in editor',
        onToggled: (state: boolean) => {
          console.log(`0 1: ${state}`)
        },
      },
      {
        name: 'Newcomers',
        desc: 'Registered editors who have fewer than 10 edits or 4 days of activity',
        onToggled: (state: boolean) => {
          console.log(`0 2: ${state}`)
        },
      },
      {
        name: 'Learners',
        desc: 'Registered editors whose experience falls between "Newcomers" and "Experienced users".',
        onToggled: (state: boolean) => {
          console.log(`0 3: ${state}`)
        }
      },
      {
        name: 'Experienced users',
        desc: 'Registered editors with more than 500 edits and 30 days of activity.',
        onToggled: (state: boolean) => {
          console.log(`0 4: ${state}`)
        },
      },
    ],
  },
  /*
  {
    title: 'Contribution authorship',
    items: [
      {
        name: 'Changes by you',
        desc: 'Your own contributions',
        onToggled: (state: boolean) => {
          console.log(`own: ${state}`)
          // Add your logic here to apply the filter
        },
      },
      {
        name: 'Changes by others',
        desc: 'All changes except your own',
        onToggled: (state: boolean) => {
          console.log(`Small filter toggled: ${state}`)
          // Add your logic here to apply the filter
        },
      },
    ],
  },
  */
  {
    title: 'Automated contributions',
    items: [
      {
        name: 'Bot',
        desc: 'Edits made by automated tools',
        onToggled: (state: boolean) => {
          console.log(`bot: ${state}`)
        },
      },
      {
        name: 'Human',
        desc: 'Edits made by humans',
        onToggled: (state: boolean) => {
          console.log(`!bot: ${state}`)
        },
      },
    ]
  },
  {
    title: 'Significance',
    items: [
      {
        name: 'Minor edits',
        desc: 'Edits marked as minor by the editor',
        onToggled: (state: boolean) => {
          console.log(`minor: ${state}`)
        },
      },
      {
        name: 'Non-minor edits',
        desc: 'Edits not marked as minor',
        onToggled: (state: boolean) => {
          console.log(`!minor: ${state}`)
        },
      },
    ],
  },
  {
    title: 'Latest revisions',
    items: [
      {
        name: 'Latest revisions',
        desc: 'Only show the latest revision by each editor',
        onToggled: (state: boolean) => {
          console.log(`2 0: ${state}`)
        },
      },
    ]
  }
])

// A ref to track which filters are currently selected
const selectedFilters = ref<string[]>([])

// Toggles the state of a filter. It adds or removes the filter name from the selectedFilters array.
const toggleFilter = (filter: FilterItem) => {
  const index = selectedFilters.value.indexOf(filter.name)
  const isCurrentlySelected = index !== -1

  if (isCurrentlySelected) {
    selectedFilters.value.splice(index, 1)
  } else {
    selectedFilters.value.push(filter.name)
  }

  // Call the onToggled callback function
  filter.onToggled(!isCurrentlySelected)
}

// A computed property that returns a boolean indicating whether a filter is currently selected.
const isSelected = (filterName: string) => {
  return selectedFilters.value.includes(filterName)
}

// Clears all selected filters.
const clearFilters = () => {
  selectedFilters.value.forEach((filterName) => {
    const group = filters.value.find((g) => g.items.some((i) => i.name === filterName))
    if (group) {
      const item = group.items.find((i) => i.name === filterName)
      if (item) {
        item.onToggled(false)
      }
    }
  })
  selectedFilters.value = []
}

const dropdownOpen = defineModel<boolean>();
</script>

<template>
  <div>
    <UPopover v-model:open="dropdownOpen" :ui="{content: 'bg-accented'}">
      <template #anchor>
        <UInputTags
          :model-value="selectedFilters"
          :placeholder="selectedFilters.length === 0 ? 'Select filters...' : ''"
          disabled
          class="w-full"
        >
          <template #leading>
            <UButton
              v-if="selectedFilters.length > 0"
              icon="i-heroicons-x-mark-20-solid"
              variant="ghost"
              class="-my-1"
              @click.stop="clearFilters"
            />
            <UIcon v-else name="i-heroicons-funnel-20-solid" class="text-xl" />
          </template>
        </UInputTags>
      </template>
      <template #content>
        <div class="flex flex-col justify-between p-2 max-w-[650px] h-[250px] overflow-y-scroll">
          <div v-for="items in filters">
            <p class="font-bold pt-2">{{ items.title }}</p>
            <UButton v-for="item in items.items" class="w-full" color="neutral" variant="outline">
              <template #leading>
                <UCheckbox @update:model-value="(v)=>item.onToggled(v as boolean)" />
              </template>
              <div class="flex flex-col items-start">
                <span class="truncate">{{ item.name }}</span>
                <p class="text-xs text-gray-500 truncate">{{ item.desc }}</p>
              </div>
            </UButton>
          </div>
        </div>
      </template>
    </UPopover>
  </div>
</template>