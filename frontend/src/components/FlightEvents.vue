<script setup>
import { reactive, ref } from "vue";
import { unsubscribe, subscribe } from "../services/webhook.js";
import { ElMessage } from "element-plus";

// form fields
const form = reactive({
  callbackURL: "",
  flightId: "",
  event: "",
});

// reference to form
const formRef = ref("");

// form rules
const rules = reactive({
  callbackURL: [
    {
      required: true,
      message: "Please enter a callback URL",
      trigger: "change",
    },
  ],
  flightId: [
    {
      required: true,
      message: "Please enter the flight's id",
      trigger: "change",
    },
  ],
  event: [
    {
      required: true,
      message: "Please select an event",
      trigger: "change",
    },
  ],
});

// subscribable events
const events = [
  "FLIGHT_BOOKING (Triggers on all flight bookings)",
  "FLIGHT_BOOKING_FIRST_CLASS (Triggers only on first class flight bookings)",
  "FLIGHT_BOOKING_BUSINESS (Triggers only on business flight bookings)",
  "FLIGHT_BOOKING_ECONOMY (Triggers only on economy flight bookings)",
];

// submit handler for subscribe button
const onSubmitSubscribe = async (formEl) => {
  if (!formEl) return;
  await formEl.validate(async (valid) => {
    if (valid) {
      try {
        await subscribe(
          {
            event: form.event.split("(")[0].trim(),
            callbackURL: form.callbackURL,
          },
          form.flightId
        );
      } catch (err) {
        return err.response.data.errors.forEach((e) =>
          ElMessage({
            type: "error",
            message: e.msg,
          })
        );
      }

      // clear fields
      formEl.resetFields();

      // show message
      ElMessage({
        message: "Subscribed to flight events",
        type: "success",
      });
    }
  });
};

// submit handler for unsubscribe button
const onSubmitUnsubscribe = async (formEl) => {
  if (!formEl) return;
  await formEl.validate(async (valid) => {
    if (valid) {
      // try to unsubscribe
      try {
        await unsubscribe(
          {
            event: form.event.split("(")[0].trim(),
            callbackURL: form.callbackURL,
          },
          form.flightId
        );
      } catch (err) {
        return err.response.data.errors.forEach((e) =>
          ElMessage({
            type: "error",
            message: e.msg,
          })
        );
      }

      // clear fields
      formEl.resetFields();

      // show message
      ElMessage({
        message: "Unsubscribed from flight events",
        type: "success",
      });
    }
  });
};
</script>

<template>
  <el-form
    :model="form"
    :rules="rules"
    ref="formRef"
    label-width="110px"
    size="large"
    class="webhook-subscribe-form"
  >
    <el-form-item label="Select Event" prop="event">
      <el-select placeholder="Select" v-model="form.event">
        <el-option
          v-for="item in events"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="Flight Id" prop="flightId">
      <el-input v-model="form.flightId" placeholder="Please enter flight id" />
    </el-form-item>
    <el-form-item label="Callback URL" prop="callbackURL">
      <el-input v-model="form.callbackURL" placeholder="Please enter URL" />
    </el-form-item>
  </el-form>
  <el-form-item>
    <el-button type="primary" @click="onSubmitSubscribe(formRef)"
      >Subscribe</el-button
    >
    <el-button type="danger" @click="onSubmitUnsubscribe(formRef)"
      >Unsubscribe</el-button
    >
  </el-form-item>
</template>

<style scoped>
.webhook-subscribe-form {
  margin-top: 10px;
}

.el-select {
  flex: 1;
}
</style>
