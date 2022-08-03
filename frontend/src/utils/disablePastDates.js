// determine which dates occur in the past
export default (date) => {
  // todays date
  const today = new Date();

  // compare time with yesterdays date
  return (
    date.getTime() <=
    new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - 1
    ).getTime()
  );
};
