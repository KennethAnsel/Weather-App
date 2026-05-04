async function fetchWeather() {
  // Step a. Create global variables and start inner functions
  let searchInput = document.getElementById('search').value.trim();
  const weatherDataSection = document.getElementById("weather-data");
  weatherDataSection.style.display = "block";

  const apiKey = "2431f3c411fac169d6503cf50b029ea3"

  if (searchInput == "") {
    weatherDataSection.innerHTML = `
    <div>
      <h2>Empty Input!</h2>
      <p>Please try again with a valid <u>city name</u>.</p>
    </div>
    `;
    return;
  }

  // Step b. Get lat and lon coordinates via Geocoding API
  async function getLonAndLat() {
    const geocodeURL = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(searchInput)}&limit=1&appid=${apiKey}`

    const response = await fetch(geocodeURL);
    if (!response.ok) {
      console.log("Bad response! ", response.status);
      weatherDataSection.innerHTML = `
      <div>
        <h2>Location lookup failed</h2>
        <p>Please check your API key and try again.</p>
      </div>
      `;
      return;
    }

    const data = await response.json();
    if (data.length == 0) {
      console.log("Something went wrong here.");
      weatherDataSection.innerHTML = `
      <div>
        <h2>Invalid Input: "${searchInput}"</h2>
        <p>Please try again with a valid <u>city name</u>.</p>
      </div>
      `;
      return;
    } else {
      return data[0];
    }
  }

  async function getWeatherData(lon, lat) {
    // Step c. Get weather information via Current Weather API
    const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`
    const response = await fetch(weatherURL);

    if (!response.ok) {
      weatherDataSection.innerHTML = `
      <div>
        <h2>Weather lookup failed</h2>
        <p>Please try again in a moment.</p>
      </div>
      `;
      return;
    }

    // Step d. Display the weather data
    const data = await response.json();
    const temperature = Math.round(data.main.temp - 273.15);
    const feelsLike = Math.round(data.main.feels_like - 273.15);
    const minTemp = Math.round(data.main.temp_min - 273.15);
    const maxTemp = Math.round(data.main.temp_max - 273.15);
    const windSpeed = Math.round(data.wind.speed * 3.6);

    weatherDataSection.style.display = "block";
    weatherDataSection.innerHTML = `
      <div id="main-weather">
        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="${data.weather[0].description}" width="100" />
        <div>
          <h2>${data.name}, ${data.sys.country}</h2>
          <p id="temperature">${temperature}&deg;C</p>
          <p>${data.weather[0].description}</p>
        </div>
      </div>

      <div id="weather-details">
        <div class="detail-box">
          <p>Feels Like</p>
          <strong>${feelsLike}&deg;C</strong>
        </div>
        <div class="detail-box">
          <p>Humidity</p>
          <strong>${data.main.humidity}%</strong>
        </div>
        <div class="detail-box">
          <p>Wind</p>
          <strong>${windSpeed} km/h</strong>
        </div>
        <div class="detail-box">
          <p>Pressure</p>
          <strong>${data.main.pressure} hPa</strong>
        </div>
        <div class="detail-box">
          <p>Min Temp</p>
          <strong>${minTemp}&deg;C</strong>
        </div>
        <div class="detail-box">
          <p>Max Temp</p>
          <strong>${maxTemp}&deg;C</strong>
        </div>
      </div>
    `
  }

  // These are part of Step d.
  document.getElementById("search").value = "";
  const geocodeData = await getLonAndLat();
  if (!geocodeData) {
    return;
  }

  await getWeatherData(geocodeData.lon, geocodeData.lat);
}
