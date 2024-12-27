<script setup>
import { computed } from "vue";

const props = defineProps({
  counter: { type: Number, required: true },
});

const counterString = computed(() => {
  const minutes = Math.floor(props.counter / 60);
  const seconds = props.counter % 60;

  if (minutes > 0) {
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  } else {
    return String(seconds);
  }
});
</script>

<template>
  <div class="text-8xl text-bold font-thin">
    <div>{{ counterString }}</div>
  </div>
</template>
