<script setup>
import SeatMap from "../components/SeatMap.vue";
import FlightSearch from "../components/FlightSearch.vue";
import SearchResult from "../components/SearchResult.vue";
import { ref, reactive, toRefs } from "vue";
import PageTitle from "../components/PageTitle.vue";
import GoBackButton from "../components/GoBackButton.vue";
import Payment from "../components/Payment.vue";

// page titles
const pageTitle = [
  "Book Flight",
  "Choose Flight",
  "Select Seats",
  "Purchase Flight",
];

// track which stage user is at (0: flight search, 1: results, 2: seat map, 3: payment)
const processStage = ref(0);

// flight search params
const sourceAirport = ref("");
const destAirport = ref("");
const departureDate = ref();

// flight result vars
let flight = reactive({
  _id: "",
  routeId: "",
  price: {
    economy: 0,
    business: 0,
    firstClass: 0,
  },
  equipmentListData: {
    iata: "",
    icao: "",
    name: "",
    planeId: "",
    seats: [],
  },
});

// payment props
const { _id } = toRefs(flight);
let seat = reactive({ x: -1, y: -1 });
let seatClass = ref("");
let seatPrice = ref(0);

// process stage helpers
const resetProcessStage = () => (processStage.value = 0);
const decrementProcessStage = () =>
  (processStage.value = Math.max(processStage.value - 1, 0));
const incrementProcessStage = () =>
  (processStage.value = Math.min(processStage.value + 1, 3));

// r setters
const setSeat = (x, y) => Object.assign(seat, { x, y });
const setSourceAirport = (x) => (sourceAirport.value = x);
const setDestAirport = (x) => (destAirport.value = x);
const setDepartureDate = (x) => (departureDate.value = x);
const setFlight = (x) => Object.assign(flight, x);
const setSeatClass = (x) => (seatClass.value = x);
const setSeatPrice = (x) => (seatPrice.value = x);
</script>

<template>
  <main>
    <!-- Page Headers-->
    <el-row>
      <el-col :span="20">
        <PageTitle :title="pageTitle[processStage]" class="flex-1" />
      </el-col>
      <el-col :span="4" class="back-btn">
        <GoBackButton
          v-if="processStage !== 0"
          :prev-function="decrementProcessStage"
          class="flex-1"
        />
      </el-col>
    </el-row>

    <!-- Screens -->
    <FlightSearch
      v-if="processStage === 0"
      :increment-process-stage="incrementProcessStage"
      :set-source-airport="setSourceAirport"
      :set-dest-airport="setDestAirport"
      :set-departure-date="setDepartureDate"
    />
    <SearchResult
      v-else-if="processStage === 1"
      :dest-airport="destAirport"
      :source-airport="sourceAirport"
      :departure-date="departureDate"
      :increment-process-stage="incrementProcessStage"
      :set-flight="setFlight"
    />
    <SeatMap
      v-else-if="processStage === 2"
      :flight="flight"
      :set-seat="setSeat"
      :increment-process-stage="incrementProcessStage"
      :set-seat-price="setSeatPrice"
      :set-seat-class="setSeatClass"
    />
    <Payment
      v-else-if="processStage === 3"
      :tax-rate="0.15"
      :flight-class="seatClass"
      :flight-price="seatPrice"
      :flight-seat="seat"
      :flight-id="_id"
      :reset-process-stage="resetProcessStage"
    />
  </main>
</template>

<style scoped>
.back-btn {
  align-self: center;
  text-align: end;
}
.el-row {
  margin-bottom: 1rem;
}
</style>
