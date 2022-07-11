export default {
  query: {
    in: ["body"],
    exists: {
      errorMessage: "query is required",
    },
  },
};
