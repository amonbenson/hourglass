<script setup>
import { computed, ref, watch, onMounted } from "vue";
import { storeToRefs } from "pinia";
import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "../tailwind.config.js";
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
import { FwbCheckbox, FwbInput } from "flowbite-vue";
import { useSettingsStore } from "@/store/settings";
import RoundIconButton from "@/components/RoundIconButton.vue";

const { colors } = resolveConfig(tailwindConfig).theme;

const store = useSettingsStore();
const { counterStart, continuous, players } = storeToRefs(store);

const running = ref(false);
const counter = ref(counterStart.value);
const isReset = computed(() => !running.value && counter.value === counterStart.value);

const prevEnabled = ref(false);
const prevCounter = ref(0);

const settingsOpen = ref(false);
watch(settingsOpen, () => stop()); // stop the timer when settings are opened

const currentPlayerIndex = ref(0);
const currentPlayer = computed(() => players.value[currentPlayerIndex.value]);

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

// assuming that 4 is the widest character
const spacerString = computed(() => {
  return counterString.value[0] + counterString.value.slice(1).replace(/\d/g, "4");
});

const currentPlayerColor = computed(() => {
  return [
    colors.primary,
    colors.secondary,
    colors.accent,
  ][currentPlayerIndex.value % 3];
});

let interval = null;

function tick() {
  if (counter.value > 0) {
    // decrement the counter
    counter.value--;
  } else {
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
  counter.value = counterStart.value;
}

function next() {
  // store the previous counter value to be able to revert
  prevCounter.value = counter.value;
  prevEnabled.value = true;

  const wasRunning = running.value;
  stop();

  // switch to the next player
  currentPlayerIndex.value = (currentPlayerIndex.value + 1) % players.value.length;

  // start the timer again if it was running before
  if (continuous.value && wasRunning) {
    start(false);
  }
}

function prev() {
  if (!prevEnabled.value) {
    return;
  }

  const timeElapsed = counterStart.value - counter.value;
  const wasRunning = running.value;
  stop();

  // switch to the previous player
  currentPlayerIndex.value = (currentPlayerIndex.value + players.value.length - 1) % players.value.length;

  if (wasRunning) {
    // restore the previous counter value but subtract the time that has passed since then
    counter.value = Math.max(0, prevCounter.value - timeElapsed);
    start(false);
  }

  prevCounter.value = 0;
  prevEnabled.value = false;
}

function addPlayer() {
  players.value.push(`Player ${players.value.length + 1}`);
}

function removePlayer(index) {
  if (players.value.length <= 1) {
    return;
  }

  stop();

  players.value.splice(index, 1);

  // make sure that the current player index is still valid
  if (currentPlayerIndex.value >= players.value.length) {
    currentPlayerIndex.value = players.value.length - 1;
  }
}

onMounted(() => {
  start(false);
});
</script>

<template>
  <div class="fixed left-0 top-0 w-screen h-screen">
    <!-- Sand layer -->
    <div
      class="absolute left-0 bottom-0 w-full h-full opacity-75 transition-all duration-500"
      :style="{
        height: `${counter / counterStart * 100}%`,
        background: currentPlayerColor,
      }"
    />

    <!-- Next / prev touch areas -->
    <div class="absolute left-0 top-0 w-full h-full flex">
      <div
        v-if="players.length > 1 && prevEnabled"
        class="shrink-0 flex justify-start items-center w-1/4 h-full min-w-24 p-4 cursor-pointer group"
        @click="prev()"
      >
        <RoundIconButton
          class="opacity-0 group-hover:opacity-100 transition-opacity"
          @click.stop="prev()"
        >
          <ChevronLeftIcon class="size-8" />
        </RoundIconButton>
      </div>

      <div
        class="grow h-full cursor-pointer"
        @click="running ? next() : start()"
      />

      <div
        v-if="players.length > 1"
        class="shrink-0 flex justify-end items-center w-1/4 h-full min-w-24 p-4 cursor-pointer group"
        @click="running ? next() : start()"
      >
        <RoundIconButton
          class="opacity-0 group-hover:opacity-100 transition-opacity"
          @click.stop="next()"
        >
          <ChevronRightIcon class="size-8" />
        </RoundIconButton>
      </div>
    </div>

    <!-- Text layer -->
    <div class="absolute left-0 top-0 w-full h-full flex flex-col justify-center items-center space-y-8 pointer-events-none">
      <!-- Player name -->
      <div
        v-if="players.length > 1"
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
        <RoundIconButton
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
        </RoundIconButton>
        <RoundIconButton
          class="pointer-events-auto"
          :disabled="isReset"
          @click.stop="stop()"
        >
          <StopIcon class="size-8" />
        </RoundIconButton>
      </div>
    </div>

    <!-- Settings Button -->
    <RoundIconButton
      class="fixed right-4 top-4 z-50"
      @click.stop="settingsOpen = !settingsOpen"
    >
      <Cog6ToothIcon
        v-if="!settingsOpen"
        class="size-8"
      />
      <XMarkIcon
        v-else
        class="size-8"
      />
    </RoundIconButton>

    <!-- Settings Dialog -->
    <div
      v-if="settingsOpen"
      class="fixed left-0 top-0 w-screen h-screen flex justify-center items-center bg-dark/75 cursor-pointer"
      @click.stop="settingsOpen = false"
    >
      <div class="container mx-auto p-4 md:p-24">
        <div
          class="p-8 space-y-4 bg-dark rounded-lg shadow-xl shadow-dark/25 cursor-default"
          @click.stop="() => {}"
        >
          <h2>Timer</h2>
          <FwbInput
            v-model="counterStart"
            label="Duration (in seconds)"
            type="number"
            min="1"
            max="3600"
          />
          <FwbCheckbox
            v-model="continuous"
            color="light"
            label="Continue running after the timer reaches 0"
          />

          <h2>Players</h2>
          <div class="flex flex-col space-y-4 items-center">
            <div 
              v-for="(_, index) in players"
              :key="index"
              class="w-full flex space-x-2 justify-center items-center"
            >
              <FwbInput
                v-model="players[index]"
                class="grow"
              />
              <RoundIconButton
                v-if="players.length > 1"
                class="bg-accent/0 hover:bg-accent/25 focus:ring-accent"
                small
                @click="removePlayer(index)"
              >
                <TrashIcon
                  class="size-6 text-accent"
                />
              </RoundIconButton>
            </div>

            <RoundIconButton
              small
              @click="addPlayer()"
            >
              <PlusIcon class="size-8" />
            </RoundIconButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Skip countdown button (for debugging) -->
    <RoundIconButton
      class="fixed right-4 bottom-4 z-50"
      @click.stop="counter = 2"
    >
      <ArrowDownIcon class="size-8" />
    </RoundIconButton>
  </div>
</template>
