const CountryList = ({ countries, handleShow }) => {
    return (
        <div>
            {countries.map(country => (
                <p key={country.cca3}>
                    {country.name.common} <button onClick={() => handleShow(country)}>Show</button>
                </p>
            ))}
        </div>
    );
};

export default CountryList;