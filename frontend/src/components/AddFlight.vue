<script setup>
import { reactive, ref } from "vue";
import { searchRoutes } from "../services/route";
import { searchPlanes } from "../services/plane";

// form ref
const formRef = ref(null);

// do not use same name with ref
const form = reactive({
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

const handleRouteSelect = (e) => {
  form.airline = `${e.airlineData[0].iata} - ${e.airlineData[0].name}`;
  form.arrivalAirport = `${e.sourceAirportData[0].iata} - ${e.sourceAirportData[0].name}`;
  form.departureAirport = `${e.destAirportData[0].iata} - ${e.destAirportData[0].name}`;
  form.airplaneOptions = [...e.equipmentListData];
  console.log(form.airplaneOptions);
};

const fetchRouteSuggestions = async (query, cb) => {
  const resp = await searchRoutes(query);
  const results = resp.data.data.map(
    ({ routeId, sourceAirport, destAirport, airline, ...rest }) => {
      return {
        value: `[ROUTE ${routeId}] ${sourceAirport} to ${destAirport} via ${airline} `,
        routeId,
        sourceAirport,
        destAirport,
        airline,
        ...rest,
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
    <!-- Route Picker -->
    <el-form-item label="Route" prop="route">
      <el-autocomplete
        style="width: 100%"
        clearable
        :fetch-suggestions="fetchRouteSuggestions"
        @select="handleRouteSelect"
        v-model="form.route"
        placeholder="Route (ex. [ROUTE 1] AER to KZN via 2B)"
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
    <el-form-item label="Airplane" prop="airplane">
      <el-select v-model="form.airplane" placeholder="Select Airplane">
        <el-option
          v-for="item in form.airplaneOptions"
          :key="item.name"
          :value="item.name"
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

<style>
.el-select {
  flex: 1;
}
</style>
