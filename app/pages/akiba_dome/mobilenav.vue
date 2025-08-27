<template>
  <div class="header-container">
    <div class="space-x-1 p-3 bg-default/60 backdrop-blur sticky-header">
      <div class="header-content">
        <div class="flex-1"></div>
        <UButton
          :icon="isOpen ? 'mdi:chevron-up' : 'mdi:chevron-down'"
          variant="ghost"
          aria-label="Toggle Collapsible"
          @click="isOpen = !isOpen"
        />
      </div>
      <WikiNav :headers="headersMock" v-model:open="isOpen"/>
    </div>


    <div class="main-content">
      <p>Scroll down to see the sticky header in action.</p>
      <div v-for="n in 20" :key="n" class="placeholder-text">
        <p>Placeholder content for scrolling purposes...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const isOpen = ref(false);

const headersMock = [
  {
    label: "Home",
    to: "/",
    icon: "mdi:home"
  },
  {
    label: "About",
    to: "/about",
    icon: "mdi:information"
  },
  {
    label: "Services",
    to: "/services",
    icon: "mdi:cog",
    children: [
      {
        label: "Consulting",
        to: "/services/consulting"
      },
      {
        label: "Development",
        to: "/services/development",
        children: [
          {
            label: "Web Development",
            to: "/services/development/web"
          },
          {
            label: "Mobile Development",
            to: "/services/development/mobile"
          }
        ]
      }
    ]
  },
  {
    label: "Contact",
    to: "/contact",
    icon: "mdi:phone"
  }
]

</script>

<style scoped>

.sticky-header {
  position: sticky;
  top: 0;
  z-index: 1000;
  width: 100%;
  border-radius: 0;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}


.title {
  font-size: 1.5rem;
  font-weight: bold;
}

.main-content {
  margin-top: 1rem;
}

.placeholder-text {
  height: 50px;
}


</style>