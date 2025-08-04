const formatDateString = (input) => {
  if (!input) return "Invalid Date";

  let timestamp = input;

  // If it's a string that looks like a number, convert it
  if (typeof input === "string" && /^\d+$/.test(input)) {
    timestamp = Number(input);
  }

  // Handle Unix timestamps in seconds (e.g., 10-digit numbers)
  if (typeof timestamp === "number" && timestamp < 1e12) {
    timestamp *= 1000;
  }

  const date = new Date(timestamp);

  // Final validation
  if (isNaN(date.getTime())) return "Invalid Date";

  const options = {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };

  // Format using Intl
  const formatted = new Intl.DateTimeFormat("en-US", options).format(date);

  // Example output: "Sat, Aug 2, 2025, 9:03 AM"
  // Convert to: "SAT-AUG-2-2025 9:03 AM"
  return formatted
    .replace(/,/g, "")
    .toUpperCase()
    .replace(/^(\w+)\s(\w+)\s(\d+)\s(\d+)\s([\d:]+\s[APM]+)/, "$1-$2-$3-$4 $5");
};

export default formatDateString;
