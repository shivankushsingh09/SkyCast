document.addEventListener('DOMContentLoaded', () => {
    const cityInput = document.getElementById('cityInput');
    const searchBtn = document.getElementById('searchBtn');
    const weatherContainer = document.getElementById('weatherContainer');
    const loadingState = document.getElementById('loadingState');
    const welcomeState = document.getElementById('welcomeState');

    // WMO Weather Codes Mapping
    const weatherCodes = {
        0: { desc: 'Clear Sky', icon: 'fa-sun' },
        1: { desc: 'Mainly Clear', icon: 'fa-cloud-sun' },
        2: { desc: 'Partly Cloudy', icon: 'fa-cloud-sun' },
        3: { desc: 'Overcast', icon: 'fa-cloud' },
        45: { desc: 'Fog', icon: 'fa-smog' },
        48: { desc: 'Depositing Rime Fog', icon: 'fa-smog' },
        51: { desc: 'Light Drizzle', icon: 'fa-cloud-rain' },
        53: { desc: 'Moderate Drizzle', icon: 'fa-cloud-rain' },
        55: { desc: 'Dense Drizzle', icon: 'fa-cloud-rain' },
        61: { desc: 'Slight Rain', icon: 'fa-cloud-showers-heavy' },
        63: { desc: 'Moderate Rain', icon: 'fa-cloud-showers-heavy' },
        65: { desc: 'Heavy Rain', icon: 'fa-cloud-showers-heavy' },
        71: { desc: 'Slight Snow', icon: 'fa-snowflake' },
        73: { desc: 'Moderate Snow', icon: 'fa-snowflake' },
        75: { desc: 'Heavy Snow', icon: 'fa-snowflake' },
        80: { desc: 'Slight Rain Showers', icon: 'fa-cloud-rain' },
        81: { desc: 'Moderate Rain Showers', icon: 'fa-cloud-rain' },
        82: { desc: 'Violent Rain Showers', icon: 'fa-cloud-showers-heavy' },
        95: { desc: 'Thunderstorm', icon: 'fa-bolt' },
        96: { desc: 'Thunderstorm with Hail', icon: 'fa-bolt' },
        99: { desc: 'Heavy Thunderstorm with Hail', icon: 'fa-bolt' }
    };

    searchBtn.addEventListener('click', handleSearch);
    cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });

    async function handleSearch() {
        const city = cityInput.value.trim();
        if (!city) return;

        showLoading();

        try {
            // 1. Geocoding
            const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`);
            const geoData = await geoRes.json();

            if (!geoData.results || geoData.results.length === 0) {
                alert('City not found!');
                resetUI();
                return;
            }

            const { latitude, longitude, name, country } = geoData.results[0];

            // 2. Weather Data
            const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,is_day`);
            const weatherData = await weatherRes.json();

            updateUI(name, country, weatherData.current);
        } catch (error) {
            console.error('Error fetching data:', error);
            alert('Something went wrong. Please try again.');
            resetUI();
        }
    }

    function updateUI(city, country, data) {
        // Hide loader / welcome
        loadingState.classList.add('d-none');
        welcomeState.classList.add('d-none');
        weatherContainer.style.display = 'block';

        // Update Text
        document.getElementById('cityName').textContent = `${city}, ${country}`;

        const now = new Date();
        const options = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' };
        document.getElementById('currentDate').textContent = now.toLocaleDateString('en-US', options);

        document.getElementById('temperature').textContent = Math.round(data.temperature_2m);
        document.getElementById('windSpeed').textContent = `${data.wind_speed_10m} km/h`;
        document.getElementById('humidity').textContent = `${data.relative_humidity_2m}%`;

        // Update Icon & Desc
        const code = data.weather_code;
        const info = weatherCodes[code] || { desc: 'Unknown', icon: 'fa-question' };

        document.getElementById('weatherDesc').textContent = info.desc;

        const iconEl = document.getElementById('weatherIcon');
        iconEl.className = `fa-solid ${info.icon} fa-4x`;

        // Day/Night adjust (optional visual tweak)
        if (data.is_day === 0) {
            iconEl.style.color = '#a6c0fe'; // Moon-ish color
        } else {
            iconEl.style.color = '#ffd700'; // Sun color
        }
    }

    function showLoading() {
        welcomeState.classList.add('d-none');
        weatherContainer.style.display = 'none';
        loadingState.classList.remove('d-none');
    }

    function resetUI() {
        loadingState.classList.add('d-none');
        welcomeState.classList.remove('d-none');
        weatherContainer.style.display = 'none';
    }
});
