<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";
import { storeToRefs } from "pinia";
import { useSettingsStore } from "@/store/settings";
import Timer from "@/timer";
import useSound from "vue-use-sound";
import { Cog6ToothIcon, XMarkIcon, ArrowDownIcon } from "@heroicons/vue/24/outline";
import UiCircleButton from "@/components/ui/UiCircleButton.vue";
import ProgressBackdrop from "@/components/ProgressBackdrop.vue";
import PlayerNameDisplay from "@/components/PlayerNameDisplay.vue";
import TimerDisplay from "@/components/TimerDisplay.vue";
import ControlButtons from "@/components/ControlButtons.vue";
import SettingsDialog from "@/components/SettingsDialog.vue";
import alarmSound from "@/assets/sounds/alarm01.mp3";

const DEVELOPMENT = process.env.NODE_ENV === "development";

const settings = useSettingsStore();
const { timerDuration, playerNames } = storeToRefs(settings);
const multiplayer = computed(() => playerNames.value.length > 1);

const timer = new Timer(settings);

const currentPlayer = computed(() => playerNames.value[timer.currentPlayerIndex]);

const settingsOpen = ref(false);
watch(settingsOpen, () => timer.stop());

// play alarm sound on timeout
const [playAlarm] = useSound(alarmSound);
timer.on("timeout", () => {
  playAlarm();
});

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
  <div
    class="dark fixed left-0 top-0 w-screen h-screen cursor-pointer"
    @click="timer.running ? timer.next() : timer.start()"
  >
    <ProgressBackdrop
      class="w-full h-full pointer-events-none"
      :progress="timer.counter / timerDuration"
      :color="['primary', 'secondary', 'accent'][timer.currentPlayerIndex % 3]"
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
      v-if="DEVELOPMENT"
      class="fixed right-4 bottom-4 z-50"
      @click.stop="timer.counter = 2"
    >
      <ArrowDownIcon class="size-8" />
    </UiCircleButton>
  </div>
</template>
