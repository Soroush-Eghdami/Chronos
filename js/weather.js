const weatherStatus = document.getElementById("weatherStatus");
const weatherIcon = document.getElementById("weatherIcon");
const temperature = document.getElementById("temperature");
const weatherDescription = document.getElementById("weatherDescription");
const feelsLike = document.getElementById("feelsLike");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");
const WEATHER_API_KEY = CONFIG.OPENWEATHER_API_KEY;
const weatherCity =
    document.getElementById("weatherCity");
const CITY = "Tehran";
const weatherUpdated =
    document.getElementById("weatherUpdated");

const WEATHER_URL =
`https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${WEATHER_API_KEY}&units=metric`;

async function loadWeather(){
    try{
        weatherStatus.textContent="Loading";
        const response = await fetch(WEATHER_URL);
        if(!response.ok){
            throw new Error("Unable to load weather");
        }
        const data = await response.json();
        updateWeather(data);
        weatherStatus.textContent="Live";
        weatherStatus.className="status-badge status-running";
    }

    catch(error){
        weatherStatus.textContent="Offline";
        weatherStatus.className="status-badge status-paused";
        console.error(error);
    }
}

function updateWeather(data){
    temperature.textContent =
        `${Math.round(data.main.temp)}°C`;

    weatherDescription.textContent =
        data.weather[0].description;

    feelsLike.textContent =
        `${Math.round(data.main.feels_like)}°C`;

    humidity.textContent =
        `${data.main.humidity}%`;

    windSpeed.textContent =
        `${Math.round(data.wind.speed * 3.6)} km/h`;

    weatherIcon.textContent =
        getWeatherIcon(data.weather[0].main);

    weatherCity.textContent =
        `📍 ${data.name}`;
    
}

function getWeatherIcon(condition){
    switch(condition){
        case "Clear":
           return "☀️";
        case "Clouds":
           return "☁️";
        case "Rain":
            return "🌧️";
        case "Thunderstorm":
            return "⛈️";
        case "Snow":
            return "❄️";
        case "Mist":
        case "Fog":
            return "🌫️";
        default:
            return "⛅";
    }
}

loadWeather();
setInterval(loadWeather,600000);