import React from "react";

const Person = ({ person, onDelete }) => (
  <li>
    {person.name} {person.number}
    <button onClick={() => onDelete(person)}>delete</button>
  </li>
);

const Persons = ({ persons, filter, onDelete }) => {
  const mapPersons = (p) => (
    <Person key={p.name} person={p} onDelete={onDelete} />
  );

  if (filter.length > 0) {
    return (
      <ul>
        {persons
          .filter((p) => p.name.toLowerCase().includes(filter.toLowerCase()))
          .map(mapPersons)}
      </ul>
    );
  }
  return <ul>{persons.map(mapPersons)}</ul>;
};

export default Persons;
