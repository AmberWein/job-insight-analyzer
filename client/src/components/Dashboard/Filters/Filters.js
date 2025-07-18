import DateFilter from "./DateFilter/DateFilter";
import ClientFilter from "./ClientFilter/ClientFilter";
import CountryFilter from "./CountryFilter/CountryFilter";
import "./Filters.css";

function Filters({ dateFilter, clientFilter, countryFilter }) {
  return (
    <div className="filters">
      <div><DateFilter {...dateFilter} /></div>
      <div><ClientFilter {...clientFilter} /></div>
      <div><CountryFilter {...countryFilter} /></div>
    </div>
  );
}

export default Filters;
