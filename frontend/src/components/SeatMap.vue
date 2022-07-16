<script setup>
import { reactive, ref } from "vue";

const props = defineProps({
  flight: {
    type: Object,
    required: true,
  },
});

// seat that is currently selected
const seat = reactive({ x: 0, y: 0 });

// seat selected or not
const seatSelected = ref(false);

// determine seat price
const getSeatPrice = (seat) => {
  if (seat === -1) return;

  let price = 0;

  // determine price
  if (seat === 1) price = props.flight.price.firstClass;
  else if (seat === 2) price = props.flight.price.business;
  else price = props.flight.price.economy;

  return `$${price}`;
};

// on click for seat
const onClickSeat = (e, x, y) => {
  if (!seatSelected.value) {
    Object.assign(seat, { x, y });
    seatSelected.value = true;
    e.target.classList.toggle("selected");
  } else if (e.target.classList.contains("selected")) {
    Object.assign(seat, { x, y });
    seatSelected.value = false;
    e.target.classList.toggle("selected");
  }
};
</script>

<template>
  <el-row>
    <h3>Selected Seat: ({{ seat.x }}, {{ seat.y }})</h3>
    <el-button type="success">Purchase</el-button>
  </el-row>
  <div class="seats-container">
    <el-row v-for="(row, x) in flight.equipmentListData.seats" :key="x">
      <el-col class="flex-1" v-for="(seat, y) in row" :key="y" :span="2">
        <div
          class="seat-wrapper"
          @click="(e) => onClickSeat(e, x, y)"
          :class="{
            seat: seat !== -1,
            reserved: seat === 0,
            'first-class': seat === 1,
            'business-class': seat === 2,
            'economy-class': seat === 3,
          }"
        >
          {{ getSeatPrice(seat) }}
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
h3 {
  margin-bottom: 1rem;
  margin-right: 1rem;
}

.flex-1 {
  flex: 1;
}

.seats-container {
  border-radius: 20px;
  padding: 10px;
  width: 40vw;
  height: 2170px;
  background: rgba(1, 1, 1, 0.072);
}

.seat:not(.reserved, .selected):hover {
  opacity: 0.9;
  transform: scale(1.05);
}

.seat {
  user-select: none;
  color: white;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border-radius: 10px;
  width: 50px;
  height: 50px;
}

.first-class {
  background: rgb(189, 164, 22);
}

.business-class {
  background: rgb(2, 163, 80);
}

.economy-class {
  background: rgb(15 182 255);
}

.selected {
  background: gray;
  opacity: 0.5;
}

.reserved {
  cursor: default;
  background: lightgray;
  opacity: 0.8;
}

.el-row {
  padding-bottom: 10px;
}
</style>
