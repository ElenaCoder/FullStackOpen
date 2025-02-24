import { useState, useEffect } from 'react'
import axios from 'axios'

import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';

const App = () => {
    const [persons, setPersons] = useState([]);
    const [newName, setNewName] = useState('');
    const [newNumber, setNewNumber] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        console.log('effect')
        axios
          .get('http://localhost:3001/persons')
          .then(response => {
            console.log('promise fulfilled')
            setPersons(response.data)
          })
      }, []);


    const handleSearchChange = (e) => setSearchTerm(e.target.value);
    const handleNameChange = (e) => setNewName(e.target.value);
    const handleNumberChange = (e) => setNewNumber(e.target.value);

    const handleAddOnSubmit = (event) => {
        event.preventDefault();

        if (persons.some((person) => person.name === newName)) {
            alert(`${newName} is already added to phonebook`);
            return;
        }

        const newPersonObject = {
            name: newName,
            number: newNumber,
        };
        setPersons(persons.concat(newPersonObject));
        setNewName('');
        setNewNumber('');
    };

    const filteredPersons = persons.filter((person) =>
        person.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    return (
        <div>
            <h2>Phonebook</h2>
            <Filter
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
            />
            <br />

            <PersonForm
                newName={newName}
                onNameChange={handleNameChange}
                newNumber={newNumber}
                onNumberChange={handleNumberChange}
                onSubmit={handleAddOnSubmit}
            />

            <h2>Numbers</h2>
            <Persons persons={filteredPersons} />
        </div>
    );
};

export default App;
