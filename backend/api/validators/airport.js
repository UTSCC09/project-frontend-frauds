export const searchSchema = {
  query: {
    in: ["body"],
    exists: {
      errorMessage: "query is required",
    },
  },
  fields: {
    in: ["body"],
    exists: {
      errorMessage: "fields is required",
    },
    isArray: {
      errorMessage: "fields has to be an array",
    },
  },
};
