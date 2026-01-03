# SkyCast - Weather App

A beautiful, responsive weather application built with HTML, CSS, JavaScript, and Bootstrap. Get real-time weather information and a 7-day forecast for any city in the world.

## 🌟 Features

- **Real-Time Weather Data** - Get current temperature, humidity, wind speed, pressure, and visibility
- **7-Day Forecast** - View detailed weather predictions for the next 7 days
- **City Search** - Search for any city worldwide with auto-suggestions
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- **Beautiful UI** - Modern gradient design with smooth animations
- **No API Key Required** - Uses Open-Meteo free weather API
- **Accurate Data** - Powered by Open-Meteo meteorological data

## 📱 Supported Features

### Current Weather Display
- Temperature (in Celsius)
- Weather condition with descriptive icons
- Humidity percentage
- Wind speed
- Atmospheric pressure
- Visibility distance

### Forecast Information
- 7-day weather outlook
- High and low temperatures for each day
- Weather conditions with icons
- Precipitation probability and amount
- Auto-updated timezone

## 🛠️ Technologies Used

- **HTML5** - Semantic markup structure
- **CSS3** - Advanced styling with animations and gradients
- **JavaScript (ES6+)** - Dynamic functionality and API integration
- **Bootstrap 5** - Responsive grid system and components
- **Font Awesome 6** - Weather and UI icons
- **Open-Meteo API** - Free weather data provider

## 📦 Installation

1. Clone or download this repository
2. Open `index.html` in your web browser
3. No installation or API key needed!

```bash
# Simple way - just open the file
start index.html
```

## 🚀 Usage

1. **Search for a City**
   - Type a city name in the search box
   - Select from the suggestions that appear
   - Click "Search" or press Enter

2. **View Weather**
   - Current weather card shows all detailed information
   - Forecast cards display the next 7 days
   - Click refresh button to update weather data

3. **Auto-Suggestions**
   - Start typing a city name
   - Suggestions appear automatically
   - Click a suggestion to load that city's weather

## 🎨 UI Components

### Navigation Bar
- App logo and branding
- Clean, dark navigation header

### Search Section
- Rounded search input with suggestions
- Live city suggestions as you type
- Search button with icon

### Current Weather Card
- Large temperature display
- Weather condition description
- 4-column detail grid (Humidity, Wind, Pressure, Visibility)
- Weather icon representation
- Refresh button

### Forecast Cards
- 7 individual forecast cards
- Temperature highs and lows
- Weather condition icons
- Precipitation probability
- Responsive grid layout

## 📊 Weather Codes (WMO)

The app uses WMO (World Meteorological Organization) weather codes:
- **0**: Clear sky
- **1-3**: Mostly to overcast clouds
- **45, 48**: Foggy
- **51-67**: Drizzle and rain
- **71-86**: Snow
- **80-82**: Rain showers
- **95-99**: Thunderstorms

## 🌐 API Information

**Weather Data API**: Open-Meteo
- Base URL: `https://api.open-meteo.com/v1/forecast`
- Geocoding API: `https://geocoding-api.open-meteo.com/v1/search`
- Free tier with no API key required
- Accurate meteorological data
- Supports 7-day forecasts

## 💡 How It Works

1. User enters a city name
2. App queries the geocoding API to get coordinates
3. Weather API is called with the coordinates
4. Current weather and forecast data is displayed
5. Icons and descriptions are mapped based on weather codes
6. Data refreshes when the refresh button is clicked

## 📱 Responsive Breakpoints

- **Desktop**: Full layout with 7-column forecast grid
- **Tablet**: Adjusted spacing and 3-column forecast grid
- **Mobile**: Optimized for small screens with 2-column forecast grid

## 🎯 Default Location

- The app loads with **London** as the default city on startup
- You can immediately search for any other city

## 🔄 Auto-Refresh

- Click the refresh icon (↻) on the weather card to update the current weather
- The app automatically handles timezone conversion for each location

## 📝 File Structure

```
SkyCast/
├── index.html           # Main HTML file
├── assets/
│   ├── css/
│   │   └── main.css    # Custom styling and animations
│   └── js/
│       └── main.js     # Core functionality and API integration
├── README.md           # Project documentation
├── License.md          # License information
└── .gitignore          # Git ignore file
```

## 🎓 Learning Resources

- [Bootstrap Documentation](https://getbootstrap.com/docs)
- [Open-Meteo API](https://open-meteo.com/)
- [Font Awesome Icons](https://fontawesome.com/)
- [MDN Web Docs](https://developer.mozilla.org/)

## 📄 License

This project is open source. See [License.md](License.md) for more information.

## 🤝 Contributing

Feel free to fork this project and submit pull requests for any improvements.

## 🐛 Troubleshooting

### Weather not loading?
- Check your internet connection
- Ensure the city name is spelled correctly
- Try the default London example first

### Suggestions not showing?
- Type at least 2 characters in the search box
- Wait a moment for the API to respond

### Styling looks broken?
- Clear browser cache (Ctrl+Shift+Delete)
- Check if Bootstrap CDN is loading

## 💬 Support

For issues or suggestions, please open an issue in the repository.

## ✨ Features Coming Soon

- Temperature unit toggle (°C / °F)
- Weather alerts
- Historical weather data
- Air quality index
- UV index
- Sunrise/Sunset times
- Multiple language support
- Favorites/Saved cities
- PWA support for offline access

---

**Made with ❤️ by SkyCast Development Team**

Last Updated: January 2026
