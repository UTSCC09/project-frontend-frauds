<script setup>
import AddFlight from "../components/AddFlight.vue";
import PageTitle from "../components/PageTitle.vue";
import { onMounted, ref } from "vue";
import { getUserInfo } from "../services/user";

const adminPriv = ref(false);
const userInfo = ref({});
const loading = ref(true);
onMounted(async () => {
  userInfo.value = await getUserInfo();
  adminPriv.value = ["user", "admin"].every((val) =>
    userInfo.value.role.includes(val)
  );
  loading.value = false;
});
</script>

<template>
  <main v-if="!loading && adminPriv">
    <PageTitle title="Add Flight" />
    <AddFlight />
  </main>
  <main v-if="!loading && !adminPriv">
    <h1>Please ensure you have admin privilege</h1>
  </main>
</template>
