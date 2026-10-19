const API_KEY = "0f56aa42cf00ae52a275a208b9e9e272";

// Get the HTML elements
const searchForm = document.getElementById("weather-lookup-form");
const cityInput = document.getElementById("station-input");
const loadingSpinner = document.getElementById("ui-loading-spinner");
const emptyState = document.getElementById("ui-empty-state");
const errorDetail = document.getElementById("error-detail");
const weatherContent = document.getElementById("weather-content");


const cityTitle = document.getElementById("render-station-title");
const weatherDate = document.getElementById("weather-date");
const weatherIcon = document.getElementById("weather-icon");
const temperature = document.getElementById("metric-temp");
const description = document.getElementById("weather-description");
const feelsLike = document.getElementById("feels-like");


const humidity = document.getElementById("metric-humidity");
const windSpeed = document.getElementById("metric-wind");
const pressure = document.getElementById("metric-pressure");
const forecastList = document.getElementById("forecast-list");
const validationError = document.getElementById("validation-error-msg");
const searchButton = document.getElementById("search-button");

// Convert weather conditions into icons
function getWeatherIcon(condition, isNight = false) {
  const weather = condition.toLowerCase();


  if (weather.includes("thunderstorm")) return "⛈️";
  if (weather.includes("drizzle") || weather.includes("rain")) return "🌧️";
  if (weather.includes("snow")) return "❄️";
  if (

     weather.includes("mist") ||
    weather.includes("fog") ||
    weather.includes("haze") ||
    weather.includes("smoke")
  ) {

     return "🌫️";
  }
  if (weather.includes("cloud")) return "☁️";
  if (weather.includes("clear")) return isNight ? "🌙" : "☀️";

  return "🌤️";
}

// Change the background based on current weather
function updateBackground(condition, isNight) {
  document.body.classList.remove(
    "weather-clear",
    "weather-clouds",
    "weather-rain",
    "weather-night",
    "weather-default"
  );

  const weather = condition.toLowerCase();

   if (isNight) {
    document.body.classList.add("weather-night");
  } else if (
    weather.includes("rain") ||
    weather.includes("drizzle") ||
    weather.includes("thunderstorm")
  ) {

    document.body.classList.add("weather-rain");
  } else if (
    weather.includes("cloud") ||
    weather.includes("mist") ||
    weather.includes("fog") ||
    weather.includes("haze")
  ) {

    document.body.classList.add("weather-clouds");
  } else if (weather.includes("clear")) {
    document.body.classList.add("weather-clear");
  } else {
    document.body.classList.add("weather-default");
  }
}

function showError(message) {
  weatherContent.hidden = true;
  emptyState.hidden = false;

  if (errorDetail) {
    errorDetail.textContent = message;
  } else {
    console.error("Missing HTML element: error-detail");
  }
}

// Fetch current weather and forecast
async function getWeather(city) {
  const currentUrl =
    `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;


   const forecastUrl =
    `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;

  const [currentResponse, forecastResponse] = await Promise.all([  

     fetch(currentUrl),
    fetch(forecastUrl)
  ]);


  const currentData = await currentResponse.json();
  const forecastData = await forecastResponse.json();


  if (!currentResponse.ok) {
    throw new Error(currentData.message || "Could not find that city.");
  }



  if (!forecastResponse.ok) {
    throw new Error(forecastData.message || "Could not load the forecast.");
  }


   return { currentData, forecastData };
}


// Display the current weather
function displayCurrentWeather(data) {
  const condition = data.weather[0].main;
  const currentTime = data.dt;
  const isNight =
  currentTime < data.sys.sunrise || currentTime > data.sys.sunset;
  

  cityTitle.textContent = `${data.name}, ${data.sys.country}`;
  weatherDate.textContent = new Date(
    (data.dt + data.timezone) * 1000
  ).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "UTC"
  });

   weatherIcon.textContent = getWeatherIcon(condition, isNight);
  weatherIcon.setAttribute(
    "aria-label",
    data.weather[0].description
  );


  temperature.textContent = `${Math.round(data.main.temp)}°C`;
  description.textContent = data.weather[0].description;
  feelsLike.textContent = `Feels like ${Math.round(data.main.feels_like)}°C`;


  humidity.textContent = `${data.main.humidity}%`;
  windSpeed.textContent = `${data.wind.speed} m/s`;
  pressure.textContent = `${data.main.pressure} hPa`;

  updateBackground(condition, isNight);
}


// Display the 5-day forecast
function displayForecast(data) {
  forecastList.replaceChildren();

  const days = {};

  data.list.forEach((item) => {
    const date = item.dt_txt.split(" ")[0];

if (!days[date]) {
      days[date] = {
        items: [],
        iconItem: item
      };
    }

     days[date].items.push(item);

    // Prefer an entry close to midday for its weather icon
    const hour = Number(item.dt_txt.split(" ")[1].slice(0, 2));
    const currentIconHour = Number(
      days[date].iconItem.dt_txt.split(" ")[1].slice(0, 2)
    );

     if (
      Math.abs(hour - 12) <
      Math.abs(currentIconHour - 12)
    ) {
      days[date].iconItem = item;
    }
  });

  Object.entries(days)
    .slice(0, 5)
    .forEach(([date, day]) => {
      const high = Math.round(
        Math.max(...day.items.map((item) => item.main.temp_max))
      );

      const low = Math.round(
        Math.min(...day.items.map((item) => item.main.temp_min))
      );

      const condition = day.iconItem.weather[0].main;
      const icon = getWeatherIcon(condition);

      const card = document.createElement("article");
      card.className = "forecast-card";

      const dayName = document.createElement("p");
      dayName.className = "forecast-day";
      dayName.textContent = new Date(`${date}T12:00:00`).toLocaleDateString(
        "en-US",
        { weekday: "short", timeZone: "UTC" }
      );

       const iconElement = document.createElement("span");
      iconElement.className = "forecast-icon";
      iconElement.textContent = icon;

        const highLow = document.createElement("strong");
      highLow.textContent = `${high}° / ${low}°`;

       const conditionText = document.createElement("p");
      conditionText.className = "forecast-condition";
      conditionText.textContent = day.iconItem.weather[0].description;


       card.append(dayName, iconElement, highLow, conditionText);
      forecastList.appendChild(card);
    });
}


// Handle a city search
searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const city = cityInput.value.trim();

  validationError.textContent = "";

  if (!city) {
    validationError.textContent = "Please enter a city name.";
    return;
  }


   loadingSpinner.hidden = false;
  emptyState.hidden = true;
  weatherContent.hidden = true;
  searchButton.disabled = true;

   try {
    const { currentData, forecastData } = await getWeather(city);

    displayCurrentWeather(currentData);
    displayForecast(forecastData);


        weatherContent.hidden = false;
  } catch (error) {
    console.error(error);
  showError(
   
       error.message.includes("401")
        ? "Your API key is invalid or not active yet. Check your key and try again."
        : error.message.includes("city not found")
          ? "We couldn't find that city. Check the spelling and try again."
          : error.message
    );

     } finally {
    loadingSpinner.hidden = true;
    searchButton.disabled = false;
  }
});







