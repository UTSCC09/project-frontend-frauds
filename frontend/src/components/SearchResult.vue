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

// get percentage of how many seats are booked
const getPercentageSeatsBooked = (seats) => {
  // convert 2d array to 1d
  const flatSeats = seats.flat();

  const totalSeats = flatSeats.filter((x) => x !== -1).length;
  const bookedSeats = flatSeats.filter((x) => x === 0).length;

  return Math.floor((bookedSeats / totalSeats) * 100);
};
</script>

<template>
  <el-skeleton v-if="loaded === false" :rows="10" animated />
  <div v-else-if="flights.data.length === 0">
    <h2>No Data Found</h2>
  </div>
  <ul v-else>
    <li class="search-result" v-for="flight in flights.data" :key="flight._id">
      <el-row>
        <el-col :span="10">
          <el-row> <span class="text-bold">Air Canada</span> </el-row>
          <el-row>
            <span>
              {{
                Intl.DateTimeFormat("en", dateFormatOptions).format(
                  flight.departureTime * 1000
                )
              }}
              -
              {{
                Intl.DateTimeFormat("en", dateFormatOptions).format(
                  flight.arrivalTime * 1000
                )
              }}</span
            >
          </el-row>
          <el-row>
            {{ flight.sourceAirportData.iata }}
            ({{ flight.sourceAirportData.city }},
            {{ flight.sourceAirportData.country }}) -
            {{ flight.destAirportData.iata }}
            ({{ flight.destAirportData.city }},
            {{ flight.destAirportData.country }})
          </el-row>
        </el-col>
        <el-col :span="4">
          <el-row justify="center">
            Via {{ flight.equipmentListData.name }}</el-row
          >
          <el-row justify="center">
            Duration {{ convertSecondsToHoursMinutes(flight.duration) }}</el-row
          >
          <el-row justify="center"> 0 Stops </el-row>
        </el-col>
        <el-col :span="10"
          ><el-row justify="end">
            <span class="text-bold">
              Starting from CAD ${{ flight.price.economy }}</span
            ></el-row
          >
          <el-row justify="end"
            >{{ getPercentageSeatsBooked(flight.equipmentListData.seats) }}% of
            seats booked</el-row
          >
          <el-row justify="end">
            <el-button type="primary" @click="onClickSelectFlight(flight)">
              Select
            </el-button>
          </el-row>
        </el-col>
      </el-row>
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
.el-row {
  margin-top: 5px;
}

.text-bold {
  font-weight: bold;
}

.search-result {
  padding: 10px 15px 10px 15px;
  border-radius: 12px;
  color: #ccc9d4;
  background: #3a3840;
  display: block;
  margin-bottom: 30px;
}

.search-result:hover {
  transition: transform 0.25s ease-in-out;
  transform: scale(1.003);
  box-shadow: 0px 0px 11px 3px #aba8a8;
}
</style>
