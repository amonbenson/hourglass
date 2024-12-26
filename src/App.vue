<script setup>
import { computed, ref, watch, onMounted, onUnmounted } from "vue";
import { PlayIcon, PauseIcon, StopIcon } from "@heroicons/vue/24/outline";
import RoundIconButton from "@/components/RoundIconButton.vue";

const running = ref(false);
const counterStart = ref(10);
const counter = ref(counterStart.value);
const isReset = computed(() => !running.value && counter.value === counterStart.value);

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

let interval = null;

function tick() {
  if (counter.value > 0) {
    // decrement the counter
    counter.value--;
  } else {
    // start the next round
    nextRound();
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

function nextRound() {
  stop();
  // TODO: next round logic
  start(false);
}

onMounted(() => {
  start(false);
});
</script>

<template>
  <div class="fixed left-0 top-0 w-screen h-screen">
    <!-- Sand layer -->
    <div
      class="absolute left-0 bottom-0 w-full bg-primary opacity-75 transition-height duration-200"
      :style="{
        /* height: !isReset ? `${counter / counterStart * 100}%`: '0%' */
        height: `${counter / counterStart * 100}%`
      }"
    />

    <div
      class="absolute left-0 top-0 w-full h-full flex flex-col justify-center items-center space-y-8 cursor-pointer"
      @click="nextRound()"
    >
      <!-- Timer value -->
      <div class="text-8xl text-bold font-thin">
        <div class="invisible overflow-hidden h-0">
          {{ spacerString }}
        </div>
        <div>{{ counterString }}</div>
      </div>

      <!-- Control buttons -->
      <div class="flex items-center space-x-8">
        <RoundIconButton
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
          :disabled="isReset"
          @click.stop="stop()"
        >
          <StopIcon class="size-8" />
        </RoundIconButton>
      </div>
    </div>
  </div>
</template>
