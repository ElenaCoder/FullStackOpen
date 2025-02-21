import { useState } from 'react';

const App = () => {
    const [persons, setPersons] = useState([{ name: 'Arto Hellas' }]);
    const [newName, setNewName] = useState('');

    const handleInput = (e) => {
        console.log(e.target.value);
        setNewName(e.target.value);
    };

    const handleAddOnSubmit = (event) => {
        event.preventDefault();

        if (persons.some((person) => person.name === newName)) {
            alert(`${newName} is already added to phonebook`);
            return;
        }

        const newPersonObject = {
            name: newName,
        };
        setPersons(persons.concat(newPersonObject));
        setNewName('');
    };

    return (
        <div>
            <h2>Phonebook</h2>
            <form onSubmit={handleAddOnSubmit}>
                <div>
                    name:
                    <input value={newName} onChange={handleInput} />
                </div>
                <div>
                    <button type='submit'>add</button>
                </div>
            </form>
            <h2>Numbers</h2>
            <ul>
                {persons.map((person, i) => (
                    <li key={i}>{person.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default App;
