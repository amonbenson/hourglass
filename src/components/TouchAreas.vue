<script setup>
import UiCircleButton from "@/components/ui/UiCircleButton.vue";
import { ChevronLeftIcon, ChevronRightIcon, Cog6ToothIcon, XMarkIcon, ArrowDownIcon } from "@heroicons/vue/24/outline";

const DEVELOPMENT = process.env.NODE_ENV === "development";

defineProps({
  leftEnabled: { type: Boolean, default: true },
  rightEnabled: { type: Boolean, default: true },
});

const settingsOpen = defineModel("settingsOpen", { type: Boolean });

const emit = defineEmits(["left", "center", "right", "settings", "skipCountdown"]);
</script>

<template>
  <div class="absolute left-0 top-0 w-full h-full flex">
    <div
      v-if="leftEnabled"
      class="group/area shrink-0 flex justify-start items-center w-1/4 h-full min-w-24 p-4 cursor-pointer"
      @click="emit('left')"
    >
      <UiCircleButton
        class="group/button"
        @click.stop="emit('left')"
      >
        <ChevronLeftIcon class="size-8 mr-1 opacity-0 group-hover/area:opacity-100 group-focus-visible/button:opacity-100 transition-opacity" />
      </UiCircleButton>
    </div>

    <div
      class="grow h-full cursor-pointer"
      @click="emit('center')"
    />

    <div
      class="group/area shrink-0 flex justify-end items-center w-1/4 h-full min-w-24 p-4 cursor-pointer"
      @click="emit('right')"
    >
      <UiCircleButton
        class="fixed right-4 top-4 z-50"
        @click.stop="settingsOpen = !settingsOpen"
      >
        <Cog6ToothIcon
          class="absolute size-8 transition-all duration-500"
          :class="settingsOpen ? 'opacity-0 rotate-45' : 'opacity-100'"
        />
        <XMarkIcon
          class="absolute size-8 transition-all duration-500"
          :class="settingsOpen ? 'opacity-100' : 'opacity-0 -rotate-45'"
        />
      </UiCircleButton>

      <UiCircleButton
        v-if="rightEnabled"
        class="group/button"
        @click.stop="emit('right')"
      >
        <ChevronRightIcon class="size-8 ml-1 opacity-0 group-hover/area:opacity-100 group-focus-visible/button:opacity-100 transition-opacity" />
      </UiCircleButton>

      <UiCircleButton
        v-if="DEVELOPMENT"
        class="fixed right-4 bottom-4 z-50"
        @click.stop="emit('skipCountdown')"
      >
        <ArrowDownIcon class="size-8" />
      </UiCircleButton>
    </div>
  </div>
</template>
