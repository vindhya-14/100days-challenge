import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

export const fetchWeatherByCity = async (city) => {
    const response = await axios.get(`${BASE_URL}/api/weather/${city}`);
    return response.data;
}