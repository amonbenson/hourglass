<script setup>
const props = defineProps({
  color: { type: String, default: "light" },
  plain: Boolean,
});

defineEmits(["click"]);
</script>

<template>
  <button
    class="px-4 py-2 rounded-xl font-bold focusring"
    :class="{
      'bg-light text-darker hover:bg-light/50 focus:bg-light/50 focus:ring-light': !props.plain && props.color === 'light',
      'bg-transparent text-light hover:bg-light/20 focus:bg-light/20 focus:ring-light': props.plain && props.color === 'light',
      'bg-primary text-light hover:bg-primary/50 focus:bg-primary/50 focus:ring-primary': !props.plain && props.color === 'primary',
      'bg-transparent text-primary hover:bg-primary/20 focus:bg-primary/20 focus:ring-primary': props.plain && props.color === 'primary',
      'bg-secondary text-light hover:bg-secondary/50 focus:bg-secondary/50 focus:ring-secondary': !props.plain && props.color === 'secondary',
      'bg-transparent text-secondary hover:bg-secondary/20 focus:bg-secondary/20 focus:ring-secondary': props.plain && props.color === 'secondary',
      'bg-accent text-light hover:bg-accent/50 focus:bg-accent/50 focus:ring-accent': !props.plain && props.color === 'accent',
      'bg-transparent text-accent hover:bg-accent/20 focus:bg-accent/20 focus:ring-accent': props.plain && props.color === 'accent',
    }"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>
