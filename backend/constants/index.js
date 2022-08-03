export default {
  // constants for webhook events
  WEBHOOK_EVENT: {
    FLIGHT_BOOKING: "FLIGHT_BOOKING",
    FLIGHT_BOOKING_ECONOMY: "FLIGHT_BOOKING_ECONOMY",
    FLIGHT_BOOKING_BUSINESS: "FLIGHT_BOOKING_BUSINESS",
    FLIGHT_BOOKING_FIRST_CLASS: "FLIGHT_BOOKING_FIRST_CLASS",
  },
  // constants for queue job names
  QUEUE_JOB: {
    EVENT: "eventJob",
    WEBHOOK: "webhookJob",
  },

  // constants for flight (seat) class levels
  FLIGHT_CLASS: {
    FIRST_CLASS: 1,
    BUSINESS: 2,
    ECONOMY: 3,
  },
};
