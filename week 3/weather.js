
const API_KEY = "YOUR_OPENWEATHERMAP_API_KEY";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const condition = document.getElementById("condition");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");

const errorMessage = document.getElementById("errorMessage");

// Fetch weather data
async function getWeather(city) {

    if (!city.trim()) {
        errorMessage.textContent = "Please enter a city name";
        return;
    }

    try {

        errorMessage.textContent = "Loading...";
        searchBtn.disabled = true;

        const URL = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;

        const response = await fetch(URL);

        if (!response.ok) {
            throw new Error(
                response.status === 404
                    ? "City not found!"
                    : response.status === 401
                    ? "Invalid API key!"
                    : "Unable to fetch weather data"
            );
        }

        const data = await response.json();

        cityName.textContent = data.name;

        temperature.textContent =
            Math.round(data.main.temp);

        condition.textContent =
            data.weather[0].description;

        humidity.textContent =
            data.main.humidity + "%";

        windSpeed.textContent =
            data.wind.speed + " m/s";

        errorMessage.textContent = "";

    }

    catch (error) {

        errorMessage.textContent = error.message;

    }

    finally {

        searchBtn.disabled = false;

    }
}

searchBtn.addEventListener("click", function() {

    getWeather(cityInput.value);

});

cityInput.addEventListener("keydown", function(e) {

    if (e.key === "Enter") {
        getWeather(cityInput.value);
    }

});
