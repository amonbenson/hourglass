<script setup>
import { defineModel, computed, ref, watch } from "vue";
import UiTextInput from "./UiTextInput.vue";

const model = defineModel({ type: Number, required: true });

const props = defineProps({
  label: { type: String, default: "" },
  min: { type: Number, default: 0 },
  max: { type: Number, default: 3600 },
});

const minuteTensInput = ref(null);
const minuteTens = ref("");

const minuteOnesInput = ref(null);
const minuteOnes = ref("");

const secondTensInput = ref(null);
const secondTens = ref("");

const secondOnesInput = ref(null);
const secondOnes = ref("");

function updateDigits() {
  const minutes = Math.floor(model.value / 60);
  const seconds = model.value % 60;

  minuteTens.value = String(Math.floor(minutes / 10));
  minuteOnes.value = String(minutes % 10);
  secondTens.value = String(Math.floor(seconds / 10));
  secondOnes.value = String(seconds % 10);
}

function parseDigit(value, max = 9) {
  const sanitizedDigit = String(value).replace(/\D/g, "")[0];
  const number = parseInt(sanitizedDigit, 10);
  if (isNaN(number)) {
    return options.min;
  } else {
    return Math.max(0, Math.min(max, number));
  }
}

function updateModel() {
  // parse each digit
  const mt = parseDigit(minuteTens.value, 5);
  const mo = parseDigit(minuteOnes.value);
  const st = parseDigit(secondTens.value, 5);
  const so = parseDigit(secondOnes.value);

  // write back the sanitized values
  minuteTens.value = String(Math.min(mt, 5));
  minuteOnes.value = String(Math.min(mo, 9));
  secondTens.value = String(Math.min(st, 5));
  secondOnes.value = String(Math.min(so, 9));

  // calculate the new model value
  const minutes = mt * 10 + mo;
  const seconds = st * 10 + so;
  model.value = minutes * 60 + seconds;
}

// update digits whenever the model changes
watch(model, () => updateDigits(), { immediate: true });

// focus the next input when the current one is filled
watch(minuteTens, () => minuteOnesInput.value.focus());
watch(minuteOnes, () => secondTensInput.value.focus());
watch(secondTens, () => secondOnesInput.value.focus());
</script>

<template>
  <div class="flex flex-col items-stretch space-y-2">
    <label v-if="label">{{ label }}</label>
    <div class="flex space-x-2 justify-start items-center">
      <UiTextInput
        ref="minuteTensInput"
        v-model="minuteTens"
        single-digit
        select-on-focus
        @update:model-value="updateModel()"
      />
      <UiTextInput
        ref="minuteOnesInput"
        v-model="minuteOnes"
        single-digit
        select-on-focus
        @update:model-value="updateModel()"
      />
      <span class="text-xl">:</span>
      <UiTextInput
        ref="secondTensInput"
        v-model="secondTens"
        single-digit
        select-on-focus
        @update:model-value="updateModel()"
      />
      <UiTextInput
        ref="secondOnesInput"
        v-model="secondOnes"
        single-digit
        select-on-focus
        @update:model-value="updateModel()"
      />
    </div>
  </div>
</template>
