import { useState, useEffect } from 'react';

import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';
import Notification from './components/Notification';

import personService from './services/persons';

const App = () => {
    const [persons, setPersons] = useState([]);
    const [newName, setNewName] = useState('');
    const [newNumber, setNewNumber] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [notification, setNotification] = useState({
        message: null,
        type: '',
    });

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

        if (!newNumber.trim()) {
            setNotification({
                message: 'Number cannot be empty.',
                type: 'error',
            });
            setTimeout(() => {
                setNotification({ message: null, type: '' });
            }, 5000);
            return;
        }

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
                        setNotification({
                            message: `Updated '${returnedPerson.name}'`,
                            type: 'success',
                        });
                        setTimeout(() => {
                            setNotification({
                                message: null,
                                type: '',
                            });
                        }, 5000);
                        setNewName('');
                        setNewNumber('');
                    })
                    .catch((error) => {
                        if (error.response && error.response.data.error) {
                            setNotification({
                                message: error.response.data.error,
                                type: 'error',
                            });
                        } else {
                            setNotification({
                                message: `Information of '${newName}' has already been removed from the server.`,
                                type: 'error',
                            });
                            setPersons(
                                persons.filter(
                                    (person) => person.id !== existingPerson.id,
                                ),
                            );
                        }
                        setTimeout(() => {
                            setNotification({ message: null, type: '' });
                        }, 5000);
                    });
            }
            return;
        }

        const newPersonObject = {
            name: newName,
            number: newNumber,
        };

        personService
            .createPerson(newPersonObject)
            .then((returnedPerson) => {
                setNotification({
                    message: `Added '${returnedPerson.name}'`,
                    type: 'success',
                });
                setTimeout(() => {
                    setNotification({
                        message: null,
                        type: '',
                    });
                }, 5000);
                setPersons(persons.concat(returnedPerson));
                setNewName('');
                setNewNumber('');
            })
            .catch((error) => {
                setNotification({
                    message: error.response.data.error,
                    type: 'error',
                });
                setTimeout(() => {
                    setNotification({
                        message: null,
                        type: '',
                    });
                }, 5000);
            });
    };

    const filteredPersons = persons.filter((person) =>
        person.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const handleDeletePerson = (id) => {
        const person = persons.find((p) => p.id === id);
        if (window.confirm(`Delete ${person.name}?`)) {
            personService
                .deletePerson(id)
                .then(() => {
                    setPersons(persons.filter((p) => p.id !== id));
                    setNotification({
                        message: `Deleted '${person.name}'`,
                        type: 'success',
                    });
                    setTimeout(() => {
                        setNotification({
                            message: null,
                            type: '',
                        });
                    }, 5000);
                })
                .catch((error) => {
                    setNotification({
                        message: `Error: '${person.name}' was already removed from the server.`,
                        type: 'error',
                    });
                    setTimeout(() => {
                        setNotification({
                            message: null,
                            type: '',
                        });
                    }, 5000);
                    setPersons(persons.filter((p) => p.id !== id));
                });
        }
    };

    return (
        <div>
            <h2>Phonebook</h2>
            <Notification
                message={notification?.message}
                type={notification?.type}
            />
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
