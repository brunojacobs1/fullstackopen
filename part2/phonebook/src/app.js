import React, { useState, useEffect } from 'react';
import Filter from './components/filter';
import PersonForm from './components/person_form';
import Persons from './components/persons';
import personService from './services/personService';
import Notification from './components/notification';
import './index.css';

const App = () => {
  const messageTypes = {
    SUCCESS: 'success',
    ERROR: 'error',
  };

  const [persons, setPersons] = useState([]);
  const [filter, setFilter] = useState('');
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(null);

  useEffect(() => {
    personService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const addPerson = (event) => {
    event.preventDefault();
    const personObject = {
      name: newName,
      number: newNumber,
    };
    if (!persons.some((p) => p.name === newName)) {
      personService
        .create(personObject)
        .then((responsePerson) => {
          setMessage(`Added ${newName}`);
          setMessageType(messageTypes.SUCCESS);
          setTimeout(() => {
            setMessage(null);
            setMessageType(null);
          }, 5000);
          setPersons(persons.concat(responsePerson));
          setNewName('');
          setNewNumber('');
        })
        .catch((err) => {
          setMessage(err.response.data.error);
          setMessageType(messageTypes.ERROR);
          setTimeout(() => {
            setMessage(null);
            setMessageType(null);
          }, 8000);
          console.log(err.response.data);
        });
    } else {
      if (
        window.confirm(
          `${newName} is already on the Phonebook, replace the old number with the new one?`
        )
      ) {
        updatePerson(newName, newNumber);
      }
    }
  };

  const deletePerson = (person) => {
    if (window.confirm(`Delete ${person.name}?`)) {
      personService
        .deletePerson(person.id)
        .then( () => {
          setMessage(`Deleted ${person.name}`);
          setMessageType(messageTypes.SUCCESS);
          setTimeout(() => {
            setMessage(null);
            setMessageType(null);
          }, 5000);
          setPersons(persons.filter((p) => p.id !== person.id))
        })
        .catch((err) => {
          setPersons(persons.filter((p) => p.id !== person.id));
          setMessage(
            `Information of ${person.name} has already been removed from the server`
          );
          setMessageType(messageTypes.ERROR);
          setTimeout(() => {
            setMessage(null);
            setMessageType(null);
          }, 8000);
        });
    }
  };

  const updatePerson = (name, newNumber) => {
    const person = persons.find((p) => p.name === name);
    const newPerson = { ...person, number: newNumber };
    personService
      .update(person.id, newPerson)
      .then((responsePerson) => {
        setMessage(`Updated number for ${name}`);
        setMessageType(messageTypes.SUCCESS);
        setTimeout(() => {
          setMessage(null);
          setMessageType(null);
        }, 5000);
        setPersons(
          persons.map((p) => (p.id !== person.id ? p : responsePerson))
        );
      })
      .catch((err) => {
        setPersons(persons.filter((p) => p.id !== person.id));
        setMessage(
          `Information of ${name} has already been removed from the server`
        );
        setMessageType(messageTypes.ERROR);
        setTimeout(() => {
          setMessage(null);
          setMessageType(null);
        }, 8000);
      });
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={message} type={messageType} />
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <h3>Add a new</h3>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons persons={persons} filter={filter} onDelete={deletePerson} />
    </div>
  );
};

export default App;
