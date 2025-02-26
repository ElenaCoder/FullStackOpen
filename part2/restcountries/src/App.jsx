import { useState, useEffect } from 'react';
import axios from 'axios';
import CountryInfo from './components/CountryInfo';
import CountryList from './components/CountryList';

const App = () => {
    const [search, setSearch] = useState('');
    const [countries, setCountries] = useState([]);
    const [filteredCountries, setFilteredCountries] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState(null);

    useEffect(() => {
        axios
            .get('https://studies.cs.helsinki.fi/restcountries/api/all')
            .then((response) => {
                setCountries(response.data);
            });
    }, []);

    useEffect(() => {
        if (search) {
            const results = countries.filter((country) =>
                country.name.common
                    .toLowerCase()
                    .includes(search.toLowerCase()),
            );
            setFilteredCountries(results);
            setSelectedCountry(null);
        } else {
            setFilteredCountries([]);
        }
    }, [search, countries]);

    return (
        <div>
            <h1>Country Finder</h1>
            <input
                type='text'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder='Search for a country...'
            />
            <div>
                {filteredCountries.length > 10 && (
                    <p>Too many matches, please specify another filter.</p>
                )}
                {filteredCountries.length > 1 &&
                    filteredCountries.length <= 10 && (
                        <CountryList
                            countries={filteredCountries}
                            handleShow={setSelectedCountry}
                        />
                    )}
                {filteredCountries.length === 1 && (
                    <CountryInfo country={filteredCountries[0]} />
                )}
                {selectedCountry && <CountryInfo country={selectedCountry} />}
            </div>
        </div>
    );
};

export default App;
