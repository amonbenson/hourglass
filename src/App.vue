<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";
import { storeToRefs } from "pinia";
import { useSettingsStore } from "@/store/settings";
import useSound from "vue-use-sound";
import SandLayer from "@/components/SandLayer.vue";
import TouchAreas from "@/components/TouchAreas.vue";
import PlayerNameDisplay from "@/components/PlayerNameDisplay.vue";
import TimerDisplay from "@/components/TimerDisplay.vue";
import ControlButtons from "@/components/ControlButtons.vue";
import SettingsDialog from "@/components/SettingsDialog.vue";
import alarmSound from "@/assets/sounds/alarm01.mp3";

const settings = useSettingsStore();
const { timerDuration, continueAfterTimerEnds, playerNames } = storeToRefs(settings);
const multiplayer = computed(() => playerNames.value.length > 1);

const running = ref(false);
const counter = ref(timerDuration.value);

// reset timer when duration changes
watch(timerDuration, () => stop());

const prevEnabled = ref(false);
const prevCounter = ref(0);

const settingsOpen = ref(false);
watch(settingsOpen, () => stop());

const currentPlayerIndex = ref(0);
const currentPlayer = computed(() => playerNames.value[currentPlayerIndex.value]);

const [playAlarm] = useSound(alarmSound);

let interval = null;

function tick() {
  if (counter.value > 0) {
    // decrement the counter
    counter.value--;

    // play alarm sound when the timer reaches 0
    if (counter.value === 0) {
      playAlarm();
    }
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

function playerRemoved() {
  stop();

  // make sure the current player index is still valid
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
});

onBeforeUnmount(() => {
  // deregister keyboard shortcuts
  window.removeEventListener("keydown", onKeydown);
  stop();
});
</script>

<template>
  <div class="dark fixed left-0 top-0 w-screen h-screen">
    <SandLayer
      :amount="counter / timerDuration"
      :color="['primary', 'secondary', 'accent'][currentPlayerIndex % 3]"
    />

    <TouchAreas
      v-model:settings-open="settingsOpen"
      :left-enabled="multiplayer && prevEnabled"
      :right-enabled="multiplayer"
      @left="prev()"
      @center="running ? next() : start()"
      @right="running ? next() : start()"
      @skip-countdown="counter = 2"
    />

    <div class="absolute left-0 top-0 w-full h-full flex flex-col justify-center items-center space-y-8 pointer-events-none">
      <PlayerNameDisplay
        v-if="multiplayer"
        :player-name="currentPlayer"
      />
      <TimerDisplay
        :counter="counter"
      />
      <ControlButtons
        :running="running"
        :stop-enabled="running || counter !== timerDuration"
        @start="start()"
        @pause="pause()"
        @stop="stop()"
      />
    </div>

    <SettingsDialog
      v-model:open="settingsOpen"
      @player-removed="playerRemoved()"
    />
  </div>
</template>
