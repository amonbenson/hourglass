<script setup>
import { computed } from "vue";

const props = defineProps({
  color: { type: String, default: "primary" },
  disabled: Boolean,
  plain: Boolean,
  pill: Boolean,
});

defineEmits(["click"]);

const fgColor = computed(() => props.color === "light" ? "darker" : "light");
</script>

<template>
  <button
    class="inline-flex justify-center items-center font-bold focusring focus:ring-[rgb(var(--color))] transition-colors"
    :class="[
      disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
      plain
        ? 'bg-transparent text-(color:--color) hover:enabled:bg-(color:--color)/20'
        : 'bg-(color:--color)/75 text-(color:--fg-color) hover:enabled:bg-(color:--color)/50 shadow-md',
      pill ? 'rounded-full' : 'rounded-xl px-4 py-2',
    ]"
    :style="`--color: var(--color-${color}); --fg-color: var(--color-${fgColor})`"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>
