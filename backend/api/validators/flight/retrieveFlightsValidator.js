export default {
  departureDate: {
    in: ["query"],
    isInt: true,
    toInt: true,
  },
  sourceAirport: {
    in: ["query"],
  },
  destAirport: {
    in: ["query"],
  },
};
