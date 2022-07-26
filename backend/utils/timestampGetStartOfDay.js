export default (timestampSeconds) => {
  const date = new Date(timestampSeconds * 1000);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() / 1000;
};
