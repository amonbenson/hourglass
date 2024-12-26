<script setup>
import { FwbButton } from "flowbite-vue";

const props = defineProps({
  small: Boolean,
});
</script>

<template>
  <FwbButton
    class="flex justify-center items-center rounded-full bg-light/0 hover:bg-light/25 text-light disabled:text-light/25 disabled:hover:bg-light/0 transition-colors"
    :class="{
      'size-10': small,
      'size-16': !small,
    }"
    pill
    square
  >
    <slot />
  </FwbButton>
</template>
