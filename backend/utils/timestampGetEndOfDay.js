// rounding dates: https://stackoverflow.com/questions/221294/how-do-you-get-a-timestamp-in-javascript
export default (timestampSeconds) => {
  const date = new Date(timestampSeconds * 1000);
  return (
    new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() + 1
    ).getTime() /
      1000 -
    1
  );
};
