export const searchSchema = {
  query: {
    in: ["body"],
    exists: {
      errorMessage: "query is required",
    },
  },
};
