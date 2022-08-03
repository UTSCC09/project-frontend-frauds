// converts seconds to H M format (ex. 7H 45M)
export default (seconds) => {
  return `${Math.floor(seconds / 3600)}H ${Math.floor(
    (seconds / 3600 - Math.floor(seconds / 3600)) * 60
  )}M`;
};
