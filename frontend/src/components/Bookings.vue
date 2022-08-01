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
  import axios from "axios";
  import config from "../../config";
  import {ref, onBeforeMount} from "vue"
  const { user, getAccessTokenSilently } = useAuth0();

  let userInfo = ref({});

  const loading = ref(true);

  async function getUserInfo() {
    const token = await getAccessTokenSilently();

    console.log(`${config.BACKEND_URL}/user/search`);
    const result = await axios.post(`${config.BACKEND_URL}/api/user/search`, {"email":"lingfengsu0309@gmail.com"},{
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return result.data;
  }


  onBeforeMount(async () => {
    userInfo.value = await getUserInfo();
    loading.value = false;
  })


</script>
