<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";
import { storeToRefs } from "pinia";
import { useSettingsStore } from "@/store/settings";
import Timer from "@/timer";
import useSound from "vue-use-sound";
import SandLayer from "@/components/SandLayer.vue";
import TouchAreas from "@/components/TouchAreas.vue";
import PlayerNameDisplay from "@/components/PlayerNameDisplay.vue";
import TimerDisplay from "@/components/TimerDisplay.vue";
import ControlButtons from "@/components/ControlButtons.vue";
import SettingsDialog from "@/components/SettingsDialog.vue";
import alarmSound from "@/assets/sounds/alarm01.mp3";

const settings = useSettingsStore();
const { timerDuration, playerNames } = storeToRefs(settings);
const multiplayer = computed(() => playerNames.value.length > 1);

const timer = new Timer(settings);

const currentPlayer = computed(() => playerNames.value[timer.currentPlayerIndex]);

const prevEnabled = ref(false);
const prevCounter = ref(0);

const settingsOpen = ref(false);
watch(settingsOpen, () => timer.stop());

// play alarm sound on timeout
const [playAlarm] = useSound(alarmSound);
timer.on("timeout", () => {
  playAlarm();
});

/*
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
*/

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
    timer.running ? timer.pause() : timer.start();
  } else if (event.key === "Enter") {
    event.preventDefault();
    timer.next();
  } else if (event.key === "ArrowLeft") {
    event.preventDefault();
    timer.prev();
  } else if (event.key === "ArrowRight") {
    event.preventDefault();
    timer.next();
  }
}

onMounted(() => {
  // register keyboard shortcuts
  window.addEventListener("keydown", onKeydown);
});

onBeforeUnmount(() => {
  // deregister keyboard shortcuts
  window.removeEventListener("keydown", onKeydown);
  timer.stop();
});
</script>

<template>
  <div class="dark fixed left-0 top-0 w-screen h-screen">
    <SandLayer
      :amount="timer.counter / timerDuration"
      :color="['primary', 'secondary', 'accent'][timer.currentPlayerIndex % 3]"
    />

    <TouchAreas
      v-model:settings-open="settingsOpen"
      :left-enabled="multiplayer && prevEnabled"
      :right-enabled="multiplayer"
      @left="timer.prev()"
      @center="timer.running ? timer.next() : timer.start()"
      @right="timer.running ? timer.next() : timer.start()"
      @skip-countdown="timer.counter = 2"
    />

    <div class="absolute left-0 top-0 w-full h-full flex flex-col justify-center items-center space-y-8 pointer-events-none">
      <PlayerNameDisplay
        v-if="multiplayer"
        :player-name="currentPlayer"
      />
      <TimerDisplay
        :counter="timer.counter"
      />
      <ControlButtons
        :running="timer.running"
        :stop-enabled="timer.running || timer.counter !== timerDuration"
        @start="timer.start()"
        @pause="timer.pause()"
        @stop="timer.stop()"
      />
    </div>

    <SettingsDialog v-model:open="settingsOpen" />
  </div>
</template>
