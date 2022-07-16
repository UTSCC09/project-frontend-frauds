<script setup>
defineProps({
  title: {
    type: String,
    default: "Page Title",
  },
});
</script>

<template>
  <h2 class="page-title">
    {{ title }}
  </h2>
</template>

<style scoped>
.page-title {
  padding-left: 0;
  padding-top: 1rem;
  padding-bottom: 1rem;
  font-weight: bold;
}
</style>
