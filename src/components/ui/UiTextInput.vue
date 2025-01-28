<script setup>
import { ref } from "vue";

const model = defineModel({ type: [String, Number], required: true });

const props = defineProps({
  label: { type: String, default: "" },
  singleDigit: Boolean,
  selectOnFocus: Boolean,
});

const input = ref(null);

function focus() {
  input.value.focus();
}

function select() {
  input.value.select();
}

function onFocus() {
  if (props.selectOnFocus) {
    select();
  }
}

defineExpose({ focus, select });
</script>

<template>
  <div class="flex flex-col items-stretch space-y-2">
    <label v-if="label">{{ label }}</label>
    <input
      ref="input"
      v-model="model"
      class="rounded-sm bg-darker text-light focusring no-spinner"
      :class="singleDigit ? 'text-center text-xl w-8 p-2' : 'px-4 py-2'"
      :type="singleDigit ? 'number' : 'text'"
      @focus="onFocus"
    >
  </div>
</template>
