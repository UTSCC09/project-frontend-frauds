<script setup>
import PageTitle from "../components/PageTitle.vue";
import { reactive, ref } from "vue";
import { unsubscribe, subscribe } from "../services/webhook.js";

const form = reactive({
  callbackURL: "",
  flightId: "",
  event: "",
});

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
const events = ["FLIGHT_BOOKING (Triggers on Flight Booking)"];

const onSubmitSubscribe = async (formEl) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      await subscribe(
        {
          event: form.event.split("(")[0].trim(),
          callbackURL: form.callbackURL,
        },
        form.flightId
      );
      formEl.resetFields();
    } else console.log("error submit!", fields);
  });
};

const onSubmitUnsubscribe = async (formEl) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      await unsubscribe(
        {
          event: form.event.split("(")[0].trim(),
          callbackURL: form.callbackURL,
        },
        form.flightId
      );
      formEl.resetFields();
    } else console.log("error submit!", fields);
  });
};
</script>

<template>
  <PageTitle title="Flight Events" />

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
