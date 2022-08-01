<template>
  <div>
    <h2>User Profile</h2>
    <pre>
      <code>{{ user }}</code>
    </pre>
    <pre v-if="loading === false">
      <code>{{userInfo}}</code>
    </pre>
    <pre v-if="loading === false">
      <code>{{userBookings}}</code>
    </pre>
  </div>
</template>
<script setup>
import { useAuth0 } from "@auth0/auth0-vue";
import { ref, onBeforeMount } from "vue";
import { getUserInfo } from "../services/user";
import { getBooking } from "../services/booking";

const { user } = useAuth0();

let userInfo = ref({});
let userBookings = ref({});

const loading = ref(true);

onBeforeMount(async () => {
  userInfo.value = await getUserInfo(user.value.email);
  const response = await getBooking();
  userBookings.value = response.data;
  loading.value = false;
});
</script>
