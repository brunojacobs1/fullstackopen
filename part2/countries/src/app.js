import React, { useState, useEffect } from "react";
import Filter from "./components/filter";
import Countries from "./components/countries";
import axios from "axios";

const App = () => {
  const [countries, setCountries] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    axios.get("https://restcountries.eu/rest/v2/all").then((response) => {
      setCountries(response.data.map((c) => ({ ...c, show: false })));
      console.log('countries retrieved')
    });
  }, []);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };
  const handleClick = (country) => {
    const index = countries.findIndex((c) => c.name === country.name);
    const newCountries = [...countries];
    newCountries[index] = {
      ...newCountries[index],
      show: !newCountries[index].show,
    };
    setCountries(newCountries);
  };

  return (
    <div>
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <Countries
        countries={countries}
        filter={filter}
        handleClick={handleClick}
      />
    </div>
  );
};

export default App;
