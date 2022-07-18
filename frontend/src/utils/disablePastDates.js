export default (time) => {
  const today = new Date();
  return (
    time.getTime() <=
    new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - 1
    ).getTime()
  );
};
