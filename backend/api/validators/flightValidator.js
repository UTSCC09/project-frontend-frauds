export default {
  routeId: {
    in: ["body"],
    exists: {
      errorMessage: "routeId is required",
    },
    isString: {
      errorMessage: "routeId should be a string",
    },
  },
  planeId: {
    in: ["body"],
    exists: {
      errorMessage: "planeId is required",
    },
    isString: {
      errorMessage: "planeId should be a string",
    },
  },
  departureTime: {
    in: ["body"],
    exists: {
      errorMessage: "departureTime is required",
    },
    isInt: {
      errorMessage: "departureTime should be a number",
    },
  },
  arrivalTime: {
    in: ["body"],
    exists: {
      errorMessage: "arrivalTime is required",
    },
    isInt: {
      errorMessage: "arrivalTime should be a number",
    },
  },
  duration: {
    in: ["body"],
    exists: {
      errorMessage: "duration is required",
    },
    isInt: {
      errorMessage: "duration should be a number",
    },
  },
  economy: {
    in: ["body.price"],
    exists: {
      errorMessage: "economy price is required",
    },
    isDecimal: {
      errorMessage: "economy should be a number",
    },
  },
  business: {
    in: ["body.price"],
    exists: {
      errorMessage: "business price is required",
    },
    isDecimal: {
      errorMessage: "business price should be a number",
    },
  },
  firstClass: {
    in: ["body.price"],
    exists: {
      errorMessage: "first class price is required",
    },
    isDecimal: {
      errorMessage: "first class price should be a number",
    },
  },
};
