const ELEMENTS = {
    searchForm: document.getElementById('search-form'),
    cityInput: document.getElementById('city-input'),
    searchSuggestions: document.getElementById('search-suggestions'),
    locationBtn: document.getElementById('location-btn'),
    loadingOverlay: document.getElementById('loading-overlay'),
    weatherContent: document.getElementById('weather-content'),

    // Display Elements
    cityName: document.getElementById('city-name'),
    currentTemp: document.getElementById('current-temp'),
    weatherDesc: document.getElementById('weather-desc'),
    currentIcon: document.getElementById('current-icon'),
    humidity: document.getElementById('humidity'),
    windSpeed: document.getElementById('wind-speed'),
    sunrise: document.getElementById('sunrise'),
    sunset: document.getElementById('sunset'),
    forecastContainer: document.getElementById('forecast-container')
};

// Open-Meteo WMO Code Map (Simplified)
const WEATHER_CODES = {
    0: { desc: 'Clear sky', icon: 'bi-sun-fill', color: '#ffc107', img: 'https://cdn-icons-png.flaticon.com/512/6974/6974833.png' },
    1: { desc: 'Mainly clear', icon: 'bi-sun', color: '#ffea61', img: 'https://cdn-icons-png.flaticon.com/512/1163/1163764.png' },
    2: { desc: 'Partly cloudy', icon: 'bi-cloud-sun', color: '#dedede', img: 'https://cdn-icons-png.flaticon.com/512/1163/1163661.png' },
    3: { desc: 'Overcast', icon: 'bi-cloud-fill', color: '#a0a0a0', img: 'https://cdn-icons-png.flaticon.com/512/414/414927.png' },
    45: { desc: 'Fog', icon: 'bi-cloud-haze', color: '#cfcfcf', img: 'https://cdn-icons-png.flaticon.com/512/2676/2676004.png' },
    48: { desc: 'Depositing rime fog', icon: 'bi-cloud-haze', color: '#cfcfcf', img: 'https://cdn-icons-png.flaticon.com/512/2676/2676004.png' },
    51: { desc: 'Light drizzle', icon: 'bi-cloud-drizzle', color: '#4aa3ff', img: 'https://cdn-icons-png.flaticon.com/512/4006/4006133.png' },
    53: { desc: 'Moderate drizzle', icon: 'bi-cloud-drizzle', color: '#4aa3ff', img: 'https://cdn-icons-png.flaticon.com/512/4006/4006133.png' },
    55: { desc: 'Dense drizzle', icon: 'bi-cloud-drizzle', color: '#4aa3ff', img: 'https://cdn-icons-png.flaticon.com/512/4006/4006133.png' },
    61: { desc: 'Slight rain', icon: 'bi-cloud-rain', color: '#4aa3ff', img: 'https://cdn-icons-png.flaticon.com/512/3351/3351979.png' },
    63: { desc: 'Rain', icon: 'bi-cloud-rain-fill', color: '#3178c6', img: 'https://cdn-icons-png.flaticon.com/512/3351/3351979.png' },
    65: { desc: 'Heavy rain', icon: 'bi-cloud-rain-heavy-fill', color: '#1a5496', img: 'https://cdn-icons-png.flaticon.com/512/3351/3351979.png' },
    71: { desc: 'Snow fall', icon: 'bi-snow', color: '#fff', img: 'https://cdn-icons-png.flaticon.com/512/2315/2315309.png' },
    73: { desc: 'Moderate snow', icon: 'bi-snow', color: '#fff', img: 'https://cdn-icons-png.flaticon.com/512/2315/2315309.png' },
    75: { desc: 'Heavy snow', icon: 'bi-snow', color: '#fff', img: 'https://cdn-icons-png.flaticon.com/512/2315/2315309.png' },
    80: { desc: 'Rain showers', icon: 'bi-cloud-rain', color: '#4aa3ff', img: 'https://cdn-icons-png.flaticon.com/512/3351/3351979.png' },
    95: { desc: 'Thunderstorm', icon: 'bi-lightning-charge', color: '#ffd700', img: 'https://cdn-icons-png.flaticon.com/512/3093/3093388.png' },
    96: { desc: 'Thunderstorm with hail', icon: 'bi-lightning-charge-fill', color: '#ffd700', img: 'https://cdn-icons-png.flaticon.com/512/3093/3093388.png' },
};

// Using a fallback image if my specific icon URLs fail or to keep it simple, 
// I'll stick to Bootstrap Icons for small UI and maybe find a nice set for "img" later. 
// For now, I'll use the 'img' property to set src of the hero image if available, 
// or fallback to a generic one.

async function fetchGeocoding(city) {
    try {
        const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=5&language=en&format=json`);
        const data = await response.json();
        return data.results || [];
    } catch (error) {
        console.error("Geocoding error:", error);
        return [];
    }
}

async function fetchWeather(lat, lon, cityNameStr) {
    showLoading(true);
    try {
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,is_day,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=auto`);
        const data = await response.json();

        updateUI(data, cityNameStr);
    } catch (error) {
        console.error("Weather data error:", error);
        alert("Failed to fetch weather data.");
    } finally {
        showLoading(false);
    }
}

function updateUI(data, cityNameStr) {
    if (!data || !data.current || !data.daily) return;

    const current = data.current;
    console.log("Current Weather Code:", current.weather_code); // Debug

    const weatherInfo = WEATHER_CODES[current.weather_code] || { desc: 'Unknown', icon: 'bi-question-circle', color: '#fff' };

    // Update Text
    ELEMENTS.cityName.textContent = cityNameStr;
    ELEMENTS.currentTemp.textContent = Math.round(current.temperature_2m);
    ELEMENTS.weatherDesc.textContent = weatherInfo.desc;
    ELEMENTS.humidity.textContent = `${current.relative_humidity_2m}%`;
    ELEMENTS.windSpeed.textContent = `${current.wind_speed_10m} km/h`;

    // Sunrise/Sunset (using first day)
    if (data.daily.sunrise && data.daily.sunrise.length > 0) {
        ELEMENTS.sunrise.textContent = formatTime(data.daily.sunrise[0]);
    }
    if (data.daily.sunset && data.daily.sunset.length > 0) {
        ELEMENTS.sunset.textContent = formatTime(data.daily.sunset[0]);
    }

    // Hero Icon
    // Ideally we use high-quality 3D icons. For this demo, using the flaticon URLs in the map.
    ELEMENTS.currentIcon.src = weatherInfo.img || 'https://cdn-icons-png.flaticon.com/512/6974/6974833.png';
    ELEMENTS.currentIcon.classList.remove('d-none');

    // Forecast
    renderForecast(data.daily);
}

function renderForecast(daily) {
    ELEMENTS.forecastContainer.innerHTML = '';

    // daily.time is array of dates
    for (let i = 1; i < daily.time.length; i++) { // Start from 1 to skip today
        const code = daily.weather_code[i];
        const info = WEATHER_CODES[code] || { desc: 'Unknown', icon: 'bi-question-circle', color: '#fff' };
        const maxTemp = Math.round(daily.temperature_2m_max[i]);
        const minTemp = Math.round(daily.temperature_2m_min[i]);
        const dateStr = new Date(daily.time[i]).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });

        const item = document.createElement('div');
        item.className = 'forecast-item';
        item.innerHTML = `
            <p class="mb-2 text-white-50 small">${dateStr}</p>
            <i class="bi ${info.icon} fs-2 mb-2" style="color: ${info.color}"></i>
            <p class="mb-0 fw-bold">${maxTemp}° / ${minTemp}°</p>
        `;
        ELEMENTS.forecastContainer.appendChild(item);
    }
}

function formatTime(isoString) {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function showLoading(show) {
    if (show) ELEMENTS.loadingOverlay.classList.remove('d-none');
    else ELEMENTS.loadingOverlay.classList.add('d-none');
}

// Event Listeners
ELEMENTS.searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const city = ELEMENTS.cityInput.value.trim();
    if (!city) return;

    ELEMENTS.searchSuggestions.classList.add('d-none');
    const results = await fetchGeocoding(city);

    if (results.length > 0) {
        const { latitude, longitude, name, country } = results[0];
        fetchWeather(latitude, longitude, `${name}, ${country}`);
    } else {
        alert("City not found!");
    }
});

// Auto-complete (Simple version)
let timeoutId;
ELEMENTS.cityInput.addEventListener('input', () => {
    clearTimeout(timeoutId);
    const query = ELEMENTS.cityInput.value.trim();
    if (query.length < 2) {
        ELEMENTS.searchSuggestions.classList.add('d-none');
        return;
    }

    timeoutId = setTimeout(async () => {
        const results = await fetchGeocoding(query);
        ELEMENTS.searchSuggestions.innerHTML = '';
        if (results.length > 0) {
            results.slice(0, 5).forEach(loc => { // Show top 5
                const li = document.createElement('li');
                li.className = 'list-group-item';
                li.innerHTML = `<i class="bi bi-geo-alt me-2"></i>${loc.name}, <span class="text-white-50 small">${loc.country || ''}</span>`;
                li.onclick = () => {
                    ELEMENTS.cityInput.value = loc.name;
                    ELEMENTS.searchSuggestions.classList.add('d-none');
                    fetchWeather(loc.latitude, loc.longitude, `${loc.name}, ${loc.country}`);
                };
                ELEMENTS.searchSuggestions.appendChild(li);
            });
            ELEMENTS.searchSuggestions.classList.remove('d-none');
        } else {
            ELEMENTS.searchSuggestions.classList.add('d-none');
        }
    }, 300); // Debounce
});

// Close suggestions on click outside
document.addEventListener('click', (e) => {
    if (!ELEMENTS.searchForm.contains(e.target)) {
        ELEMENTS.searchSuggestions.classList.add('d-none');
    }
});

// Geolocation
ELEMENTS.locationBtn.addEventListener('click', () => {
    if (navigator.geolocation) {
        showLoading(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                // To get city name from coords, we'd need reverse geocoding. 
                // Open-Meteo doesn't do reverse geocoding directly for free easily without another API call?
                // Actually, I can just show "My Location" or try to infer it. 
                // I'll stick to displaying coordinates or "Your Location" for now to keep it simple and free.
                fetchWeather(pos.coords.latitude, pos.coords.longitude, "Your Location");
            },
            (err) => {
                showLoading(false);
                alert("Location access denied or unavailable.");
            }
        );
    } else {
        alert("Geolocation is not supported by your browser.");
    }
});

// Init with default city (e.g., London or New York)
window.addEventListener('DOMContentLoaded', () => {
    fetchWeather(40.71, -74.01, "New York, USA");
});
