<template>
  <div>
    <h2>User Profile</h2>
    <h3 v-if="!isAuthenticated">
      User is not logged in, please Log in to see profile
    </h3>
    <el-button v-if="!isAuthenticated" @click="login">Log in</el-button>
    <pre v-if="isAuthenticated">
        <code>{{ user }}</code>
      </pre>
  </div>
</template>
<script>
import { useAuth0 } from "@auth0/auth0-vue";

export default {
  setup() {
    const { loginWithRedirect, user, isAuthenticated } = useAuth0();

    return {
      login: () => {
        loginWithRedirect();
      },
      user,
      isAuthenticated,
    };
  },
};
</script>
