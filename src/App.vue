<script setup>
import { computed, ref, watch, onMounted, onUnmounted } from "vue";

const running = ref(false);
const counterStart = ref(3);
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
watch(running, (value) => {
  if (value) {
    // setup tick interval and run immediately
    interval = setInterval(tick, 1000);
    tick();
  } else {
    clearInterval(interval);
  }
}, { immediate: true });

function tick() {
  if (counter.value > 0) {
    // decrement the counter
    counter.value--;
  } else {
    // start the next round
    counter.value = counterStart.value;
  }
}

function start() {
  running.value = true;
}

function pause() {
  running.value = false;
}

function stop() {
  running.value = false;
  counter.value = counterStart.value;
}

onMounted(() => {
  start();
});
</script>

<template>
  <div class="fixed left-0 top-0 w-screen h-screen">
    <!-- Sand layer -->
    <div
      class="absolute left-0 bottom-0 w-full bg-primary opacity-50 transition-height duration-200"
      :style="{
        height: !isReset ? `${counter / counterStart * 100}%`: '0%'
      }"
    />

    <div class="absolute left-0 top-0 w-full h-full flex flex-col justify-center items-center space-y-8">
      <!-- Timer value -->
      <div class="text-8xl text-bold font-thin">
        <div class="invisible overflow-hidden h-0">
          {{ spacerString }}
        </div>
        <div>{{ counterString }}</div>
      </div>

      <!-- Control buttons -->
      <div class="flex items-center space-x-8">
        <button
          class="round-button"
          @click="running ? pause() : start()"
        >
          P
        </button>
        <button
          class="round-button"
          :disabled="isReset"
          @click="stop()"
        >
          S
        </button>
      </div>
    </div>
  </div>
</template>
