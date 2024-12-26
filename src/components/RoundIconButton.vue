<script setup>
import { FwbButton } from "flowbite-vue";
</script>

<template>
  <button class="size-16 flex justify-center items-center rounded-full hover:bg-light/25 text-light disabled:text-light/25 disabled:hover:bg-transparent transition-colors">
    <slot />
  </button>
</template>
