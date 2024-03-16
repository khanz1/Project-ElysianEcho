export const chatDateFormatter = (date: Date) => {
  // Extract hours and minutes
  const hours = date.getHours();
  const minutes = date.getMinutes();

  // Format the result
  const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;

  return formattedTime;
};
