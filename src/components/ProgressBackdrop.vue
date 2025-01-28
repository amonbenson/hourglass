<script setup>
defineProps({
  progress: { type: Number, required: true },
  color: { type: String, required: true },
});
</script>

<template>
  <div class="relative">
    <div
      class="absolute left-0 bottom-0 w-full h-full bg-(color:--color) opacity-75 transition-all duration-500"
      :style="{
        height: `${progress * 100}%`,
        '--color': `var(--color-${color})`,
      }"
    />
  </div>
</template>
