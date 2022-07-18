export default {
  query: {
    in: ["body"],
    exists: {
      errorMessage: "query is required",
    },
  },
  include: {
    in: ["body"],
    optional: {
      options: { checkFalsy: true },
    },
    isArray: true,
  },
  exclude: {
    in: ["body"],
    optional: {
      options: { checkFalsy: true },
    },
    isArray: true,
  },
  limit: {
    in: ["query"],
    optional: {
      options: { checkFalsy: true },
    },
    isInt: true,
    toInt: true,
  },
};
