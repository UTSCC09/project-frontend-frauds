import { WebhookEvent } from "../../constants/index.js";

export default {
  event: {
    in: ["body"],
    exists: {
      errorMessage: "event is required",
    },
    isIn: {
      options: [["FLIGHT_BOOKING"]],
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
  },
};
