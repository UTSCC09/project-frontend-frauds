<template>
  <div>
    <h2>User Profile</h2>
    <pre>
      <code>{{ user }}</code>
    </pre>
    <pre v-if="loading === false">
      <code>{{userInfo}}</code>
    </pre>

  </div>
</template>
<script setup>
  import { useAuth0 } from "@auth0/auth0-vue";
  import {ref, onBeforeMount} from "vue"
  import {getUserInfo} from "../services/user";

  const { user } = useAuth0();

  let userInfo = ref({});

  const loading = ref(true);

  onBeforeMount(async () => {
    userInfo.value = await getUserInfo();
    loading.value = false;
  })


</script>
