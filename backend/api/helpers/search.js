import { tokenize } from "../../utils/index.js";

// helper function
const generateProjection = (include, exclude) => {
  const projection = {};

  if (include) include.forEach((x) => (projection[x] = 1));
  if (exclude) exclude.forEach((x) => (projection[x] = 0));

  return projection;
};

export default function generateSearch(
  query,
  fields,
  match = null,
  include = null,
  exclude = null
) {
  // tokenize query
  const tokens = tokenize(query);

  // regex's to conduct search
  const searches = tokens.flatMap((token) => {
    return fields.map((field) => {
      return { [field]: { $regex: `.*${token}.*`, $options: "i" } };
    });
  });

  // no searches to make
  if (!searches.length) return null;

  // ensure match not null
  match = match ? match : {};

  return {
    query: {
      $or: searches,
      ...match,
    },
    projection: generateProjection(include, exclude),
  };
}
