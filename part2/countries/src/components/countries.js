import React from 'react';
import Weather from './weather';

const mapLanguages = ({ name, iso639_2 }) => (
  <Language key={iso639_2} name={name} />
);

const Language = ({ name }) => <li>{name}</li>;
const Country = ({ country, handleClick, show }) => {
  return !show ? (
    <li>
      {country.name} <button onClick={() => handleClick(country)}>show</button>
    </li>
  ) : (
    <OneCountry country={country} handleClick={() => handleClick(country)} />
  );
};

const OneCountry = ({ country, handleClick }) => (
  <>
    <h1>{country.name}</h1> <button onClick={handleClick}>show </button>
    <p>capital {country.capital}</p>
    <p>population {country.population}</p>
    <h2>Languages</h2>
    <ul>{country.languages.map(mapLanguages)}</ul>
    <img
      src={country.flag}
      alt={`${country.name} flag`}
      width="200"
      height="100"
    ></img>
    <Weather city={country.capital}/>
  </>
);
const Countries = ({ countries, filter, handleClick }) => {
  if (filter.length > 0) {
    const queryMatch = countries.filter((c) =>
      c.name.toLowerCase().includes(filter.toLowerCase())
    );
    if (queryMatch.length > 10) {
      return <p>Too many matches, specify another filter</p>;
    } else if (queryMatch.length > 1) {
      return (
        <ul>
          {queryMatch.map((c) => (
            <Country
              key={c.numericCode}
              country={c}
              handleClick={handleClick}
              show={c.show}
            />
          ))}
        </ul>
      );
    } else if (queryMatch.length === 1) {
      return !queryMatch[0].show ? (
        <OneCountry
          country={queryMatch[0]}
          handleClick={() => handleClick(queryMatch[0])}
        />
      ) : (
        <>
          <h1>{queryMatch[0].name}</h1>
          <button onClick={() => handleClick(queryMatch[0])}>show </button>
        </>
      );
    } else {
      return <p>No matches :c</p>;
    }
  }

  return <p>Start searching!</p>;
};

export default Countries;
