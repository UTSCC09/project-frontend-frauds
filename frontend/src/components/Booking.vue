<template>
  <div>
    <el-skeleton v-if="loading === true" :rows="10" animated />
    <div v-else-if="userBookings.length === 0">
      <h2>No Data Found</h2>
    </div>
    <ul v-else>
      <li
        class="booking-result"
        v-for="booking in userBookings"
        :key="booking._id"
      >
        <el-row>
          <el-col :span="10">
            <span class="text-bold"> Flight ID: </span>
            {{ booking._id }}
          </el-col>
          <el-col :span="7">
            <span class="text-bold"> Round Trip: </span>
            {{ booking.roundtrip }}
          </el-col>
          <el-col :span="7">
            <span class="text-bold"> Currency: </span>
            {{ booking.currency }}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <span class="text-bold"> Cost: $ </span>
            {{ booking.cost }}
          </el-col>
          <el-col :span="7">
            <span class="text-bold"> Tax Rate: </span>
            {{ booking.taxRate }}
          </el-col>
          <el-col :span="7">
            <span class="text-bold"> Total Paid: $ </span>
            {{ booking.totalPaid }}
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <span class="text-bold"> Receipt: </span>
              <a @click=downloadBookingReceipt(booking._id)>Download</a>
          </el-col>
        </el-row>
      </li>
    </ul>
  </div>
</template>
<script setup>
import { useAuth0 } from "@auth0/auth0-vue";
import { ref, onBeforeMount } from "vue";
import { getUserInfo } from "../services/user";
import { getBooking, downloadBookingReceipt } from "../services/booking";

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

<style scoped>
ul {
  padding-inline-start: 0;
}

.flight-result {
  margin-bottom: 2rem;
}
.el-row {
  margin-top: 5px;
}

.text-bold {
  font-weight: bold;
}

.booking-result {
  padding: 10px 15px 10px 15px;
  border-radius: 12px;
  color: #ccc9d4;
  background: #3a3840;
  display: block;
  margin-bottom: 30px;
}

.booking-result:hover {
  transition: transform 0.3s ease-in-out;
  transform: scale(1.003);
  box-shadow: 0px 0px 11px 2px #aba8a8;
}
</style>
