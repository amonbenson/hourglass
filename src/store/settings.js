import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";

export const useSettingsStore = defineStore("settings", {
  state: () => useStorage(
    "settings",
    {
      counterStart: 60,
      continuous: true,
      players: ["Player 1"],
    },
    localStorage,
    {
      mergeDefaults: true,
    },
  ),
  actions: {
    updateSettings(settings) {
      Object.assign(this, settings);
      localStorage.setItem("settings", JSON.stringify(this.settings));
    },
  },
});
