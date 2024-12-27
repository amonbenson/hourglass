<script setup>
import { computed, ref, watch, onMounted, onBeforeUnmount } from "vue";
import { storeToRefs } from "pinia";
import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "../tailwind.config.js";
import useSound from "vue-use-sound";
import {
  PlayIcon,
  PauseIcon,
  StopIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Cog6ToothIcon,
  XMarkIcon,
  PlusIcon,
  TrashIcon,
  ArrowDownIcon,
} from "@heroicons/vue/24/outline";
import UiTimeInput from "@/components/ui/UiTimeInput.vue";
import UiToggle from "@/components/ui/UiToggle.vue";
import UiTextInput from "@/components/ui/UiTextInput.vue";
import UiCircleButton from "@/components/ui/UiCircleButton.vue";
import { useSettingsStore } from "@/store/settings";

const DEVELOPMENT = process.env.NODE_ENV === "development";

const { colors } = resolveConfig(tailwindConfig).theme;

const settings = useSettingsStore();
const { timerDuration, continueAfterTimerEnds, playerNames } = storeToRefs(settings);
const multiplayer = computed(() => playerNames.value.length > 1);

const running = ref(false);
const counter = ref(timerDuration.value);
const isReset = computed(() => !running.value && counter.value === timerDuration.value);

// reset timer when duration changes
watch(timerDuration, () => stop());

const prevEnabled = ref(false);
const prevCounter = ref(0);

const settingsOpen = ref(false);
watch(settingsOpen, () => stop()); // stop the timer when settings are opened

const currentPlayerIndex = ref(0);
const currentPlayer = computed(() => playerNames.value[currentPlayerIndex.value]);

const counterString = computed(() => {
  const minutes = Math.floor(counter.value / 60);
  const seconds = counter.value % 60;

  if (minutes > 0) {
    // use m:ss format
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  } else {
    // use just seconds (without leading 0)
    return String(seconds);
  }
});

const currentPlayerColor = computed(() => {
  return [
    colors.primary,
    colors.secondary,
    colors.accent,
  ][currentPlayerIndex.value % 3];
});

const [playAlarm] = useSound(import("@/assets/sounds/alarm01.mp3"), { volume: 0.5 });

let interval = null;

function tick() {
  if (counter.value > 0) {
    // decrement the counter
    counter.value--;
  } else {
    // play the alarm sound
    playAlarm();

    // start the next round
    next();
  }
}

function start(immediate = true) {
  if (!running.value) {
    running.value = true;

    // register tick interval
    interval = setInterval(tick, 1000);

    // run the first tick immediately
    if (immediate) {
      tick();
    }
  }
}

function pause() {
  if (running.value) {
    running.value = false;

    // deregister tick interval
    clearInterval(interval);
  }
}

function stop() {
  pause();
  counter.value = timerDuration.value;
}

function next() {
  // store the previous counter value to be able to revert
  prevCounter.value = counter.value;
  prevEnabled.value = true;

  const wasRunning = running.value;
  stop();

  // switch to the next player
  currentPlayerIndex.value = (currentPlayerIndex.value + 1) % playerNames.value.length;

  // start the timer again if it was running before
  if (continueAfterTimerEnds.value && wasRunning) {
    start(false);
  }
}

function prev() {
  if (!prevEnabled.value) {
    return;
  }

  const timeElapsed = timerDuration.value - counter.value;
  const wasRunning = running.value;
  stop();

  // switch to the previous player
  currentPlayerIndex.value = (currentPlayerIndex.value + playerNames.value.length - 1) % playerNames.value.length;

  if (wasRunning) {
    // restore the previous counter value but subtract the time that has passed since then
    counter.value = Math.max(0, prevCounter.value - timeElapsed);
    start(false);
  }

  prevCounter.value = 0;
  prevEnabled.value = false;
}

function addPlayer() {
  settings.addPlayer();
}

function removePlayer(index) {
  if (playerNames.value.length <= 1) {
    return;
  }

  stop();

  settings.removePlayer(index);

  // make sure that the current player index is still valid
  if (currentPlayerIndex.value >= playerNames.value.length) {
    currentPlayerIndex.value = playerNames.value.length - 1;
  }
}

function onKeydown(event) {
  // blur the focused element when the escape key is pressed
  if (event.key === "Escape") {
    document.activeElement.blur();
    return;
  }

  // ignore key events when an element is focused
  if (document.activeElement !== document.body) {
    return;
  }

  // handle keyboard shortcuts
  if (event.key === " ") {
    event.preventDefault();
    running.value ? pause() : start();
  } else if (event.key === "Enter") {
    event.preventDefault();
    next();
  } else if (event.key === "ArrowLeft") {
    event.preventDefault();
    prev();
  } else if (event.key === "ArrowRight") {
    event.preventDefault();
    next();
  }
}

onMounted(() => {
  // register keyboard shortcuts
  window.addEventListener("keydown", onKeydown);

  // start timer on page load
  if (continueAfterTimerEnds.value) {
    start(false);
  }
});

onBeforeUnmount(() => {
  // deregister keyboard shortcuts
  window.removeEventListener("keydown", onKeydown);
  stop();
});
</script>

<template>
  <div class="dark fixed left-0 top-0 w-screen h-screen">
    <!-- Sand layer -->
    <div
      class="absolute left-0 bottom-0 w-full h-full opacity-75 transition-all duration-500"
      :style="{
        height: `${counter / timerDuration * 100}%`,
        background: currentPlayerColor,
      }"
    />

    <!-- Next / prev touch areas -->
    <div class="absolute left-0 top-0 w-full h-full flex">
      <div
        v-if="multiplayer && prevEnabled"
        class="group/area shrink-0 flex justify-start items-center w-1/4 h-full min-w-24 p-4 cursor-pointer"
        @click="prev()"
      >
        <UiCircleButton
          class="group/button"
          @click.stop="prev()"
        >
          <ChevronLeftIcon class="size-8 opacity-0 group-hover/area:opacity-100 group-focus-visible/button:opacity-100 transition-opacity" />
        </UiCircleButton>
      </div>

      <div
        class="grow h-full cursor-pointer"
        @click="running ? next() : start()"
      />

      <div
        class="group/area shrink-0 flex justify-end items-center w-1/4 h-full min-w-24 p-4 cursor-pointer"
        @click="running ? next() : start()"
      >
        <!-- Settings menu button (always on top) -->
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

        <!-- Next button -->
        <UiCircleButton
          v-if="multiplayer"
          class="group/button"
          @click.stop="next()"
        >
          <ChevronRightIcon class="size-8 opacity-0 group-hover/area:opacity-100 group-focus-visible/button:opacity-100 transition-opacity" />
        </UiCircleButton>

        <!-- Skip countdown button (for debugging purposes) -->
        <UiCircleButton
          v-if="DEVELOPMENT"
          class="fixed right-4 bottom-4 z-50"
          @click.stop="counter = 2"
        >
          <ArrowDownIcon class="size-8" />
        </UiCircleButton>
      </div>
    </div>

    <!-- Text layer -->
    <div class="absolute left-0 top-0 w-full h-full flex flex-col justify-center items-center space-y-8 pointer-events-none">
      <!-- Player name -->
      <div
        v-if="multiplayer"
        class="text-4xl text-bold font-thin"
      >
        {{ currentPlayer }}
      </div>

      <!-- Timer value -->
      <div
        class="text-8xl text-bold font-thin"
      >
        <div>{{ counterString }}</div>
      </div>

      <!-- Control buttons -->
      <div class="flex items-center space-x-8">
        <UiCircleButton
          class="pointer-events-auto"
          @click.stop="running ? pause() : start()"
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
          :disabled="isReset"
          @click.stop="stop()"
        >
          <StopIcon class="size-8" />
        </UiCircleButton>
      </div>
    </div>

    <!-- Settings Dialog -->
    <div
      v-if="settingsOpen"
      class="fixed left-0 top-0 w-screen h-screen bg-dark/75 cursor-pointer overflow-y-scroll"
      @click.stop="settingsOpen = false"
    >
      <div class="container mx-auto sm:p-8">
        <div
          class="flex flex-col space-y-4 justify-center items-stretch p-8 bg-dark min-h-screen sm:min-h-0 sm:rounded-lg sm:shadow-xl sm:shadow-dark/25 cursor-default"
          @click.stop="() => {}"
        >
          <h2>Timer</h2>
          <UiTimeInput
            v-model="timerDuration"
            :min="1"
            :max="3600"
          />
          <UiToggle
            v-model="continueAfterTimerEnds"
            label="Continue automatically after the timer reaches 0"
          />

          <h2>Players</h2>
          <div class="flex flex-col space-y-4 items-center">
            <div 
              v-for="(_, index) in playerNames"
              :key="index"
              class="w-full flex space-x-2 justify-center items-center"
            >
              <UiTextInput
                v-model="playerNames[index]"
                class="grow"
              />
              <UiCircleButton
                v-if="multiplayer"
                color="accent"
                small
                @click="removePlayer(index)"
              >
                <TrashIcon
                  class="size-6 text-accent"
                />
              </UiCircleButton>
            </div>

            <UiCircleButton
              small
              @click="addPlayer()"
            >
              <PlusIcon class="size-8" />
            </UiCircleButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
