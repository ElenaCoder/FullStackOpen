import { useState } from 'react';

const App = () => {
    const [persons, setPersons] = useState([
        { name: 'Arto Hellas', number: '39-44-5323523' },
    ]);
    const [newName, setNewName] = useState('');
    const [newNumber, setNewNumber] = useState('');

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

    return (
        <div>
            <h2>Phonebook</h2>
            <form onSubmit={handleAddOnSubmit}>
                <div>
                    name:
                    <input value={newName} onChange={handleNameChange} />
                </div>
                <div>
                    number:
                    <input value={newNumber} onChange={handleNumberChange} />
                </div>
                <div>
                    <button type='submit'>add</button>
                </div>
            </form>
            <h2>Numbers</h2>
            <ul>
                {persons.map((person, i) => (
                    <li key={i}>
                        {person.name} {person.number}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default App;
