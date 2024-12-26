import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";

export const useSettingsStore = defineStore("settings", {
  state: () => useStorage(
    "settings",
    {
      timerDuration: 60,
      continueAfterTimerEnds: true,
      playerNames: ["Player 1"],
    },
    localStorage,
    {
      mergeDefaults: true,
    },
  ),
  actions: {
    updateSettings(settings) {
      Object.assign(this, settings);
    },
    addPlayer() {
      this.playerNames.push(`Player ${this.playerNames.length + 1}`);
    },
    removePlayer(index) {
      this.playerNames.splice(index, 1);
    },
  },
});
