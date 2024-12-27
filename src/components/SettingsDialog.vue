<script setup>
import { storeToRefs } from "pinia";
import { useSettingsStore } from "@/store/settings";
import UiTimeInput from "@/components/ui/UiTimeInput.vue";
import UiToggle from "@/components/ui/UiToggle.vue";
import UiTextInput from "@/components/ui/UiTextInput.vue";
import UiButton from "@/components/ui/UiButton.vue";
import UiCircleButton from "@/components/ui/UiCircleButton.vue";
import { PlusIcon, TrashIcon } from "@heroicons/vue/24/outline";

const open = defineModel("open", { type: Boolean });
const emit = defineEmits(["playerAdded", "playerRemoved"]);

const settings = useSettingsStore();
const { timerDuration, continueAfterTimeout, playerNames } = storeToRefs(settings);

function addPlayer() {
  settings.addPlayer();

  emit("playerAdded");
}

function removePlayer(index) {
  if (playerNames.length <= 1) {
    return;
  }

  settings.removePlayer(index);

  emit("playerRemoved", index);
}
</script>

<template>
  <div
    v-if="open"
    class="fixed left-0 top-0 w-screen h-screen bg-dark/75 cursor-pointer overflow-y-scroll"
    @click.stop="open = false"
  >
    <div class="container mx-auto sm:p-8 max-w-[48rem]">
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
          v-model="continueAfterTimeout"
          label="Continue after the timer reaches 0"
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
              v-if="playerNames.length > 1"
              color="accent"
              small
              @click="removePlayer(index)"
            >
              <TrashIcon class="size-6 text-accent" />
            </UiCircleButton>
          </div>

          <UiCircleButton
            small
            @click="addPlayer()"
          >
            <PlusIcon class="size-8" />
          </UiCircleButton>
        </div>

        <div>
          <UiButton
            class="mt-12 w-full"
            @click="() => { open = false }"
          >
            Close
          </UiButton>
        </div>
      </div>
    </div>
  </div>
</template>
