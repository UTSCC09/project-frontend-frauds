<script setup>
import SeatMap from "../components/SeatMap.vue";
import FlightSearch from "../components/FlightSearch.vue";
import SearchResult from "../components/SearchResult.vue";
import { ref, reactive, toRefs } from "vue";
import PageTitle from "../components/PageTitle.vue";
import GoBackButton from "../components/GoBackButton.vue";
import Payment from "../components/Payment.vue";
import { computed } from "vue";

/* track which stage user is at
  (0: flight search, 1: results, 2: seat map, 3: payment)
  ROUNDTRIP (3: results, 4: seat map, 5: payment) */
const processStage = ref(0);

/* Track if Flight is Roundtrip */
const roundtrip = ref(true);

/* Page Titles */
const pageTitle = computed(() => {
  if (roundtrip.value) {
    return [
      "Book Flight",
      "Choose Departure Flight",
      "Select Departure Flight Seats",
      "Choose Return Flight",
      "Select Return Flight Seats",
      "Purchase Flight",
    ];
  }
  return ["Book Flight", "Choose Flight", "Select Seats", "Purchase Flight"];
});

/* Flight Search Info */
const sourceAirport = ref("");
const destAirport = ref("");
const departureDate = ref(0);
const returnDate = ref(0);

/* Departure Flight */
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

/*  Return Flight */
let returnFlight = reactive({
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

/* Retrieve Flight Id's */
const { _id } = toRefs(flight);
const { _id: _returnId } = toRefs(returnFlight);

/* Departure Flight Seat Info */
let seat = reactive({ x: -1, y: -1 });
let seatClass = ref("");
let seatPrice = ref(0);

/* Return Flight Seat Info */
let returnSeat = reactive({ x: -1, y: -1 });
let returnSeatClass = ref("");
let returnSeatPrice = ref(0);

/* Process Stage Helpers */
const resetProcessStage = () => (processStage.value = 0);
const decrementProcessStage = () =>
  (processStage.value = Math.max(processStage.value - 1, 0));
const incrementProcessStage = () =>
  (processStage.value = processStage.value + 1);

/* Ref Setters */
const setSourceAirport = (x) => (sourceAirport.value = x);
const setDestAirport = (x) => (destAirport.value = x);
const setDepartureDate = (x) => (departureDate.value = x);
const setReturnDate = (x) => (returnDate.value = x);

const setFlight = (x) => Object.assign(flight, x);
const setReturnFlight = (x) => Object.assign(returnFlight, x);

const setSeat = (x, y) => Object.assign(seat, { x, y });
const setSeatClass = (x) => (seatClass.value = x);
const setSeatPrice = (x) => (seatPrice.value = x);

const setReturnSeat = (x, y) => Object.assign(returnSeat, { x, y });
const setReturnSeatClass = (x) => (returnSeatClass.value = x);
const setReturnSeatPrice = (x) => (returnSeatPrice.value = x);

const setRoundtrip = (x) => (roundtrip.value = x);
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

    <!-- Search -->
    <FlightSearch
      v-if="processStage === 0"
      :increment-process-stage="incrementProcessStage"
      :set-source-airport="setSourceAirport"
      :set-dest-airport="setDestAirport"
      :set-departure-date="setDepartureDate"
      :set-return-date="setReturnDate"
      :set-roundtrip="setRoundtrip"
    />

    <!-- Screens -->
    <div v-if="roundtrip">
      <!-- first leg of trip (destination flight) -->
      <SearchResult
        v-if="processStage === 1"
        :dest-airport="destAirport"
        :source-airport="sourceAirport"
        :departure-date="departureDate"
        :return-date="returnDate"
        :increment-process-stage="incrementProcessStage"
        :set-flight="setFlight"
        :return-flight-must-exist="true"
      />
      <SeatMap
        v-else-if="processStage === 2"
        :flight="flight"
        :set-seat="setSeat"
        :increment-process-stage="incrementProcessStage"
        :set-seat-price="setSeatPrice"
        :set-seat-class="setSeatClass"
      />
      <!-- second leg of trip (return flight) -->
      <SearchResult
        v-else-if="processStage === 3"
        :dest-airport="sourceAirport"
        :source-airport="destAirport"
        :departure-date="returnDate"
        :increment-process-stage="incrementProcessStage"
        :set-flight="setReturnFlight"
      />
      <SeatMap
        v-else-if="processStage === 4"
        :flight="returnFlight"
        :set-seat="setReturnSeat"
        :increment-process-stage="incrementProcessStage"
        :set-seat-price="setReturnSeatPrice"
        :set-seat-class="setReturnSeatClass"
      />
      <Payment
        v-else-if="processStage === 5"
        :tax-rate="0.15"
        :flight-class="seatClass"
        :flight-price="seatPrice"
        :flight-seat="seat"
        :flight-id="_id"
        :return-flight-class="returnSeatClass"
        :return-flight-price="returnSeatPrice"
        :return-flight-seat="returnSeat"
        :return-flight-id="_returnId"
        :roundtrip="true"
        :reset-process-stage="resetProcessStage"
      />
    </div>
    <div v-else>
      <SearchResult
        v-if="processStage === 1"
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
    </div>
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
