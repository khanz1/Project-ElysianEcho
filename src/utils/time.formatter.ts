export function getTimeMessage(date: Date): string {
  const timeFormatter = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const formattedTime = timeFormatter.format(date);

  // Replace the colon with a dot to match the desired "HH.mm" format
  return formattedTime.replace(":", ".");
}
