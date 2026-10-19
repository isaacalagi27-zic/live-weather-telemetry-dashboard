# Live Weather Telemetry Dashboard

A responsive weather dashboard built with HTML, CSS, and JavaScript. It uses the OpenWeatherMap API to display current weather conditions and a five-day forecast for cities around the world.

## Features

- Search for weather by city name
- Current temperature and feels-like temperature
- Weather conditions and dynamic icons
- Humidity, wind speed, and atmospheric pressure
- Five-day weather forecast
- Loading indicator and error handling
- Responsive layout for desktop and mobile screens
- Weather-based background styling

## Technologies Used

- HTML5
- CSS3 (Flexbox and responsive media queries)
- JavaScript
- Fetch API and async/await
- OpenWeatherMap API

## How to Run

1. Clone or download this repository.
2. Open `weather-dashboard/index.html` in a browser, or use a local web server.
3. Add your own OpenWeatherMap API key in the JavaScript configuration before testing.

**Security note:** Never commit a real API key to a public repository. A production deployment should retrieve weather data through a server-side proxy that protects the key.

## Project Structure

```text
live-weather-telemetry-dashboard/
├── README.md
└── weather-dashboard/
    ├── index.html
    ├── styles.css
    └── dashboard.js
```

## Weather Data

Weather information is provided by OpenWeatherMap. Forecasts are estimates and may change.

## Author

Isaac Alagi