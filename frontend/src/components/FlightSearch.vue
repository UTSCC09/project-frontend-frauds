<script lang="ts" setup>
import { reactive, ref } from "vue";
import { searchAirports } from "../services/airport.js";
import { disablePastDates } from "../utils";
import { ElMessage } from "element-plus";

const formRef = ref(null);

const props = defineProps({
  incrementProcessStage: {
    type: Function,
    default: () => {},
  },
  setSourceAirport: {
    type: Function,
    default: () => {},
  },
  setDestAirport: {
    type: Function,
    default: () => {},
  },
  setDepartureDate: {
    type: Function,
    default: () => {},
  },
  setReturnDate: {
    type: Function,
    default: () => {},
  },
  setRoundtrip: {
    type: Function,
    default: () => {},
  },
});

// do not use same name with ref
const form = reactive({
  departureAirport: "",
  arrivalAirport: "",
  departureDate: 0,
  dateRange: [],
  roundTrip: true,
});

const rules = reactive({
  departureAirport: [
    {
      required: true,
      message: "Please select Departure Airport",
      trigger: "change",
    },
  ],
  arrivalAirport: [
    {
      required: true,
      message: "Please select Arrival Airport",
      trigger: "change",
    },
  ],
  departureDate: [
    {
      required: true,
      message: "Please enter Departure Date",
      trigger: "change",
    },
  ],
  dateRange: [
    {
      required: true,
      message: "Please provide Travel Dates",
      trigger: "change",
    },
  ],
});

const onSubmit = async (formElement) => {
  if (!formElement) return;
  await formElement.validate((valid, fields) => {
    if (valid) {
      // set parent refs
      if (form.roundTrip) {
        props.setDepartureDate(form.dateRange[0]);
        props.setReturnDate(form.dateRange[1]);
      } else {
        props.setDepartureDate(form.departureDate);
      }

      props.setSourceAirport(form.departureAirport.split("-")[0].trim());
      props.setDestAirport(form.arrivalAirport.split("-")[0].trim());

      // show search results
      props.incrementProcessStage();

      formElement.resetFields();
    } else console.log("error submit!", fields);
  });
};

const fetchSuggestions = async (query, cb) => {
  let resp;

  try {
    resp = await searchAirports(query);
  } catch (err) {
    return ElMessage({
      type: "error",
      message: err.response.data.message,
    });
  }

  const results = resp.data.data.map(({ name, iata, city, country }) => {
    return {
      value: `${iata} - ${name} (${city.toUpperCase()}, ${country.toUpperCase()})`,
    };
  });
  cb(results);
};

const onClickSwitch = (state) => {
  props.setRoundtrip(state);
};
</script>

<template>
  <el-form
    :model="form"
    :rules="rules"
    ref="formRef"
    class="flight-search-form"
    label-width="130px"
    size="large"
  >
    <el-form-item>
      <el-switch
        v-model="form.roundTrip"
        @change="onClickSwitch"
        class="mb-2"
        active-text="Round Trip"
        inactive-text="One Way"
      />
    </el-form-item>
    <el-form-item label="Leaving" prop="departureAirport">
      <el-autocomplete
        style="width: 100%"
        clearable
        :fetch-suggestions="fetchSuggestions"
        v-model="form.departureAirport"
        placeholder="Departure Airport"
      />
    </el-form-item>
    <el-form-item label="Arriving" prop="arrivalAirport">
      <el-autocomplete
        style="width: 100%"
        clearable
        :fetch-suggestions="fetchSuggestions"
        v-model="form.arrivalAirport"
        placeholder="Arrival Airport"
      />
    </el-form-item>

    <!-- conditional rendering of data picker -->
    <el-form-item v-if="form.roundTrip" label="Travel Dates" prop="dateRange">
      <el-date-picker
        v-model="form.dateRange"
        type="daterange"
        range-separator="To"
        start-placeholder="Departure date"
        end-placeholder="Return date"
        value-format="X"
        :disabled-date="disablePastDates"
      />
    </el-form-item>
    <el-form-item v-else label="Departure Date" prop="departureDate">
      <el-date-picker
        v-model="form.departureDate"
        type="date"
        value-format="X"
        placeholder="Departure Date"
        :disabled-date="disablePastDates"
      />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="onSubmit(formRef)">Search</el-button>
    </el-form-item>
  </el-form>
</template>

<style></style>
