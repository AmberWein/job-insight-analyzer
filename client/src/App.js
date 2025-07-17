import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('/')
      .then(res => setMessage(res.data.message))
      .catch(err => console.error(err));
  }, []);

  return <h1>{message || 'Loading...'}</h1>;
}

export default App;