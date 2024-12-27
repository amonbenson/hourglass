<script setup>
import { ref } from "vue";

const model = defineModel({ type: String, required: true });

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
      class="rounded bg-darker text-light focusring"
      :class="singleDigit ? 'text-center text-xl w-8 p-2' : 'px-4 py-2'"
      @focus="onFocus"
    >
  </div>
</template>
