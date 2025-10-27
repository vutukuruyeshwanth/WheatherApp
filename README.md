# WheatherApp

Weather Pro 🌤️

A clean and modern weather application that provides the current weather conditions, a 24-hour hourly forecast, and a 5-day forecast for any city. This app features a dynamic, glassmorphism UI that changes its background to match the current weather.

here is the link of the website: https://vutukuruyeshwanth.github.io/WheatherApp/WeatherApp/

Features

Current Weather: Get up-to-the-minute data for any city, including temperature, "feels like," humidity, wind speed, and sunrise/sunset times.
Dynamic Backgrounds: The app's background gradient smoothly transitions to match the weather (e.g., sunny, rainy, cloudy, snowy).
Hourly Forecast: See an 8-period (24-hour) scrolling forecast to plan your day.
5-Day Forecast: View a 5-day forecast with high and low temperatures and weather icons.
Responsive Design: A two-column layout on desktop that stacks into a single column on mobile devices.
Loading & Error States: Includes a visual loader during API calls and clear error messages for bad requests (e.g., "City not found").

Technologies Used

HTML5: For the core structure and content.
CSS3: For all styling, including the glassmorphism card, dynamic backgrounds, and responsive layout using Flexbox and Grid.
JavaScript (ES6+): For all logic, including:
async/await for handling API requests.
DOM manipulation to dynamically display data.
Date and time formatting based on location timezone.

API

This project uses the OpenWeatherMap API to fetch all weather data.
1.Current Weather API
2.One Call API (for 5-day/hourly forecasts)

Setup

To run this project locally, you need to provide your own OpenWeatherMap API key.

Clone the repository:
git clone https://github.com/your-username/your-repo-name.git

Navigate to the project directory:
cd your-repo-name

Open the script.js file.
Find this line (around line 18):
JavaScript
const apiKey = "69ff544757dbe2aa26e3c00d45fae6d3";
Replace the string with your own API key from OpenWeatherMap.

Open the index.html file in your browser to run the application.
