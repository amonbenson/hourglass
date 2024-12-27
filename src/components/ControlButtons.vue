<script setup>
import UiCircleButton from "@/components/ui/UiCircleButton.vue";
import { PlayIcon, PauseIcon, StopIcon } from "@heroicons/vue/24/outline";

defineProps({
  running: Boolean,
  stopEnabled: Boolean,
});

const emit = defineEmits(["start", "pause", "stop"]);
</script>

<template>
  <div class="flex items-center space-x-8">
    <UiCircleButton
      class="pointer-events-auto"
      @click.stop="running ? emit('pause') : emit('start')"
    >
      <PlayIcon
        v-if="!running"
        class="size-8 ml-1"
      />
      <PauseIcon
        v-else
        class="size-8"
      />
    </UiCircleButton>
    <UiCircleButton
      class="pointer-events-auto"
      :disabled="!stopEnabled"
      @click.stop="emit('stop')"
    >
      <StopIcon class="size-8" />
    </UiCircleButton>
  </div>
</template>
