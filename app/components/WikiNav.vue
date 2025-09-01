<!--Mobile-only component-->

<template>
  <UCollapsible v-model:open="isOpen">
    <template #content>
      <div class="nav-content">
        <div class="flex flex-col gap-2 w-full nav-entries" ref="nav-entries">
          <template v-for="stackItem in [headersNavStack[headersNavStack.length-1]!]">
            <template v-if="stackItem.to">
              <!--back button-->
              <UButton color="neutral" variant="ghost" @click="pop" class="font-bold">
                <template #leading>
                  <UIcon name="mdi:chevron-left" size="20" class="mr-1"></UIcon>
                </template>
                Back
              </UButton>
              <USeparator></USeparator>
              <!--<UButton color="neutral" variant="ghost" :to="stackItem.to" class="font-bold">{{ stackItem.label }}</UButton>-->
            </template>
            <!--because in practice the headers list is configured so that the item is copied to its children list (if any) on the very first entry-->
            <!--update: thats a lie its only there if the header has a link-->
            <UButton color="neutral" variant="ghost" v-if="stackItem.children[0]?.label !== stackItem.label" class="font-bold hover:bg-default/0">{{ stackItem.label }}</UButton>
            <template v-for="(entry, idx) in stackItem.children">
              <UButton :class="[entry.label === stackItem.label && idx === 0 && stackItem.to ? 'font-bold' : 'font-normal', 'hover:bg-default/70']" color="neutral" variant="ghost" :to="entry.children ? undefined : entry.to" @click="()=>{entry.children ? navigate(entry) : undefined}">
                {{ entry.label }}
                <template #trailing v-if="entry.children">
                  <div class="flex-1"></div>
                  <UIcon name="mdi:chevron-right" size="20"></UIcon>
                </template>
              </UButton>
            </template>
          </template>
        </div>
      </div>
    </template>
  </UCollapsible>
</template>

<script setup lang="ts">
type HeaderEntry = {
  label: string,
  icon?: string,
  to: string,
  class?: string,
  children?: HeaderEntry[]
}

const {headers} = defineProps<{
  headers: HeaderEntry[]
}>();

const headersNavStack = shallowRef<{label?: string, to?: string, children: HeaderEntry[]}[]>([{children: headers}]);
const navEntriesContainer = useTemplateRef("nav-entries");
function navigate(h: HeaderEntry) {
  if (h.children && navEntriesContainer.value) {
    headersNavStack.value.push({label: h.label, to: h.to, children: h.children});
    navEntriesContainer.value!.dataset["state"] = "removeForward";
    setTimeout(()=>{
      navEntriesContainer.value!.dataset["state"] = "addForward";
      triggerRef(headersNavStack);
    }, 100)
  }
}
function pop() {
  if (headersNavStack.value.length > 1 && navEntriesContainer.value) {
    headersNavStack.value.pop();
    navEntriesContainer.value!.dataset["state"] = "removeBackward";
    setTimeout(()=>{
      navEntriesContainer.value!.dataset["state"] = "addBackward";
      triggerRef(headersNavStack);
    }, 100)
  }
}

const isOpen = defineModel<boolean>('open');
</script>

<style scoped>

.nav-content {
  /*padding: 1rem;
  /*background-color: #f9fafb; /* Light gray background to distinguish it */
  border-bottom-left-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);

  --emphasized-decelerate: cubic-bezier(0.05, 0.7, 0.1, 1.0);
  --emphasized-accelerate: cubic-bezier(0.3, 0.0, 0.8, 0.15);
}

.nav-entries {
  transition: height 0.5s var(--emphasized-decelerate);
}

.nav-entries[data-state=removeForward] > * {
  /* an emphasized-accelerate slide-left fade-out effect*/
  animation: slide-left-fade-out 0.1s var(--emphasized-accelerate);
}
.nav-entries[data-state=removeBackward] > * {
  /* an emphasized-accelerate slide-left fade-out effect*/
  animation: slide-right-fade-out 0.1s var(--emphasized-accelerate);
}
.nav-entries[data-state=addForward] > * {
  /* an emphasized-decelerate slide-right fade-in effect*/
  animation: slide-right-fade-in 0.15s var(--emphasized-decelerate);
}
.nav-entries[data-state=addBackward] > * {
  /* an emphasized-decelerate slide-right fade-in effect*/
  animation: slide-left-fade-in 0.15s var(--emphasized-decelerate);
}
@keyframes slide-left-fade-out {
  0% {
    opacity: 1;
    transform: translateX(0);
  }
  100% {
    opacity: 0;
    transform: translateX(-20px);
  }
}
@keyframes slide-right-fade-in {
  0% {
    opacity: 0;
    transform: translateX(20px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}
@keyframes slide-right-fade-out {
  0% {
    opacity: 1;
    transform: translateX(0);
  }
  100% {
    opacity: 0;
    transform: translateX(20px);
  }
}
@keyframes slide-left-fade-in {
  0% {
    opacity: 0;
    transform: translateX(-20px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>