const converToTimeWithAmPm = (timeInMs: number) => {
  return new Date(timeInMs)
    .toLocaleTimeString("en-GB", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    .toUpperCase();
};

export default converToTimeWithAmPm;
