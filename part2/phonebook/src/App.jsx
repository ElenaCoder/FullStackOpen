import { useState, useEffect } from 'react';

import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';

import personService from './services/persons';

const App = () => {
    const [persons, setPersons] = useState([]);
    const [newName, setNewName] = useState('');
    const [newNumber, setNewNumber] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        personService.getAllPersons().then((initialPersons) => {
            setPersons(initialPersons);
        });
    }, []);

    const handleSearchChange = (e) => setSearchTerm(e.target.value);
    const handleNameChange = (e) => setNewName(e.target.value);
    const handleNumberChange = (e) => setNewNumber(e.target.value);

    const handleAddOnSubmit = (event) => {
        event.preventDefault();

        const existingPerson = persons.find(
            (person) => person.name === newName,
        );

        if (existingPerson) {
            const confirmUpdate = window.confirm(
                `${newName} is already added to phonebook, replace the old number with a new one?`,
            );

            if (confirmUpdate) {
                const updatedPerson = { ...existingPerson, number: newNumber };

                personService
                    .updatePerson(existingPerson.id, updatedPerson)
                    .then((returnedPerson) => {
                        setPersons(
                            persons.map((person) =>
                                person.id !== existingPerson.id
                                    ? person
                                    : returnedPerson,
                            ),
                        );
                        setNewName('');
                        setNewNumber('');
                    })
                    .catch((error) => {
                        alert(
                            `Failed to update ${newName}. They may have been removed from the server.`,
                        );
                        setPersons(
                            persons.filter(
                                (person) => person.id !== existingPerson.id,
                            ),
                        );
                    });
            }
            return;
        }

        const newPersonObject = {
            name: newName,
            number: newNumber,
        };

        personService.createPerson(newPersonObject).then((returnedPerson) => {
            setPersons(persons.concat(returnedPerson));
            setNewName('');
            setNewNumber('');
        });
    };

    const filteredPersons = persons.filter((person) =>
        person.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const handleDeletePerson = (id) => {
        const person = persons.find((p) => p.id === id);
        if (window.confirm(`Delete ${person.name}?`)) {
            personService.deletePerson(id).then(() => {
                setPersons(persons.filter((p) => p.id !== id));
            });
        }
    };

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
            <Persons
                persons={filteredPersons}
                deletePerson={handleDeletePerson}
            />
        </div>
    );
};

export default App;
