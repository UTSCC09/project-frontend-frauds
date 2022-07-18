<script setup>
defineProps({
  prevFunction: {
    type: Function,
    required: true,
  },
});
</script>

<template>
  <el-button @click="prevFunction"> Go Back </el-button>
</template>

<style scoped></style>
