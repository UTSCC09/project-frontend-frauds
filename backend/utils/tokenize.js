export default function tokenize(text) {
  if (text.length <= 1) return [];

  // tokenize query
  return text
    .trim()
    .split(" ")
    .filter((x) => x.length > 1);
}
