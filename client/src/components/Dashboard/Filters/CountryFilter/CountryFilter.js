function CountryFilter({ countryOptions, selectedCountry, setSelectedCountry }) {
  return (
    <div>
      <label>Country:</label>
      <select
        value={selectedCountry}
        onChange={e => setSelectedCountry(e.target.value)}
      >
        {countryOptions.map((country, index) => (
          <option key={index} value={country}>
            {country === "All" ? "All Countries" : country}
          </option>
        ))}
      </select>
    </div>
  );
}
export default CountryFilter;