const express = require('express');
const cors = require('cors');
const weatherRoutes = require('./routes/weatherRoutes');
require('dotenv').config();
require('./cron/weatherCron'); 
const app = express();
app.use(express.json());
app.use(cors());
app.use('/api/weather', weatherRoutes);

module.exports = app;
