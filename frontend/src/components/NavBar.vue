<script setup>
import { ref, onMounted } from "vue";
import logo from "@/assets/logo.png";
import {
  HomeFilled,
  DocumentAdd,
  Ticket,
  Watch,
} from "@element-plus/icons-vue";

const activeIndex = ref("1");

onMounted(() => {
  const currentUrl = window.location.href;

  if (currentUrl.endsWith("/add-flight")) {
    activeIndex.value = "2";
  } else if (currentUrl.endsWith("/flight-events")) {
    activeIndex.value = "3";
  } else if (currentUrl.endsWith("/bookings")) {
    activeIndex.value = "4";
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
    <el-menu-item index="1" route="/">
      <el-icon><HomeFilled /></el-icon>
      Home
    </el-menu-item>
    <el-menu-item index="2" route="/add-flight">
      <el-icon><DocumentAdd /></el-icon>
      Add Flight
    </el-menu-item>
    <el-menu-item index="3" route="/flight-events">
      <el-icon><Watch /></el-icon>
      Flight Events
    </el-menu-item>
    <el-menu-item index="4" route="/bookings">
      <el-icon><Ticket /></el-icon>
      My Bookings
    </el-menu-item>
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
