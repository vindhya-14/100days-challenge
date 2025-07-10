const axios = require('axios');
require('dotenv').config();

const API_KEY = process.env.WEATHER_API_KEY;
console.log("API_KEY:", API_KEY);


async function getWeatherData(city) {
  try {
    console.log("Fetching weather for:", city);

    const url = `http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}`;
    console.log("Weather URL:", url);

    const response = await axios.get(url);
    return response.data;

  } catch (error) {
    console.error(`Failed to fetch weather for ${city}:`, error.message);
    return null;
  }
}

module.exports = { getWeatherData };
