<script setup>
import { ref } from "vue";

const activeIndex = ref("1");
</script>

<template>
  <el-menu
    :default-active="activeIndex"
    class="app-nav-bar"
    mode="horizontal"
    router
  >
    <el-menu-item index="1" route="/">Home</el-menu-item>
    <el-menu-item index="2" route="/bookings">Bookings</el-menu-item>
    <el-menu-item index="3" route="/add-flight">Add Flight</el-menu-item>
    <el-menu-item index="4" route="/credits">Credits</el-menu-item>
  </el-menu>
</template>
