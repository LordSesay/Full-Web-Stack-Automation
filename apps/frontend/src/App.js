import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [encounter, setEncounter] = useState(null);
  const [encounters, setEncounters] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const createEncounter = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/encounters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          clinicId: 'clinic-102',
          patientReference: `PAT-${Math.floor(Math.random() * 90000 + 10000)}`,
          visitType: 'routine_checkup',
          department: 'outpatient'
        })
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = await response.json();
      setEncounter(data);
      fetchEncounters();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchEncounters = async () => {
    try {
      const response = await fetch('/api/encounters');
      const data = await response.json();
      setEncounters(data.encounters || []);
    } catch (err) {
      console.error('Failed to fetch encounters:', err);
    }
  };

  useEffect(() => {
    fetchEncounters();
  }, []);

  return (
    <div className="app">
      <header className="hero">
        <p className="eyebrow">Healthcare Operations Platform</p>
        <h1>Clinic Encounter ID Platform</h1>
        <p>
          Generate traceable encounter IDs for patient visits across check-in,
          billing, compliance, and downstream hospital systems.
        </p>
      </header>

      <section className="cards">
        <div className="card">
          <h3>API Status</h3>
          <p className="metric">Online</p>
          <span>ALB → ECS → Encounter API</span>
        </div>

        <div className="card">
          <h3>Total Encounters</h3>
          <p className="metric">{encounters.length}</p>
          <span>Generated during this runtime</span>
        </div>

        <div className="card">
          <h3>Deployment Model</h3>
          <p className="metric">Versioned</p>
          <span>Jenkins → ECR → ECS Task Revision</span>
        </div>
      </section>

      <section className="panel">
        <h2>Generate Encounter ID</h2>
        <p>
          Simulates a clinic check-in event routed from an EHR integration engine
          into the system API.
        </p>

        <button onClick={createEncounter} disabled={loading}>
          {loading ? 'Generating...' : 'Generate Encounter'}
        </button>

        {error && <p className="error">Error: {error}</p>}

        {encounter && (
          <div className="result">
            <h3>Encounter Created</h3>
            <p><strong>ID:</strong> {encounter.encounterId}</p>
            <p><strong>Clinic:</strong> {encounter.clinicId}</p>
            <p><strong>Visit Type:</strong> {encounter.visitType}</p>
            <p><strong>Status:</strong> {encounter.status}</p>
          </div>
        )}
      </section>

      <section className="panel">
        <h2>Recent Encounters</h2>

        {encounters.length === 0 ? (
          <p>No encounters generated yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Encounter ID</th>
                <th>Clinic</th>
                <th>Visit Type</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {encounters.slice(0, 5).map((item) => (
                <tr key={item.encounterId}>
                  <td>{item.encounterId}</td>
                  <td>{item.clinicId}</td>
                  <td>{item.visitType}</td>
                  <td>{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

export default App;
