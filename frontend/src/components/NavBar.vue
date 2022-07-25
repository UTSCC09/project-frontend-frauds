<script setup>
import { ref } from "vue";
import logo from "@/assets/logo.png";


const activeIndex = ref("1");

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
    <el-menu-item index="3" route="/bookings">Bookings</el-menu-item>
    <el-menu-item index="4" route="/credits">Credits</el-menu-item>
    <el-menu-item index="5" route="/signin">Sign In</el-menu-item>
    <el-menu-item index="6" route="/signup">Profile</el-menu-item>
    <el-menu-item index="7" route="/signout">Sign Out</el-menu-item>
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
