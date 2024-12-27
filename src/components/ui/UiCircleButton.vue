<script setup>
import UiButton from "./UiButton.vue";

defineProps({
  color: { type: String, default: "light" },
  disabled: Boolean,
  small: Boolean,
});

defineEmits(["click"]);
</script>

<template>
  <UiButton
    :class="small ? 'size-10' : 'size-16'"
    :color="color"
    :disabled="disabled"
    plain
    pill
    @click="$emit('click', $event)"
  >
    <slot />
  </UiButton>
</template>
