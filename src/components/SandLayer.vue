<script setup>
defineProps({
  amount: { type: Number, required: true },
  color: { type: String, required: true },
});
</script>

<template>
  <div
    class="absolute left-0 bottom-0 w-full h-full bg-[rgb(var(--color))] opacity-75 transition-all duration-500"
    :style="{
      height: `${amount * 100}%`,
      '--color': `var(--color-${color})`,
    }"
  />
</template>
