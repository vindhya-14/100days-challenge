import { useState } from "react";
import WeatherCard from "../components/WeatherCard";
import { fetchWeatherByCity } from "../services/WeatherService";




const Home = () => {
      const [city,setCity] = useState('');
      const [weather,setWeather] = useState(null);
      const [error,setError] = useState('');

      const handleSearch = async () => {
        if(!city.trim())
        {
           setError('Please enter a city');
           setWeather(null);
           return;
        }

        try{
            const data = await fetchWeatherByCity(city);
            setWeather(data);
            setError('');
        }
        catch{
            setError('City not found');
            setWeather(null);
        }
      };



      return (

          <div>
            <h1>Weather App</h1>
            <div>
                <input 
                 type="text"
                 placeholder="Enter city..."
                 value={city}
                 onChange={(e) => setCity(e.target.value)}
                
                
                />

                <button onClick={handleSearch}>Search</button>
            </div>
            {
                error && <p>{error}</p>
                
            }

            <WeatherCard weather={weather} />
          </div>

      )

}

export default Home;

