<script setup>
import Booking from "../components/Booking.vue";
import PageTitle from "../components/PageTitle.vue";
</script>

<template>
  <main>
    <PageTitle title="My Bookings"/>
    <Booking />
  </main>
</template>

<style>
.page-title {
  padding: 1rem;
  font-weight: bold;
}
</style>
