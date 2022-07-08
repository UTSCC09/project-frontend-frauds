// helper function
export const generateProjection = (include, exclude) => {
  const projection = {};

  if (include) include.forEach((x) => (projection[x] = 1));
  if (exclude) exclude.forEach((x) => (projection[x] = 0));

  return projection;
};
