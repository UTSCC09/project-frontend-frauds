export default {
  userId: {
    in: ["body"],
    exists: {
      errorMessage: "userId is required",
    },
    isString: {
      errorMessage: "userId should be a string",
    },
  },
  flightId: {
    in: ["body.departureFlight"],
    exists: {
      errorMessage: "flightId is required",
    },
    isString: {
      errorMessage: "flightId should be a string",
    },
  },
  class: {
    in: ["body.departureFlight"],
    isIn: [1, 2, 3],
    isInt: {
      errorMessage: "class should be a integer",
    },
    exists: {
      errorMessage: "class is required",
    },
  },
  classDescription: {
    in: ["body.departureFlight"],
    isIn: ["First Class", "Business", "Economy"],
    isString: {
      errorMessage: "classDescription should be a string",
    },
    exists: {
      errorMessage: "classDescription is required",
    },
  },
  x: {
    in: ["body.departureFlight"],
    isInt: {
      errorMessage: "x should be an integer",
    },
    exists: {
      errorMessage: "x is required",
    },
  },
  y: {
    in: ["body.departureFlight"],
    isInt: {
      errorMessage: "y should be an integer",
    },
    exists: {
      errorMessage: "y is required",
    },
  },
  roundtrip: {
    in: ["body"],
    isBoolean: {
      errorMessage: "roundtrip should be a boolean",
    },
    exists: {
      errorMessage: "roundtrip is required",
    },
  },
  cost: {
    in: ["body"],
    isDecimal: {
      errorMessage: "cost should be a decimal",
      options: { decimal_digits: "0,2" },
    },
    exists: {
      errorMessage: "roundtrip is required",
    },
  },
  taxRate: {
    in: ["body"],
    isDecimal: {
      errorMessage: "tax rate should be a decimal",
      options: { decimal_digits: "0,2" },
    },
    exists: {
      errorMessage: "tax rate is required",
    },
  },
  totalPaid: {
    in: ["body"],
    isDecimal: {
      errorMessage: "total paid should be a decimal",
      options: { decimal_digits: "0,2" },
    },
    exists: {
      errorMessage: "total paid is required",
    },
  },
  currency: {
    in: ["body"],
    isString: {
      errorMessage: "currency should be a string",
    },
    exists: {
      errorMessage: "currency is required",
    },
  },
};
