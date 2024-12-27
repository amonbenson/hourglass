<script setup>
defineProps({
  playerName: { type: String, required: true },
});
</script>

<template>
  <div
    class="text-4xl text-bold font-thin"
  >
    {{ playerName }}
  </div>
</template>
