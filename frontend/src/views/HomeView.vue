<script setup>
import SeatMap from "../components/SeatMap.vue";
import FlightSearch from "../components/FlightSearch.vue";
import SearchResult from "../components/SearchResult.vue";
import { ref, reactive } from "vue";
import PageTitle from "../components/PageTitle.vue";

// page titles
const pageTitle = ["Book Flight", "Choose Flight", "Select Seats"];

// track which stage user is at (0: flight search, 1: results, 2: seat map)
const processStage = ref(0);

// flight search params
const sourceAirport = ref("");
const destAirport = ref("");
const departureDate = ref();

// flight result vars
let flight = reactive({
  routeId: "",
  equipmentListData: {
    iata: "",
    icao: "",
    name: "",
    planeId: "",
    seats: [],
  },
});

// setters
const setProcessStage = (x) => (processStage.value = x);
const setSourceAirport = (x) => (sourceAirport.value = x);
const setDestAirport = (x) => (destAirport.value = x);
const setDepartureDate = (x) => (departureDate.value = x);
const setFlight = (x) => Object.assign(flight, x);
</script>

<template>
  <main>
    <PageTitle :title="pageTitle[processStage]" />

    <FlightSearch
      v-if="processStage === 0"
      :set-process-stage="setProcessStage"
      :set-source-airport="setSourceAirport"
      :set-dest-airport="setDestAirport"
      :set-departure-date="setDepartureDate"
    />
    <SearchResult
      v-else-if="processStage === 1"
      :dest-airport="destAirport"
      :source-airport="sourceAirport"
      :departure-date="departureDate"
      :set-process-stage="setProcessStage"
      :set-flight="setFlight"
    />
    <SeatMap v-else-if="processStage === 2" :flight="flight" />
  </main>
</template>

<style scoped>
.page-title {
  padding-top: 1rem;
  padding-bottom: 1rem;
  font-weight: bold;
}
</style>
