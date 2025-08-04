<template>
  <div>
    <div class="inline-flex space-x-2 rounded-lg overflow-hidden bg-default ring ring-default w-full" style="align-items: center;">
      <UButton @click="playAudio" :icon="paused ? 'mdi:play-arrow' : 'mdi:pause'" color="neutral" variant="ghost" />
      <USlider v-model="playProg"></USlider>
      <span style="white-space: nowrap;">{{ current }} / {{ duration }}</span>
      <UButton :icon="muted ? 'mdi:volume-off' : 'mdi:volume-up'" @click="muted = !muted" color="neutral" variant="ghost" />
      <USlider v-model="volume" class="w-md"></USlider>
    </div>
    <audio :src="audioSrc" style="display:none" ref="balls"></audio>
  </div>
</template>

<script setup lang="ts">
  const {src: audioSrc} = defineProps<{
    src: string
  }>();
  
  const audioElem = useTemplateRef("balls");
  const playProg = computed({
    get() {
      current.value;
      if (!audioElem.value) return 0;
      return audioElem.value.duration === Infinity ? 0 : audioElem.value.currentTime / audioElem.value.duration * 100 || 0;
    },
    set(value) {
      if (!audioElem.value) return;
      audioElem.value.currentTime = (value / 100) * audioElem.value.duration;
    }
  });
  const volume = customRef((t,tr)=>{
    return {
      get() {
        if (!audioElem.value) return 0;
        t();
        return audioElem.value.volume * 100;
      },
      set(value) {
        if (!audioElem.value) return;
        audioElem.value.volume = value / 100;
        tr();
      }
    }
  });
  const durationRecomputeKey = ref(true);
  const current = computed(() => {
    (durationRecomputeKey.value || true) // effectively does nothing
    if (!audioElem.value) return "0:00";
    const sec = Math.floor(audioElem.value.currentTime);
    const min = Math.floor(sec / 60);
    return `${min}:${(sec % 60).toString().padStart(2, '0')}`;
  });
  const duration = computed(() => {
    // it is nan on hot reload thats cool
    if (
      !audioElem.value || audioElem.value.duration === Infinity || Number.isNaN(audioElem.value?.duration)
    ) return "0:00";
    const sec = Math.floor(audioElem.value.duration);
    const min = Math.floor(sec / 60);
    return `${min}:${(sec % 60).toString().padStart(2, '0')}`;
  });
  const paused = ref(true);
  const muted = customRef((t,tr)=>{
    return {
      get() {
        t();
        return volume.value === 0 || audioElem.value!.muted;
      },
      set(value){
        audioElem.value!.muted = value;
        tr();
      }
    }
  })

  function playAudio() {
    if (!audioElem.value) return;
    if (audioElem.value.paused) audioElem.value.play();
    else audioElem.value.pause();
  }

  onMounted(()=>{
    audioElem.value!.addEventListener("play", (e)=>{
      // somehow trigger a recompute
      
      paused.value = false;
    })
    audioElem.value!.addEventListener("pause", (e)=>{
      
      paused.value = true;
    })
    audioElem.value!.addEventListener("timeupdate", (e)=>{
      // trigger recompute of duration
      durationRecomputeKey.value = !durationRecomputeKey.value;
    })
  })
</script>