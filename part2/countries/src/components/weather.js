import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Weather = ({ city }) => {
  //console.log(city)
  const [weatherFor, setWeatherFor] = useState(null);
  const apiKey = process.env.REACT_APP_API_KEY;
  const uri = `http://api.weatherstack.com/current?access_key=${apiKey}&query=${city}`;

  useEffect(() => {
    axios.get(uri).then((response) => {
      console.log('weather retrieved');
      console.log(response.data)
      setWeatherFor(response.data.current);
    });
  }, [uri]);

  return weatherFor ? (
    <>
      <h2>Weather in {city}</h2>
      <b>temperature: </b> {weatherFor['temperature']} Celcius
      <div>
        <img src={weatherFor['weather_icons'][0]} alt={`${city} weather`}></img>
      </div>
      <b>wind:</b> {weatherFor['wind_speed']} mph direction{' '}
      {weatherFor['wind_dir']}
    </>
  ) : (
    <span>Loading weather</span>
  );
};

export default Weather;
