<script setup>
import { onMounted, ref, reactive } from "vue";
import { findOneWayFlights } from "../services/flight";
import { convertSecondsToHoursMinutes } from "../utils/index.js";

// options for date
const dateFormatOptions = {
  timeZoneName: "short",
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h24",
};

// component props
const props = defineProps({
  sourceAirport: {
    type: String,
    default: "YYZ",
  },
  destAirport: {
    type: String,
    default: "CDG",
  },
  departureDate: {
    type: Number,
    default: 1658203200,
  },
  incrementProcessStage: {
    type: Function,
    default: () => {},
  },
  setFlight: {
    type: Function,
    default: () => {},
  },
});

// search results refs
let flights = reactive({
  data: [],
  metadata: {
    total: 0,
    page: 0,
    count: 0,
    limit: 0,
  },
});

// did the data load
const loaded = ref(false);

// current pagination page
const currentPage = ref(1);
const pageSize = ref(4);

// fetch date on mount
onMounted(async () => {
  const resp = await findOneWayFlights(
    props.sourceAirport,
    props.destAirport,
    props.departureDate,
    Math.max(0, currentPage.value - 1),
    pageSize.value
  );

  // update flights
  Object.assign(flights, resp.data);

  // data loaded
  loaded.value = true;
});

const onClickSelectFlight = (flight) => {
  // choose flight
  props.setFlight(flight);

  // advance to seat map
  props.incrementProcessStage();
};

const updateCurrentPage = (page) => {
  currentPage.value = page;
};

// track changes to current page
const currentChange = async (page) => {
  // get flights
  const resp = await findOneWayFlights(
    props.sourceAirport,
    props.destAirport,
    props.departureDate,
    Math.max(0, page - 1),
    pageSize.value
  );

  // update flights
  Object.assign(flights, resp.data);
};
</script>

<template>
  <el-skeleton v-if="loaded === false" :rows="10" animated />
  <div v-else-if="flights.data.length === 0">
    <h2>No Data Found</h2>
  </div>
  <ul v-else class="flight-li">
    <li class="flight-li" v-for="flight in flights.data" :key="flight._id">
      <el-descriptions
        class="flight-result"
        :title="flight.airlineData.name"
        border
      >
        <!-- Select Flight Button -->
        <template #extra>
          <el-button type="primary" @click="onClickSelectFlight(flight)"
            >Select Flight</el-button
          >
        </template>

        <!-- Airport Information -->
        <el-descriptions-item label="Departure Airport">{{
          flight.sourceAirportData.iata
        }}</el-descriptions-item>
        <el-descriptions-item label="Arrival Airport">{{
          flight.destAirportData.iata
        }}</el-descriptions-item>

        <!-- Date and Time Information -->
        <el-descriptions-item label="Duration">{{
          convertSecondsToHoursMinutes(flight.duration)
        }}</el-descriptions-item>
        <el-descriptions-item label="Departure Time">{{
          Intl.DateTimeFormat("en", dateFormatOptions).format(
            flight.departureTime * 1000
          )
        }}</el-descriptions-item>
        <el-descriptions-item label="Arrival Time">
          {{
            Intl.DateTimeFormat("en", dateFormatOptions).format(
              flight.arrivalTime * 1000
            )
          }}
        </el-descriptions-item>

        <!-- Price Information -->
        <el-descriptions-item label="Airplane">
          <el-tag size="large" round>{{
            flight.equipmentListData.name
          }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="Economy Price">
          ${{ flight.price.economy }} CAD
        </el-descriptions-item>
        <el-descriptions-item label="Business Price">
          ${{ flight.price.business }} CAD
        </el-descriptions-item>
        <el-descriptions-item label="First Class Price">
          ${{ flight.price.firstClass }} CAD
        </el-descriptions-item>
      </el-descriptions>
    </li>
  </ul>
  <div class="pagination">
    <el-pagination
      :total="flights.metadata.total"
      :current-page="currentPage"
      :page-size="pageSize"
      @update:current-page="updateCurrentPage"
      @current-change="currentChange"
    />
  </div>
</template>

<style scoped>
.flight-result {
  margin-bottom: 2rem;
}

li .flight-li {
  all: unset;
}

ul .flight-li {
  all: unset;
  padding-inline-start: 0;
}
</style>
