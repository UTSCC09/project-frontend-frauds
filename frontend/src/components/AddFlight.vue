<script setup>
import { reactive, ref } from "vue";
import { addFlight } from "../services/flight";
import { searchRoutes } from "../services/route";
import { ElMessage } from "element-plus";
import { disablePastDates } from "../utils";

// form ref
const formRef = ref(null);

// do not use same name with ref
const form = reactive({
  routeId: "",
  planeId: "",
  route: "",
  airline: "",
  arrivalAirport: "",
  departureAirport: "",
  airplane: "",
  airplaneOptions: [],
  dateRange: [],
  firstClassPrice: 0,
  businessClassPrice: 0,
  economyClassPrice: 0,
});

// form rules
const rules = reactive({
  route: [
    {
      required: true,
      message: "Please select route",
      trigger: "change",
    },
  ],
  airplane: [
    {
      required: true,
      message: "Please select airplane",
      trigger: "change",
    },
  ],
  dateRange: [
    {
      required: true,
      message: "Please enter Arrival and Departure Dates",
      trigger: "focus",
    },
  ],
  firstClassPrice: [
    {
      required: true,
      message: "Please enter price for first class seats",
      trigger: "change",
    },
    {
      type: "number",
      message: "Price must be a number",
      trigger: "change",
    },
  ],
  businessClassPrice: [
    {
      required: true,
      message: "Please enter price for business class seats",
      trigger: "change",
    },
    {
      type: "number",
      message: "Price must be a number",
      trigger: "change",
    },
  ],
  economyClassPrice: [
    {
      required: true,
      message: "Please enter price for economy class seats",
      trigger: "change",
    },
    {
      type: "number",
      message: "Price must be a number",
      trigger: "change",
    },
  ],
});

// how to create two cannons: https://github.com/matteobruni/tsparticles/tree/main/presets/confetti
const particlesOptions = {
  preset: "confetti",
  emitters: [
    {
      life: { duration: 2, count: 1 },
      position: { x: 0, y: 30 },
      particles: { move: { direction: "top-right" } },
    },
    {
      life: { duration: 2, count: 1 },
      position: { x: 100, y: 30 },
      particles: { move: { direction: "top-left" } },
    },
  ],
};

// init function for confetti
async function particlesInit(engine) {
  await loadConfettiPreset(engine); // eslint-disable-line
}

// ref to control showing of confetti
const showConfetti = ref(false);

// submit handler
const onSubmit = async (formElement) => {
  if (!formElement) return;

  // validate form
  await formElement.validate(async (valid) => {
    let resp;

    // check if form is valid
    if (valid) {
      // body of add flight request
      const body = {
        routeId: form.routeId,
        planeId: form.planeId,
        departureTime: form.dateRange[0],
        arrivalTime: form.dateRange[1],
        duration: form.dateRange[1] - form.dateRange[0],
        price: {
          economy: form.economyClassPrice,
          business: form.businessClassPrice,
          firstClass: form.firstClassPrice,
        },
      };

      try {
        // add flight
        resp = await addFlight(body);
      } catch (err) {
        return err.response.data.errors.forEach((e) =>
          ElMessage({
            type: "error",
            message: e.msg,
          })
        );
      }

      // show confetti
      showConfetti.value = true;

      // show message
      ElMessage({
        message: resp.data.message,
        type: "success",
      });

      // reset form
      formElement.resetFields();
      form.airline = "";
      form.arrivalAirport = "";
      form.departureAirport = "";
      form.dateRange = [];
    }
  });
};

// update form when route is selected
const handleRouteSelect = (e) => {
  if (!e) return;

  // save route id
  form.routeId = e.routeId;

  // update airline
  form.airline = `${e.airlineData[0].iata} - ${
    e.airlineData[0].name
  } (${e.airlineData[0].country.toUpperCase()})`;

  // update departure airport
  form.departureAirport = `${e.sourceAirportData[0].iata} - ${
    e.sourceAirportData[0].name
  } (${e.sourceAirportData[0].city.toUpperCase()}, ${e.sourceAirportData[0].country.toUpperCase()})`;

  // update arrival airport
  form.arrivalAirport = `${e.destAirportData[0].iata} - ${
    e.destAirportData[0].name
  } (${e.destAirportData[0].city.toUpperCase()}, ${e.destAirportData[0].country.toUpperCase()})`;

  // update list of airplanes
  form.airplaneOptions = [...e.equipmentListData];

  // refresh airplane
  form.airplane = "";
};

// save selected plane
const handlePlaneSelect = (e) => {
  if (!e) return;

  // update selected plan
  form.planeId = e.substring(7, e.indexOf("]")).trim();
};

// fetch route suggestions
const fetchRouteSuggestions = async (query, cb) => {
  let resp;

  try {
    resp = await searchRoutes(query);
  } catch (err) {
    return err.response.data.errors.forEach((e) =>
      ElMessage({
        type: "error",
        message: e.msg,
      })
    );
  }

  // generate search results
  const results = resp.data.data.map(
    ({ routeId, sourceAirport, destAirport, airline, ...rest }) => {
      return {
        value: `[ROUTE ${routeId}] ${sourceAirport} → ${destAirport} via ${airline}`,
        routeId,
        sourceAirport,
        destAirport,
        airline,
        ...rest,
      };
    }
  );

  // update search results
  cb(results);
};
</script>

<template>
  <Particles
    v-if="showConfetti"
    id="confettiPreset"
    :particlesInit="particlesInit"
    :options="particlesOptions"
  />
  <el-form
    :model="form"
    :rules="rules"
    ref="formRef"
    class="add-flight-form"
    label-width="250px"
    size="large"
  >
    <!-- Route Picker -->
    <el-form-item label="Route" prop="route">
      <el-autocomplete
        style="width: 100%"
        clearable
        :fetch-suggestions="fetchRouteSuggestions"
        @select="handleRouteSelect"
        v-model="form.route"
        placeholder="Please enter Route Number/Airport/Airline "
      />
    </el-form-item>

    <!-- Static Fields -->
    <el-form-item label="Airline">
      <el-input
        style="width: 100%"
        readonly
        disabled
        v-model="form.airline"
        placeholder="Airline"
      />
    </el-form-item>
    <el-form-item label="Leaving">
      <el-input
        style="width: 100%"
        readonly
        disabled
        v-model="form.departureAirport"
        placeholder="Departure Airport"
      />
    </el-form-item>
    <el-form-item label="Arriving">
      <el-input
        style="width: 100%"
        readonly
        disabled
        v-model="form.arrivalAirport"
        placeholder="Arrival Airport"
      />
    </el-form-item>

    <!-- Plane Select -->
    <el-form-item label="Airplane" prop="airplane">
      <el-select
        :disabled="form.route.includes('[') === false"
        v-model="form.airplane"
        placeholder="Select Airplane"
        @change="handlePlaneSelect"
      >
        <el-option
          v-for="item in form.airplaneOptions"
          :key="item.name"
          :value="`[PLANE ${item.planeId}] ${item.name}`"
        />
      </el-select>
    </el-form-item>

    <!-- date -->
    <el-form-item label="Flight Dates" prop="dateRange">
      <el-date-picker
        v-model="form.dateRange"
        type="datetimerange"
        range-separator="To"
        start-placeholder="Departure date"
        end-placeholder="Arrival date"
        value-format="X"
        :disabled-date="disablePastDates"
      />
    </el-form-item>

    <!--price -->
    <el-form-item label="First Class Price ($ CAD)" prop="firstClassPrice">
      <el-input
        v-model.number="form.firstClassPrice"
        placeholder="Please input"
      />
    </el-form-item>
    <el-form-item
      label="Business Class Price ($ CAD)"
      prop="businessClassPrice"
    >
      <el-input
        v-model.number="form.businessClassPrice"
        placeholder="Please input"
      />
    </el-form-item>
    <el-form-item label="Economy Class Price ($ CAD)" prop="economyClassPrice">
      <el-input
        v-model.number="form.economyClassPrice"
        placeholder="Please input"
      />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="onSubmit(formRef)"
        >Add Flight</el-button
      >
    </el-form-item>
  </el-form>
</template>

<style>
.el-select {
  flex: 1;
}
</style>
