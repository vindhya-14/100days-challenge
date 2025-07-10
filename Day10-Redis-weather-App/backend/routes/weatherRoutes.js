const express = require('express');
const router = express.Router();
const client = require('../config/redisClient');
const { getWeatherData } = require('../services/weatherService');

router.get('/:city', async (req, res) => {
  const city = req.params.city.trim().toLowerCase();
  const cacheKey = `weather:${city}`;

  try {
    // Try Redis cache
    const cached = await client.get(cacheKey);
    if (cached) {
      console.log(`Serving from cache for city: ${city}`);
      return res.json(JSON.parse(cached));
    }

    // Fetch from WeatherAPI
    const data = await getWeatherData(city);

    if (!data) {
      return res.status(500).json({ error: 'Failed to fetch weather data' });
    }

    // Save to Redis cache for 10 minutes
    await client.set(cacheKey, JSON.stringify(data), { EX: 600 });

    console.log(`Fetched and cached fresh data for city: ${city}`);
    res.json(data);
  } catch (err) {
    console.error(`Error for city "${city}":`, err.message);

    if (err.message === 'City not found') {
      return res.status(404).json({ error: 'City not found' });
    }

    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
