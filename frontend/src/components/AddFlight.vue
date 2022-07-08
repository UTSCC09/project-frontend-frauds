<script setup>
import { reactive, ref } from "vue";
import { searchRoutes } from "../services/route";
import { searchPlanes } from "../services/plane";
const formRef = ref(null);

// do not use same name with ref
const form = reactive({
  route: "",
  airline: "",
  airplane: "",
  departureAirport: "",
  arrivalAirport: "",
  dateRange: [],
  firstClassPrice: 0,
  businessClassPrice: 0,
  economyClassPrice: 0,
});

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
      trigger: "change",
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

const onSubmit = async (formElement) => {
  if (!formElement) return;
  await formElement.validate((valid, fields) => {
    if (valid) formElement.resetFields();
    else console.log("error submit!", fields);
  });
};

const fetchPlaneSuggestions = async (query, cb) => {
  const resp = await searchPlanes(query);
  const results = resp.data.data.map(({ name, iata }) => {
    return {
      value: `${iata} - ${name}`,
      name,
      iata,
    };
  });
  cb(results);
};

const fetchRouteSuggestions = async (query, cb) => {
  const resp = await searchRoutes(query);
  const results = resp.data.data.map(
    ({ routeId, sourceAirport, destAirport, airline, name, iata }) => {
      return {
        value: `[ROUTE ${routeId}] ${sourceAirport} -> ${destAirport} via Airline ${airline} `,
        name,
        iata,
      };
    }
  );
  cb(results);
};
</script>

<template>
  <el-form
    :model="form"
    :rules="rules"
    ref="formRef"
    class="add-flight-form"
    label-width="250px"
    size="large"
  >
    <el-form-item label="Route" prop="route">
      <el-autocomplete
        style="width: 100%"
        clearable
        :fetch-suggestions="fetchRouteSuggestions"
        v-model="form.route"
        placeholder="Route (ex. [ROUTE 1] AER -> KZN via Airline 2B)"
      />
    </el-form-item>
    <el-form-item label="Airline">
      <el-input
        style="width: 100%"
        readonly
        disabled
        v-model="form.airline"
        placeholder="Airline (ex. Air Canada)"
      />
    </el-form-item>
    <el-form-item label="Leaving">
      <el-input
        style="width: 100%"
        readonly
        disabled
        v-model="form.departureAirport"
        placeholder="Departure Airport (ex. YYZ)"
      />
    </el-form-item>
    <el-form-item label="Arriving">
      <el-input
        style="width: 100%"
        readonly
        disabled
        v-model="form.arrivalAirport"
        placeholder="Arrival Airport (ex. CDG)"
      />
    </el-form-item>
    <el-form-item label="Airplane" prop="airplane">
      <el-autocomplete
        style="width: 100%"
        clearable
        :fetch-suggestions="fetchPlaneSuggestions"
        v-model="form.airplane"
        placeholder="Airplane (ex. Boeing 770)"
      />
    </el-form-item>

    <!-- date -->
    <el-form-item label="Travel Dates" prop="dateRange">
      <el-date-picker
        v-model="form.dateRange"
        type="datetimerange"
        range-separator="To"
        start-placeholder="Departure date"
        end-placeholder="Return date"
        value-format="X"
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
      <el-button type="primary" @click="onSubmit(formRef)">Search</el-button>
    </el-form-item>
  </el-form>
</template>
