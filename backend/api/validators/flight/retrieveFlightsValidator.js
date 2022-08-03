export default {
  departureDate: {
    in: ["query"],
    exists: true,
    isInt: true,
    toInt: true,
  },
  sourceAirport: {
    in: ["query"],
    exists: true,
  },
  destAirport: {
    in: ["query"],
    exists: true,
  },
  limit: {
    in: ["query"],
    optional: {
      options: { checkFalsy: true },
    },
    isInt: true,
    toInt: true,
  },
  page: {
    in: ["query"],
    optional: {
      options: { checkFalsy: true },
    },
    isInt: true,
    toInt: true,
  },
};
