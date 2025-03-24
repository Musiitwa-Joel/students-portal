function formatTimestampToDateWithDay(timestamp) {
  const date = new Date(timestamp); // Convert timestamp to Date object

  const day = String(date.getDate()).padStart(2, "0"); // 08
  const month = String(date.getMonth() + 1).padStart(2, "0"); // 08 (Months are 0-based)
  const year = date.getFullYear(); // 2000

  const hours = date.getHours() % 12 || 12; // Convert to 12-hour format
  const minutes = String(date.getMinutes()).padStart(2, "0"); // 30
  const ampm = date.getHours() >= 12 ? "PM" : "AM"; // AM/PM

  const weekday = date
    .toLocaleString("en-US", { weekday: "short" })
    .toUpperCase(); // MON

  return `${weekday}-${month}-${day}-${year} ${hours}:${minutes} ${ampm}`;
}

export default formatTimestampToDateWithDay;
