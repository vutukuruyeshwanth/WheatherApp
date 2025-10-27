// --- JAVASCRIPT LOGIC ---

// --- Element Selectors ---
const locationInput = document.getElementById('locationInput');
const submitBtn = document.getElementById('submitBtn');
const weatherInfoContainer = document.getElementById('weather-info');
const hourlyForecastContainer = document.getElementById('hourly-forecast-info');
const forecastInfoContainer = document.getElementById('forecast-info');
const errorMessageContainer = document.getElementById('error-message');
const loader = document.getElementById('loader');
const weatherDisplayGrid = document.getElementById('weather-display-grid'); // <-- ADDED

// --- API Configuration ---
// IMPORTANT: Replace "YOUR_API_KEY" with your actual OpenWeatherMap API key.
const apiKey = "69ff544757dbe2aa26e3c00d45fae6d3";
const currentWeatherApiUrl = "https://api.openweathermap.org/data/2.5/weather";
const forecastApiUrl = "https://api.openweathermap.org/data/2.5/forecast";

// --- Set a default background on page load ---
document.body.className = 'default-bg';

// --- Event Listeners ---
submitBtn.addEventListener('click', handleWeatherRequest);
locationInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        handleWeatherRequest();
    }
});

/**
 * Main function to handle the entire weather request process.
 */
async function handleWeatherRequest() {
    const location = locationInput.value.trim();
    if (!location) {
        showError("Please enter a city name.");
        return;
    }

    loader.style.display = 'block';
    hideError();
    hideWeatherInfo();

    try {
        const currentWeatherData = await fetchCurrentWeatherData(location);
        const { lat, lon } = currentWeatherData.coord;
        const forecastData = await fetchForecastData(lat, lon);
        
        updateBackground(currentWeatherData.weather[0].main);

        displayCurrentWeather(currentWeatherData);
        displayHourlyForecast(forecastData.list, currentWeatherData.timezone);
        displayDailyForecast(forecastData.list, currentWeatherData.timezone);

        weatherDisplayGrid.style.display = 'grid'; // <-- ADDED

    } catch (error) {
        console.error("Error in weather request flow:", error);
        showError(error.message || "Could not fetch weather data. Please check the city name.");
        document.body.className = 'default-bg';
    } finally {
        loader.style.display = 'none';
    }
}

/**
 * Updates the body background based on the weather condition.
 */
function updateBackground(weatherCondition) {
    const body = document.body;
    body.className = ''; // Clear existing classes
    const condition = weatherCondition.toLowerCase();

    switch (condition) {
        case 'clear':
            body.classList.add('sunny');
            break;
        case 'clouds':
            body.classList.add('cloudy');
            break;
        case 'rain':
        case 'drizzle':
            body.classList.add('rainy');
            break;
        case 'thunderstorm':
            body.classList.add('stormy');
            break;
        case 'snow':
            body.classList.add('snowy');
            break;
        case 'mist':
        case 'smoke':
        case 'haze':
        case 'dust':
        case 'fog':
        case 'sand':
        case 'ash':
        case 'squall':
        case 'tornado':
            body.classList.add('misty');
            break;
        default:
            body.classList.add('default-bg');
    }
}

/** Fetches current weather data */
async function fetchCurrentWeatherData(location) {
    const apiUrl = `${currentWeatherApiUrl}?q=${location}&appid=${apiKey}&units=metric`;
    return await fetchApiData(apiUrl, "City not found");
}

/** Fetches 5-day forecast data */
async function fetchForecastData(lat, lon) {
    const apiUrl = `${forecastApiUrl}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    return await fetchApiData(apiUrl, "Could not fetch forecast data");
}

/** Generic function to fetch data and handle errors */
async function fetchApiData(url, notFoundMessage) {
    const response = await fetch(url);
    if (!response.ok) {
        if (response.status === 404) throw new Error(notFoundMessage);
        if (response.status === 401) throw new Error("Invalid API Key. Please check your key.");
        throw new Error(`API error! Status: ${response.status}`);
    }
    return await response.json();
}

/** Displays the current weather data */
function displayCurrentWeather(data) {
    const { name, main, weather, wind, sys, timezone } = data;
    const temperature = Math.round(main.temp);
    const highTemp = Math.round(main.temp_max);
    const lowTemp = Math.round(main.temp_min);
    const description = weather[0].description;
    const iconCode = weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    const feelsLike = Math.round(main.feels_like);
    const humidity = main.humidity;
    const windSpeed = (wind.speed * 3.6).toFixed(1); // m/s to km/h
    const sunriseTime = formatTime(sys.sunrise, timezone);
    const sunsetTime = formatTime(sys.sunset, timezone);
    const currentDate = formatDate(Date.now() / 1000, timezone);

    weatherInfoContainer.innerHTML = `
        <h2 class="city-name">${name}</h2>
        <p class="current-date">${currentDate}</p>
        <img src="${iconUrl}" alt="${description}" class="weather-icon">
        <p class="temperature">${temperature}°C</p>
        <p class="high-low">High: ${highTemp}°C / Low: ${lowTemp}°C</p>
        <p class="description">${description}</p>
        <div class="weather-details">
            <div class="detail-item">
                <span class="detail-label">Feels Like</span>
                <span class="detail-value">${feelsLike}°C</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Humidity</span>
                <span class="detail-value">${humidity}%</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Wind Speed</span>
                <span class="detail-value">${windSpeed} km/h</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Sunrise / Sunset</span>
                <span class="detail-value">${sunriseTime} / ${sunsetTime}</span>
            </div>
        </div>
    `;
    weatherInfoContainer.style.display = 'flex';
}

/** Displays the hourly forecast for the next 24 hours */
function displayHourlyForecast(hourlyData, timezone) {
    const now = Date.now();
    const next24Hours = hourlyData.filter(item => (item.dt * 1000) > now).slice(0, 8);

    const hourlyHtml = next24Hours.map(item => {
        const time = formatTime(item.dt, timezone);
        const iconUrl = `https://openweathermap.org/img/wn/${item.weather[0].icon}.png`;
        const temp = Math.round(item.main.temp);
        return `
            <div class="hourly-item">
                <p class="hour-time">${time}</p>
                <img src="${iconUrl}" alt="${item.weather[0].description}">
                <p class="hour-temp">${temp}°C</p>
            </div>
        `;
    }).join('');

    hourlyForecastContainer.innerHTML = `
        <h3 class="forecast-title">Next 24 Hours</h3>
        <div class="hourly-items">${hourlyHtml}</div>
    `;
    hourlyForecastContainer.style.display = 'block';
}

/**
 * --- UPDATED FUNCTION START ---
 * Processes and displays the daily forecast for the next 5 days, excluding today.
 */
function displayDailyForecast(forecastList, timezone) {
    const dailyData = {};
    const getLocalDate = (dt) => new Date((dt + timezone) * 1000).toISOString().split('T')[0];

    for (const item of forecastList) {
        const date = getLocalDate(item.dt);
        if (!dailyData[date]) {
            dailyData[date] = { temps: [], icons: [] };
        }
        dailyData[date].temps.push(item.main.temp);
        dailyData[date].icons.push(item.weather[0].icon);
    }

    const sortedDates = Object.keys(dailyData).sort();

    // This is the key change: Take the first 5 days from the list.
    const futureDays = sortedDates.slice(0, 5);

    const forecastDaysHTML = futureDays.map(date => {
        const dayData = dailyData[date];
        const dateObj = new Date(date + 'T12:00:00Z');
        const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
        
        const high = Math.round(Math.max(...dayData.temps));
        const low = Math.round(Math.min(...dayData.temps));
        const icon = dayData.icons[Math.floor(dayData.icons.length / 2)] || dayData.icons[0];
        const iconUrl = `https://openweathermap.org/img/wn/${icon}.png`;

        return `
            <div class="forecast-day">
                <p class="day-name">${dayName}</p>
                <img src="${iconUrl}" alt="Weather icon">
                <p class="day-temp">${high}°/${low}°</p>
            </div>
        `;
    }).join('');

    forecastInfoContainer.innerHTML = `
        <h3 class="forecast-title">5-Day Forecast</h3>
        <div class="forecast-days">${forecastDaysHTML}</div>
    `;
    forecastInfoContainer.style.display = 'block';
}
/** --- UPDATED FUNCTION END --- */


/** Displays an error message */
function showError(message) {
    errorMessageContainer.textContent = message;
    errorMessageContainer.style.display = 'block';
    hideWeatherInfo();
}

/** Hides the error message container */
function hideError() {
    errorMessageContainer.style.display = 'none';
}

/** Hides all weather and forecast information */
function hideWeatherInfo() {
    weatherDisplayGrid.style.display = 'none'; // <-- CHANGED
    
    // Also, reset the inner items just in case
    weatherInfoContainer.style.display = 'none';
    hourlyForecastContainer.style.display = 'none';
    forecastInfoContainer.style.display = 'none';
}

/** Formats a UNIX timestamp into local time (e.g., "5:30 PM") */
function formatTime(unixTimestamp, timezoneOffset) {
    const date = new Date((unixTimestamp + timezoneOffset) * 1000);
    return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: 'UTC'
    });
}

/** Formats a UNIX timestamp into a local full date (e.g., "Wednesday, Oct 1") */
function formatDate(unixTimestamp, timezoneOffset) {
    const date = new Date((unixTimestamp + timezoneOffset) * 1000);
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        day: 'numeric',
        month: 'short',
        timeZone: 'UTC'
    });
}
