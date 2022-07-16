<script setup>
import config from "../../config";
import { ref, onBeforeMount } from "vue";
import { StripeElements, StripeElement } from "vue-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { ElMessage } from "element-plus";

defineProps({
  flightClass: {
    type: String,
    required: true,
  },
  flightPrice: {
    type: Number,
    required: true,
  },
  flightSeat: {
    type: Object,
    required: true,
  },
  taxRate: {
    type: Number,
    required: true,
  },
});

// stripe refs
const stripeKey = ref(config.STRIPE_KEY);
const stripeLoaded = ref(false);
const card = ref();

const cardOptions = ref({
  // STYLE SOURCE: https://stripe.com/docs/js/appendix/style?type=card
  hidePostalCode: true,
  style: {
    base: {
      iconColor: "#c4f0ff",
      color: "#fff",
      fontWeight: "500",
      fontFamily:
        'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
      fontSize: "18px",
      fontSmoothing: "antialiased",
      ":-webkit-autofill": {
        color: "#fce883",
      },
      "::placeholder": {
        color: "#87BBFD",
      },
    },
    invalid: {
      iconColor: "#FFC7EE",
      color: "#FFC7EE",
    },
  },
});

// load stripe
onBeforeMount(async () => {
  const stripePromise = loadStripe(stripeKey.value);
  stripePromise.then(() => {
    stripeLoaded.value = true;
  });
});

const onClickPurchase = () => {
  const cardValid = card.value.domElement.classList.contains(
    "StripeElement--complete"
  );

  if (cardValid) {
    ElMessage.success("Flight purchase successful!");
  } else {
    ElMessage.error("Please provide valid card information.");
  }
};
</script>

<template>
  <!-- Flight Details-->
  <div class="flight-details">
    <h3>
      <span class="text-bold">Seat Location:</span> ({{ flightSeat.x }},
      {{ flightSeat.y }})
    </h3>
    <h3><span class="text-bold">Seat Class:</span> {{ flightClass }}</h3>
    <h3><span class="text-bold">Flight Cost:</span> ${{ flightPrice }} CAD</h3>
    <hr />
    <h3>
      <span class="text-bold">Taxes ({{ taxRate * 100 }}%): </span
      >{{ (flightPrice * taxRate).toFixed(2) }} CAD
    </h3>
    <h3>
      <span class="text-bold">Total Due:</span> ${{
        (flightPrice * (1 + taxRate)).toFixed(2)
      }}
      CAD
    </h3>
  </div>

  <!-- Payment -->
  <h3 class="credit-card-label">Enter Credit Card</h3>
  <StripeElements
    v-if="stripeLoaded"
    v-slot="{ elements }"
    :stripe-key="stripeKey"
  >
    <StripeElement
      id="card"
      ref="card"
      type="card"
      :elements="elements"
      :options="cardOptions"
    />
  </StripeElements>
  <el-button @click="onClickPurchase">Purchase Flight</el-button>
</template>

<style scoped>
.credit-card-label {
  margin-bottom: 0.5rem;
}

hr {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}
.flight-details {
  margin-bottom: 2rem;
}

.text-bold {
  font-weight: bolder;
}

.el-button {
  margin-top: 2rem;
}
</style>
