const WORLD_CITIES = [
  { key: "tehran", timeZone: "Asia/Tehran" },
  { key: "london", timeZone: "Europe/London" },
  { key: "newYork", timeZone: "America/New_York" },
  { key: "tokyo", timeZone: "Asia/Tokyo" },
];

const worldClockTimeElements = {};
const worldClockPeriodElements = {};

WORLD_CITIES.forEach((city) => {
  worldClockTimeElements[city.key] = document.getElementById(`${city.key}Time`);
  worldClockPeriodElements[city.key] = document.getElementById(
    `${city.key}Period`,
  );
});

const timeFormatter = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

function getZonedDate(now, timeZone) {
  return new Date(now.toLocaleString("en-US", { timeZone }));
}

function getDayPeriodIcon(zonedDate) {
  const hour = zonedDate.getHours();
  return hour >= 6 && hour < 18 ? "☀️" : "🌙";
}

function updateWorldClocks(now) {
  WORLD_CITIES.forEach((city) => {
    const zonedDate = getZonedDate(now, city.timeZone);
    worldClockTimeElements[city.key].textContent =
      timeFormatter.format(zonedDate);
    worldClockPeriodElements[city.key].textContent =
      getDayPeriodIcon(zonedDate);
  });
}
