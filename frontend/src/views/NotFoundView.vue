<script setup>
import config from "../../config.js";

// how to use fire preset: https://github.com/matteobruni/tsparticles/blob/main/presets/fire/README.md
const particlesOptions = {
  preset: "fire",
};

async function particlesInit(engine) {
  await loadFirePreset(engine); // eslint-disable-line
}
</script>

<template>
  <Particles
    id="firePreset"
    :options="particlesOptions"
    :particlesInit="particlesInit"
  />

  <div class="text-container">
    <h1>404 - You are Lost, May You Find the Light!</h1>
    <h1>Why Are You Here? 🤐</h1>
    <h1>This is the dark side! ☠️</h1>
    <h1><a :href="config.FRONTEND_URL">Click me</a> to find the light.</h1>
  </div>
</template>

<style scoped>
.text-container {
  text-align: center;
  margin-top: 35vh;
}
</style>
