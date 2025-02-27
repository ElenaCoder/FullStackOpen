import Weather from './Weather';

const CountryInfo = ({ country }) => {
    return (
        <div>
            <h2>{country.name.common}</h2>
            <p>Capital: {country.capital}</p>
            <p>Area: {country.area} km²</p>

            <h3>Languages:</h3>
            <ul>
                {Object.values(country.languages).map((lang) => (
                    <li key={lang}>{lang}</li>
                ))}
            </ul>

            <img
                src={country.flags.svg}
                alt={`Flag of ${country.name.common}`}
                width='150'
            />

            <Weather capital={country.capital} />
        </div>
    );
};

export default CountryInfo;
