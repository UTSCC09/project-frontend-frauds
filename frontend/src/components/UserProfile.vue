<script setup>
import { useAuth0 } from "@auth0/auth0-vue";
import PageTitle from "./PageTitle.vue";

const { user } = useAuth0();

// firefly presets for tsParticles: https://github.com/matteobruni/tsparticles/tree/main/presets/firefly
const particlesOptions = {
  preset: "firefly",
  background: { color: "#181818" },
};

async function particlesInit(engine) {
  await loadFireflyPreset(engine); // eslint-disable-line
}
</script>

<template>
  <PageTitle title="User Profile" />
  <Particles
    id="fireflyPreset"
    :particlesInit="particlesInit"
    :options="particlesOptions"
  />
  <el-row class="mb-10">
    <el-col>
      <!-- fix 403 error for google image:  https://stackoverflow.com/questions/40570117/http403-forbidden-error-when-trying-to-load-img-src-with-google-profile-pic -->
      <el-avatar :size="100" :src="user.picture" referrerpolicy="no-referrer" />
    </el-col>
  </el-row>
  <el-row class="mb-10">
    <el-col>
      <h1>{{ user.given_name }} {{ user.family_name }}</h1>
    </el-col>
  </el-row>
  <el-row class="mb-10">
    <el-col>
      <el-tag v-if="user.email_verified" class="mr-10" round type="success">
        User Email Verified
      </el-tag>
      <el-tag v-else round type="error">User Email Unverified </el-tag>
      <el-tag round class="mr-10">Region {{ user.locale }} </el-tag>
      <el-tag round>
        Last Updated
        {{ new Date(user.updated_at).toLocaleDateString("en-US") }}
      </el-tag>
    </el-col>
  </el-row>
  <el-row>
    <el-col>
      <h3>Email: {{ user.email }}</h3>
    </el-col>
  </el-row>
</template>

<style scoped>
.mr-10 {
  margin-right: 10px;
}

.mb-10 {
  margin-bottom: 10px;
}
</style>
