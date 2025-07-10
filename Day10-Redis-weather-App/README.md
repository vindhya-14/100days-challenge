# 🌤️ Redis Weather App

A full-stack weather application built using **Node.js**, **Express**, **Redis**, and **React**. This app fetches weather data from the [WeatherAPI.com](https://www.weatherapi.com/) and caches responses in **Redis** for faster subsequent loads and better performance.



## 🚀 Features

- 🌐 Search current weather by **city name**
- ⚡ Instant weather data retrieval via **Redis caching**
- 🕒 Weather updates for popular cities every 10 minutes using **cron jobs**
- 📦 Backend API using **Express**
- 🧠 Smart cache keying using coordinates
- 🖼️ Beautiful frontend with live temperature, condition, and icons


## 🛠️ Tech Stack

| Frontend | Backend | Caching | API |
|----------|---------|---------|-----|
| React    | Node.js | Redis   | WeatherAPI.com |
| Axios    | Express | node-cron | REST API |
