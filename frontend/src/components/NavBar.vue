<script setup>
import { ref, onMounted } from "vue";
import logo from "@/assets/logo.png";

const activeIndex = ref("1");

onMounted(() => {
  const currentUrl = window.location.href;

  if (currentUrl.endsWith("/add-flight")) {
    activeIndex.value = "2";
  } else if (currentUrl.endsWith("/flight-events")) {
    activeIndex.value = "3";
  } else if (currentUrl.endsWith("/bookings")) {
    activeIndex.value = "4";
  } else if (currentUrl.endsWith("/credits")) {
    activeIndex.value = "5";
  }
});
</script>

<template>
  <el-menu
    :default-active="activeIndex"
    class="app-nav-bar"
    mode="horizontal"
    :ellipsis="false"
    router
  >
    <el-image :src="logo" />
    <div class="flex-grow"></div>
    <el-menu-item index="1" route="/">Home</el-menu-item>
    <el-menu-item index="2" route="/add-flight">Add Flight</el-menu-item>
    <el-menu-item index="3" route="/flight-events">Flight Events</el-menu-item>
    <el-menu-item index="4" route="/bookings">My Bookings</el-menu-item>
    <el-menu-item index="5" route="/credits">Credits</el-menu-item>
  </el-menu>
</template>

<style>
.flex-grow {
  flex-grow: 1;
}

.el-image {
  object-fit: scale-down;
  width: 180px;
  height: 55px;
  margin-bottom: 10px;
}
</style>
