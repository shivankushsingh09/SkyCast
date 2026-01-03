// SkyCast - Weather App JavaScript

const API_BASE = 'https://geocoding-api.open-meteo.com/v1';
const WEATHER_API = 'https://api.open-meteo.com/v1/forecast';

// DOM Elements
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const suggestionsDiv = document.getElementById('suggestions');
const loadingSpinner = document.getElementById('loadingSpinner');
const errorMessage = document.getElementById('errorMessage');
const errorText = document.getElementById('errorText');
const weatherContent = document.getElementById('weatherContent');
const cityName = document.getElementById('cityName');
const currentDate = document.getElementById('currentDate');
const temperature = document.getElementById('temperature');
const weatherIcon = document.getElementById('weatherIcon');
const weatherDescription = document.getElementById('weatherDescription');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');
const pressure = document.getElementById('pressure');
const visibility = document.getElementById('visibility');
const forecastContainer = document.getElementById('forecastContainer');
const refreshBtn = document.getElementById('refreshBtn');

let currentWeatherData = null;
let currentCoordinates = null;

// Weather Icons Mapping
const weatherIcons = {
    'clear': '<i class="fas fa-sun" style="color: #f39c12;"></i>',
    'cloudy': '<i class="fas fa-cloud" style="color: #95a5a6;"></i>',
    'rainy': '<i class="fas fa-cloud-rain" style="color: #3498db;"></i>',
    'thunderstorm': '<i class="fas fa-bolt" style="color: #f39c12;"></i>',
    'snowy': '<i class="fas fa-snowflake" style="color: #3498db;"></i>',
    'fog': '<i class="fas fa-smog" style="color: #bdc3c7;"></i>',
    'windy': '<i class="fas fa-wind" style="color: #1abc9c;"></i>'
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    loadDefaultCity();
});

// Event Listeners
function setupEventListeners() {
    searchForm.addEventListener('submit', handleSearch);
    searchInput.addEventListener('input', handleSearchInput);
    refreshBtn.addEventListener('click', refreshWeather);
    document.addEventListener('click', (e) => {
        if (e.target !== searchInput) {
            suggestionsDiv.classList.remove('show');
        }
    });
}

// Load default city (London) on app start
async function loadDefaultCity() {
    await searchCity('London');
}

// Handle search form submission
async function handleSearch(e) {
    e.preventDefault();
    const city = searchInput.value.trim();
    if (city) {
        await searchCity(city);
        suggestionsDiv.classList.remove('show');
    }
}

// Handle search input for suggestions
async function handleSearchInput(e) {
    const query = e.target.value.trim();
    if (query.length < 2) {
        suggestionsDiv.classList.remove('show');
        return;
    }

    try {
        const response = await fetch(
            `${API_BASE}/search?name=${query}&count=8&language=en&format=json`
        );
        const data = await response.json();

        if (data.results && data.results.length > 0) {
            displaySuggestions(data.results);
            suggestionsDiv.classList.add('show');
        } else {
            suggestionsDiv.classList.remove('show');
        }
    } catch (error) {
        console.error('Error fetching suggestions:', error);
        suggestionsDiv.classList.remove('show');
    }
}

// Display search suggestions
function displaySuggestions(results) {
    suggestionsDiv.innerHTML = '';
    results.forEach(result => {
        const suggestion = document.createElement('div');
        suggestion.className = 'suggestion-item';
        const country = result.country ? `, ${result.country}` : '';
        const admin = result.admin1 ? `, ${result.admin1}` : '';
        suggestion.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${result.name}${admin}${country}`;
        suggestion.addEventListener('click', () => {
            searchInput.value = result.name;
            currentCoordinates = {
                latitude: result.latitude,
                longitude: result.longitude,
                name: result.name,
                country: result.country
            };
            suggestionsDiv.classList.remove('show');
            fetchWeather(result.latitude, result.longitude, result.name);
        });
        suggestionsDiv.appendChild(suggestion);
    });
}

// Search for city
async function searchCity(city) {
    try {
        showLoading(true);
        hideError();

        const response = await fetch(
            `${API_BASE}/search?name=${city}&count=1&language=en&format=json`
        );
        const data = await response.json();

        if (!data.results || data.results.length === 0) {
            showError('City not found. Please try another city.');
            showLoading(false);
            return;
        }

        const result = data.results[0];
        currentCoordinates = {
            latitude: result.latitude,
            longitude: result.longitude,
            name: result.name,
            country: result.country
        };
        searchInput.value = result.name;
        await fetchWeather(result.latitude, result.longitude, result.name);
    } catch (error) {
        console.error('Error searching city:', error);
        showError('Error searching for city. Please try again.');
        showLoading(false);
    }
}

// Fetch weather data
async function fetchWeather(latitude, longitude, cityName) {
    try {
        const response = await fetch(
            `${WEATHER_API}?latitude=${latitude}&longitude=${longitude}` +
            `&current_weather=true` +
            `&hourly=relative_humidity_2m,pressure_msl,visibility,wind_speed_10m,weathercode` +
            `&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max` +
            `&forecast_days=7&timezone=auto`
        );

        if (!response.ok) {
            throw new Error('Failed to fetch weather data');
        }

        const data = await response.json();
        currentWeatherData = { ...data, city: cityName, coords: { latitude, longitude } };
        displayWeather(data, cityName);
        showLoading(false);
    } catch (error) {
        console.error('Error fetching weather:', error);
        let message = 'Failed to fetch weather data. Please try again.';
        if (error instanceof TypeError && error.message.includes('fetch')) {
            message = 'Network error or CORS issue. Please check your internet connection or try a different browser. If you are running this locally, the weather API may block requests from localhost.';
        } else if (error.message && error.message.includes('Failed to fetch')) {
            message = 'Weather API is currently unreachable. This could be due to a network issue, CORS policy, or the API being down.';
        }
        showError(message + '\n\nTips:\n- Check your internet connection.\n- Try running the app from a web server (not just opening the HTML file).\n- If you see a CORS error in the browser console, try a different browser or use a CORS proxy for development.');
        showLoading(false);
    }
}

// Display current weather
function displayWeather(data, cityName) {
    const current = data.current_weather;
    const daily = data.daily;
    const hourly = data.hourly;

    // Find the closest hourly index to current time for extra details
    let now = new Date();
    let hourIndex = 0;
    if (hourly && hourly.time) {
        const nowISO = now.toISOString().slice(0, 13); // YYYY-MM-DDTHH
        hourIndex = hourly.time.findIndex(t => t.startsWith(nowISO));
        if (hourIndex === -1) hourIndex = 0;
    }

    // Update current weather
    const tempCelsius = Math.round(current.temperature);
    temperature.textContent = tempCelsius;
    weatherDescription.textContent = getWeatherDescription(current.weathercode);
    humidity.textContent = hourly && hourly.relative_humidity_2m ? `${hourly.relative_humidity_2m[hourIndex]}%` : '--';
    windSpeed.textContent = hourly && hourly.wind_speed_10m ? `${Math.round(hourly.wind_speed_10m[hourIndex])} km/h` : '--';
    pressure.textContent = hourly && hourly.pressure_msl ? `${Math.round(hourly.pressure_msl[hourIndex])} hPa` : '--';
    visibility.textContent = hourly && hourly.visibility ? `${(hourly.visibility[hourIndex] / 1000).toFixed(1)} km` : '--';

    // Update weather icon
    weatherIcon.innerHTML = getWeatherIcon(current.weathercode);

    // Update city name and date
    cityName.textContent = currentCoordinates.name || cityName;
    currentDate.textContent = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Display forecast
    displayForecast(daily);

    // Show weather content
    weatherContent.style.display = 'block';
}

// Display 7-day forecast
function displayForecast(daily) {
    forecastContainer.innerHTML = '';

    for (let i = 0; i < Math.min(7, daily.time.length); i++) {
        const date = new Date(daily.time[i]);
        const tempMax = Math.round(daily.temperature_2m_max[i]);
        const tempMin = Math.round(daily.temperature_2m_min[i]);
        const weatherCode = daily.weather_code[i];
        const precipitation = daily.precipitation_sum[i];
        const rainProbability = daily.precipitation_probability_max[i];

        const forecastCard = document.createElement('div');
        forecastCard.className = 'forecast-card';
        forecastCard.innerHTML = `
            <div class="forecast-day">${date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
            <div class="forecast-date" style="font-size: 0.85rem; color: #7f8c8d; margin-bottom: 8px;">${date.getDate()}</div>
            <div class="forecast-icon">${getWeatherIcon(weatherCode)}</div>
            <div class="forecast-temp">
                <span class="forecast-temp-high">${tempMax}°</span>
                <span class="forecast-temp-low">${tempMin}°</span>
            </div>
            <div class="forecast-condition">${getWeatherDescription(weatherCode)}</div>
            ${precipitation > 0 || rainProbability > 0 ? `
                <div class="forecast-rain">
                    <i class="fas fa-droplet"></i> ${rainProbability}% • ${precipitation.toFixed(1)}mm
                </div>
            ` : ''}
        `;
        forecastContainer.appendChild(forecastCard);
    }
}

// Get weather description based on WMO code
function getWeatherDescription(code) {
    const descriptions = {
        0: 'Clear',
        1: 'Partly Cloudy',
        2: 'Partly Cloudy',
        3: 'Overcast',
        45: 'Foggy',
        48: 'Foggy',
        51: 'Light Drizzle',
        53: 'Moderate Drizzle',
        55: 'Dense Drizzle',
        61: 'Slight Rain',
        63: 'Moderate Rain',
        65: 'Heavy Rain',
        71: 'Slight Snow',
        73: 'Moderate Snow',
        75: 'Heavy Snow',
        77: 'Snow Grains',
        80: 'Slight Rain Showers',
        81: 'Moderate Rain Showers',
        82: 'Violent Rain Showers',
        85: 'Slight Snow Showers',
        86: 'Heavy Snow Showers',
        95: 'Thunderstorm',
        96: 'Thunderstorm with Hail',
        99: 'Thunderstorm with Hail'
    };
    return descriptions[code] || 'Unknown';
}

// Get weather icon based on WMO code
function getWeatherIcon(code) {
    if (code === 0) {
        return '<i class="fas fa-sun" style="color: #f39c12;"></i>';
    } else if (code === 1 || code === 2) {
        return '<i class="fas fa-cloud-sun" style="color: #f39c12;"></i>';
    } else if (code === 3) {
        return '<i class="fas fa-cloud" style="color: #95a5a6;"></i>';
    } else if (code === 45 || code === 48) {
        return '<i class="fas fa-smog" style="color: #bdc3c7;"></i>';
    } else if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) {
        return '<i class="fas fa-cloud-rain" style="color: #3498db;"></i>';
    } else if (code >= 71 && code <= 86) {
        return '<i class="fas fa-snowflake" style="color: #3498db;"></i>';
    } else if (code >= 95) {
        return '<i class="fas fa-bolt" style="color: #f39c12;"></i>';
    }
    return '<i class="fas fa-cloud" style="color: #95a5a6;"></i>';
}

// Refresh current weather
async function refreshWeather() {
    if (currentCoordinates) {
        refreshBtn.classList.add('loading');
        await fetchWeather(
            currentCoordinates.latitude,
            currentCoordinates.longitude,
            currentCoordinates.name
        );
        refreshBtn.classList.remove('loading');
    }
}

// UI Helper Functions
function showLoading(show) {
    loadingSpinner.style.display = show ? 'block' : 'none';
}

function showError(message) {
    errorText.textContent = message;
    errorMessage.style.display = 'block';
    weatherContent.style.display = 'none';
}

function hideError() {
    errorMessage.style.display = 'none';
}