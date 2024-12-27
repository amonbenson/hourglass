<script setup>
const model = defineModel({ type: Boolean, required: true });

defineProps({
  label: { type: String, default: "" },
});
</script>

<template>
  <label class="inline-flex items-center cursor-pointer">
    <input
      v-model="model"
      type="checkbox"
      class="sr-only peer"
    >
    <div class="flex flex-shrink-0 w-12 h-6 rounded-full shadow-inner shadow-dark/50 bg-darker peer-checked:bg-primary/50 after:bg-light peer-focusring transition-colors after:w-6 after:h-6 after:rounded-full peer-checked:after:translate-x-6 after:transition-all" />
    <span class="ml-2">{{ label }}</span>
  </label>
</template>
