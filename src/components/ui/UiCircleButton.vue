<script setup>
import UiButton from "./UiButton.vue";

const props = defineProps({
  color: { type: String, default: "light" },
  small: Boolean,
});

defineEmits(["click"]);
</script>

<template>
  <UiButton
    :class="small ? 'size-10' : 'size-16'"
    :color="color"
    plain
    pill
    @click="$emit('click', $event)"
  >
    <slot />
  </UiButton>
</template>
