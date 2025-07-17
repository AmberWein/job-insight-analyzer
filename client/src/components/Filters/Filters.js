import DateFilter from './DateFilter/DateFilter';
import ClientFilter from './ClientFilter/ClientFilter';
import CountryFilter from './CountryFilter/CountryFilter';

function Filters({ dateFilter, clientFilter, countryFilter }) {
  return (
    <div className="filters">
      <DateFilter {...dateFilter} />
      <ClientFilter {...clientFilter} />
      <CountryFilter {...countryFilter} />
    </div>
  );
}

export default Filters;
