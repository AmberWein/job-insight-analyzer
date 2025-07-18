function ClientFilter({ clientOptions, selectedClient, setSelectedClient }) {
  return (
    <div>
      <label>Client: </label>
      <select value={selectedClient} onChange={e => setSelectedClient(e.target.value)}>
        {clientOptions.map((client, idx) => (
          <option key={idx} value={client}>
            {client === "All" ? "All Clients" : client}
          </option>
        ))}
      </select>
    </div>
  );
}

export default ClientFilter;