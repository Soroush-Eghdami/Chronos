const weatherStatus = document.getElementById("weatherStatus");
const weatherIcon = document.getElementById("weatherIcon");
const weatherCity = document.getElementById("weatherCity");
const temperature = document.getElementById("temperature");
const weatherDescription = document.getElementById("weatherDescription");
const feelsLike = document.getElementById("feelsLike");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");
const weatherUpdated = document.getElementById("weatherUpdated");
const API_KEY = CONFIG.OPENWEATHER_API_KEY;
const DEFAULT_CITY = "Berlin";

function setWeatherStatus(text, statusClass) {
  weatherStatus.textContent = text;
  weatherStatus.className = `status-badge ${statusClass}`;
}

async function fetchWeather(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Unable to fetch weather.");
  }
  return await response.json();
}

function updateWeather(data) {
  weatherCity.textContent = `📍 ${data.name}`;
  temperature.textContent = `${Math.round(data.main.temp)}°C`;
  weatherDescription.textContent = data.weather[0].description;
  feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;
  humidity.textContent = `${data.main.humidity}%`;
  windSpeed.textContent = `${Math.round(data.wind.speed * 3.6)} km/h`;
  weatherIcon.innerHTML = `
        <img
            src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png"
            alt="${data.weather[0].description}"
        >
    `;
  weatherUpdated.textContent = `Updated ${new Date().toLocaleTimeString()}`;
}

async function loadWeatherByCoordinates(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

  const data = await fetchWeather(url);
  updateWeather(data);
}

async function loadWeatherByCity(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
  const data = await fetchWeather(url);
  updateWeather(data);
}

async function loadWeather() {
  setWeatherStatus("Loading", "status-warning");
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          await loadWeatherByCoordinates(
            position.coords.latitude,
            position.coords.longitude,
          );
          setWeatherStatus("Live", "status-success");
        } catch (error) {
          console.error(error);
          try {
            await loadWeatherByCity(DEFAULT_CITY);
            setWeatherStatus("Live", "status-success");
          } catch (error) {
            console.error(error);
            setWeatherStatus("Offline", "status-error");
          }
        }
      },
      async () => {
        try {
          await loadWeatherByCity(DEFAULT_CITY);
          setWeatherStatus("Live", "status-success");
        } catch (error) {
          console.error(error);
          setWeatherStatus("Offline", "status-error");
        }
      },
    );
  } else {
    try {
      await loadWeatherByCity(DEFAULT_CITY);
      setWeatherStatus("Live", "status-success");
    } catch (error) {
      console.error(error);
      setWeatherStatus("Offline", "status-error");
    }
  }
}

loadWeather();
setInterval(loadWeather, 600000);
