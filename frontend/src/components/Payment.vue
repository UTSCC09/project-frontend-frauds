<script setup>
import config from "../../config";
import { ref, onBeforeMount } from "vue";
import { StripeElements, StripeElement } from "vue-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { ElMessage, ElMessageBox } from "element-plus";
import { addBooking } from "../services/booking.js";

const props = defineProps({
  // first flight
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
  flightId: {
    type: String,
    required: true,
  },
  // return flight
  returnFlightClass: {
    type: String,
    default: "",
  },
  returnFlightPrice: {
    type: Number,
    default: 0,
  },
  returnFlightSeat: {
    type: Object,
    default: null,
  },
  returnFlightId: {
    type: String,
    default: "",
  },
  roundtrip: {
    type: Boolean,
    required: true,
  },
  taxRate: {
    type: Number,
    required: true,
  },
  resetProcessStage: {
    type: Function,
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

// how to create two cannons: https://github.com/matteobruni/tsparticles/tree/main/presets/confetti
const particlesOptions = {
  preset: "confetti",
  emitters: [
    {
      life: { duration: 10, count: 1 },
      position: { x: 0, y: 30 },
      particles: { move: { direction: "top-right" } },
    },
    {
      life: { duration: 10, count: 1 },
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

// load stripe
onBeforeMount(async () => {
  const stripePromise = loadStripe(stripeKey.value);
  stripePromise.then(() => {
    stripeLoaded.value = true;
  });
});

const onClickPurchase = async () => {
  // check if card is valid
  const cardValid = card.value.domElement.classList.contains(
    "StripeElement--complete"
  );

  // class name to help with getting class id
  const className = { "First Class": 1, Business: 2, Economy: 3 };

  // check if card data is valid
  if (cardValid) {
    try {
      // booking data to add
      const bookingData = {
        userId: "payamyek@gmail.com",
        roundtrip: props.roundtrip,
        cost: props.flightPrice,
        taxRate: props.taxRate,
        totalPaid: (props.flightPrice * (1 + props.taxRate)).toFixed(2),
        currency: "CAD",
        departureFlight: {
          flightId: props.flightId,
          class: className[props.flightClass],
          classDescription: props.flightClass,
          seat: {
            x: props.flightSeat.x,
            y: props.flightSeat.y,
          },
        },
      };

      // add return trip information
      if (props.roundtrip) {
        bookingData.returnFlight = {
          flightId: props.returnFlightId,
          class: className[props.returnFlightClass],
          classDescription: props.returnFlightClass,
          seat: {
            x: props.returnFlightSeat.x,
            y: props.returnFlightSeat.y,
          },
        };
      }

      // create booking
      await addBooking(bookingData);
    } catch (err) {
      console.log(err);
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
    ElMessageBox.alert(
      "Confirmation email with booking details and invoice will be sent shortly. Thank you for using Air Toronto!",
      "Payment Successful",
      {
        confirmButtonText: "Continue",
        callback: props.resetProcessStage,
      }
    );
  } else {
    ElMessage.error("Please provide valid card information.");
  }
};
</script>

<template>
  <Particles
    v-if="showConfetti"
    id="confettiPreset"
    :particlesInit="particlesInit"
    :options="particlesOptions"
  />
  <!-- Flight Details-->
  <div v-if="roundtrip" class="flight-details">
    <h3>
      <span class="text-bold"> Departure Flight Seat Location:</span>
      <span class="float-right">({{ flightSeat.x }}, {{ flightSeat.y }})</span>
    </h3>
    <h3>
      <span class="text-bold">Departure Flight Seat Class:</span>
      <span class="float-right">{{ flightClass }}</span>
    </h3>
    <h3>
      <span class="text-bold">Departure Flight Cost:</span>
      <span class="float-right">${{ flightPrice }} CAD</span>
    </h3>
    <hr />
    <h3>
      <span class="text-bold"> Return Flight Seat Location:</span>
      <span class="float-right"
        >({{ returnFlightSeat.x }}, {{ returnFlightSeat.y }})</span
      >
    </h3>
    <h3>
      <span class="text-bold">Return Flight Seat Class:</span>
      <span class="float-right">{{ returnFlightClass }}</span>
    </h3>
    <h3>
      <span class="text-bold">Return Flight Cost:</span>
      <span class="float-right">${{ returnFlightPrice }} CAD</span>
    </h3>
    <hr />
    <hr />
    <h3>
      <span class="text-bold">Taxes ({{ taxRate * 100 }}%): </span>
      <span class="float-right"
        >${{
          ((returnFlightPrice + flightPrice) * taxRate).toFixed(2)
        }}
        CAD</span
      >
    </h3>
    <h3>
      <span class="text-bold">Total Due:</span>
      <span class="float-right"
        >${{
          ((flightPrice + returnFlightPrice) * (1 + taxRate)).toFixed(2)
        }}
        CAD</span
      >
    </h3>
  </div>
  <div v-else class="flight-details">
    <h3>
      <span class="text-bold">Seat Location:</span>
      <span class="float-right">({{ flightSeat.x }}, {{ flightSeat.y }})</span>
    </h3>
    <h3>
      <span class="text-bold">Seat Class:</span>
      <span class="float-right">{{ flightClass }}</span>
    </h3>
    <h3>
      <span class="text-bold">Flight Cost:</span>
      <span class="float-right">${{ flightPrice }} CAD</span>
    </h3>
    <hr />
    <h3>
      <span class="text-bold">Taxes ({{ taxRate * 100 }}%): </span>
      <span class="float-right"
        >{{ (flightPrice * taxRate).toFixed(2) }} CAD</span
      >
    </h3>
    <h3>
      <span class="text-bold">Total Due:</span>
      <span class="float-right"
        >${{ (flightPrice * (1 + taxRate)).toFixed(2) }} CAD</span
      >
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
.float-right {
  float: right;
}

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
