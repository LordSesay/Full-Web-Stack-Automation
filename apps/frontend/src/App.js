import React, { useEffect, useState } from 'react';
import './App.css';
import API_URL from './config';

function App() {
  const [successMessage, setSuccessMessage] = useState('');
  const [failureMessage, setFailureMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getId = async () => {
      try {
        const resp = await fetch(API_URL);

        if (!resp.ok) {
          throw new Error(`Request failed with status ${resp.status}`);
        }

        const data = await resp.json();
        setSuccessMessage(data.id);
      } catch (e) {
        setFailureMessage(e.message);
      } finally {
        setLoading(false);
      }
    };

    getId();
  }, []);

  return (
    <div className="App">
      <h1>Full Web Stack Automation</h1>
      {loading && <p>Fetching...</p>}
      {!loading && failureMessage && <p>Error: {failureMessage}</p>}
      {!loading && successMessage && <p>Backend ID: {successMessage}</p>}
    </div>
  );
}

export default App;
