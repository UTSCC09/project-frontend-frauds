import constants from "../../constants/index.js";

export default {
  event: {
    in: ["body"],
    exists: {
      errorMessage: "event is required",
    },
    isIn: {
      options: [
        [
          constants.WEBHOOK_EVENT.FLIGHT_BOOKING,
          constants.WEBHOOK_EVENT.FLIGHT_BOOKING_BUSINESS,
          constants.WEBHOOK_EVENT.FLIGHT_BOOKING_ECONOMY,
          constants.WEBHOOK_EVENT.FLIGHT_BOOKING_FIRST_CLASS,
        ],
      ],
      errorMessage: "Please provide a valid event to listen to",
    },
  },
  callbackURL: {
    in: ["body"],
    isURL: {
      errorMessage: "callbackURL must be a valid URL",
    },
    exists: {
      errorMessage: "callbackURL is required",
    },
  },
  id: {
    in: ["params"],
    exists: {
      errorMessage: "flight id must be provided",
    },
    isMongoId: {
      errorMessage: "must provide a valid flight id",
    },
  },
};
