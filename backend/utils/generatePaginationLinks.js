export default (baseUrl, page, limit, total) => {
  const url = new URL(baseUrl);

  // self link
  url.searchParams.set("page", page);
  url.searchParams.set("limit", limit);
  const self = url.toString();

  // first link
  url.searchParams.set("page", 0);
  url.searchParams.set("limit", limit);
  const first = url.toString();

  // prev link
  url.searchParams.set("page", Math.max(0, page - 1));
  url.searchParams.set("limit", limit);
  const prev = url.toString();

  // next link
  url.searchParams.set("page", Math.min(Math.floor(total / limit), page + 1));
  url.searchParams.set("limit", limit);
  const next = url.toString();

  // next link
  url.searchParams.set("page", Math.floor(total / limit));
  url.searchParams.set("limit", limit);
  const last = url.toString();

  return { self, first, prev, next, last };
};
