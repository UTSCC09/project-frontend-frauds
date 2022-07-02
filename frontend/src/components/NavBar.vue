<script lang="ts" setup>
import { ref } from "vue";

const activeIndex = ref("1");
const handleSelect = (key, keyPath) => {
  console.log(key, keyPath);
};
</script>

<template>
  <el-menu
    :default-active="activeIndex"
    class="app-nav-bar"
    mode="horizontal"
    background-color="transparent"
    text-color="white"
    @select="handleSelect"
  >
    <el-menu-item index="1">Home</el-menu-item>
    <el-menu-item index="2">Bookings</el-menu-item>
    <el-menu-item index="3">Credits</el-menu-item>
  </el-menu>
</template>
