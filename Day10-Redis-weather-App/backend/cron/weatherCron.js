const cron = require('node-cron');
const client = require('../config/redisClient');
const { getWeatherData } = require('../services/weatherService');

const popularCities = [
  "Delhi",
  "Mumbai",
  "Bengaluru",
  "Chennai",
  "Kolkata",
  "Hyderabad",
  "Pune",
  "Ahmedabad",
  "Jaipur",
  "Lucknow"
];

// Run every 10 minutes
cron.schedule('*/10 * * * *', async () => {
  console.log("Running weather cron job...");
  
  for (const city of popularCities) {
    try {
      const data = await getWeatherData(city);
      await client.set(`weather:${city.toLowerCase()}`, JSON.stringify(data), { EX: 600 });
      console.log(`Cached weather for ${city}`);
    } catch (e) {
      console.error(`Failed to cache weather for ${city}:`, e.message);
    }
  }
});
