<script setup>
const dateFormatOptions = {
  timeZoneName: "short",
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h24",
};

defineProps({
  routeId: {
    type: String,
    required: true,
  },
  planeId: {
    type: String,
    required: true,
  },
  airline: {
    type: String,
    required: true,
    default: "Air Canada",
  },
  airplane: {
    type: String,
    required: true,
    default: "Boeing 770",
  },
  duration: {
    type: Number,
    required: true,
    default: 27900,
  },
  departureAirport: {
    type: String,
    required: true,
    default: "YYZ",
  },
  departureTime: {
    type: Number,
    required: true,
    default: 1660434475,
  },
  arrivalTime: {
    type: Number,
    required: true,
    default: 1660520875,
  },
  arrivalAirport: {
    type: String,
    required: true,
    default: "CDG",
  },
  economyPrice: {
    type: Number,
    required: true,
    default: 300,
  },
  businessPrice: {
    type: Number,
    required: true,
    default: 850,
  },
  firstClassPrice: {
    type: Number,
    required: true,
    default: 1500,
  },
});
</script>

<template>
  <el-descriptions title="Air Canada" border>
    <template #extra>
      <el-button type="primary">Select Flight</el-button>
    </template>
    <el-descriptions-item label="Departure Airport">{{
      departureAirport
    }}</el-descriptions-item>
    <el-descriptions-item label="Arrival Airport">{{
      arrivalAirport
    }}</el-descriptions-item>
    <el-descriptions-item label="Duration">{{
      `${new Date(duration * 1000)
        .toISOString()
        .substring(11, 13)} H ${new Date(duration * 1000)
        .toISOString()
        .substring(14, 16)} M`
    }}</el-descriptions-item>
    <el-descriptions-item label="Departure Time">{{
      Intl.DateTimeFormat("en", dateFormatOptions).format(departureTime)
    }}</el-descriptions-item>
    <el-descriptions-item label="Arrival Time">
      {{ Intl.DateTimeFormat("en", dateFormatOptions).format(arrivalTime) }}
    </el-descriptions-item>
    <el-descriptions-item label="Airplane">
      <el-tag size="large" round>{{ airplane }}</el-tag>
    </el-descriptions-item>
    <el-descriptions-item label="Economy Price">
      ${{ economyPrice }} CAD
    </el-descriptions-item>
    <el-descriptions-item label="Business Price">
      ${{ businessPrice }} CAD
    </el-descriptions-item>
    <el-descriptions-item label="First Class Price">
      ${{ firstClassPrice }} CAD
    </el-descriptions-item>
  </el-descriptions>
</template>
