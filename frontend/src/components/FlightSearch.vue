<script setup>
import { onMounted, reactive, ref } from 'vue'
import { searchAirports } from '../services/airport.js'
import { disablePastDates } from '../utils'
import { ElMessage } from 'element-plus'

// reference to form
const formRef = ref(null);

// component propsÏ
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

// form fields
const form = reactive({
  departureAirport: "",
  arrivalAirport: "",
  departureDate: 0,
  dateRange: [],
  roundTrip: true,
});

// form rules
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

// set roundtrip true by default
onMounted(() => {
  props.setRoundtrip(true);
});

// form submit handler
const onSubmit = async (formElement) => {
  if (!formElement) return;

  // validate form
  await formElement.validate((valid) => {
    if (valid) {
      // set dates based on flight type
      if (form.roundTrip) {
        props.setDepartureDate(form.dateRange[0]);
        props.setReturnDate(form.dateRange[1]);
      } else {
        props.setDepartureDate(form.departureDate);
      }

      // set source airport
      props.setSourceAirport(form.departureAirport.split("-")[0].trim());

      // set departing airport
      props.setDestAirport(form.arrivalAirport.split("-")[0].trim());

      // show search results
      props.incrementProcessStage();

      // clear form
      formElement.resetFields();
    }
  });
};

// fetch airport suggestions from backend
const fetchSuggestions = async (query, cb) => {
  let resp;

  try {
    // free text search airports
    resp = await searchAirports(query);
  } catch (err) {
    return ElMessage({
      type: "error",
      message: err.response.data.message,
    });
  }

  // structure suggestions
  const results = resp.data.data.map(({ name, iata, city, country }) => {
    return {
      value: `${iata} - ${name} (${city.toUpperCase()}, ${country.toUpperCase()})`,
    };
  });

  // set suggestions
  cb(results);
};

// handle changes to toggle switch
const onClickSwitch = (state) => props.setRoundtrip(state);
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
