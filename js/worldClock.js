const worldClockElements = {
  tehran: document.getElementById("tehranTime"),
  london: document.getElementById("londonTime"),
  newYork: document.getElementById("newYorkTime"),
  tokyo: document.getElementById("tokyoTime"),
};

const timeFormatter = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

function formatWorldTime(now, timeZone) {
  return timeFormatter.format(
    new Date(now.toLocaleString("en-US", { timeZone })),
  );
}

function updateWorldClocks(now) {
  worldClockElements.tehran.textContent = formatWorldTime(now, "Asia/Tehran");
  worldClockElements.london.textContent = formatWorldTime(now, "Europe/London");
  worldClockElements.newYork.textContent = formatWorldTime(
    now,
    "America/New_York",
  );
  worldClockElements.tokyo.textContent = formatWorldTime(now, "Asia/Tokyo");
}
