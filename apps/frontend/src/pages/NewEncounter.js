import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import api from '../api';

function NewEncounter() {
  const history = useHistory();
  const [options, setOptions] = useState({ visitTypes: [], departments: [], priorities: [] });
  const [form, setForm] = useState({
    clinicId: '',
    patientReference: '',
    visitType: 'routine_checkup',
    department: 'general',
    priority: 'normal',
    provider: '',
    notes: ''
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.getOptions().then(setOptions).catch(() => {});
  }, []);

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const data = { ...form };
      if (!data.provider) delete data.provider;
      if (!data.notes) delete data.notes;
      const enc = await api.createEncounter(data);
      history.push(`/encounters/${enc.encounterId}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>New Encounter</h1>
      </div>

      <div className="panel form-panel">
        <form onSubmit={submit}>
          <div className="form-grid">
            <label className="form-field">
              <span>Clinic ID *</span>
              <input className="input" value={form.clinicId} onChange={set('clinicId')} placeholder="e.g. clinic-102" required />
            </label>
            <label className="form-field">
              <span>Patient Reference *</span>
              <input className="input" value={form.patientReference} onChange={set('patientReference')} placeholder="e.g. PAT-29381" required />
            </label>
            <label className="form-field">
              <span>Visit Type *</span>
              <select className="input" value={form.visitType} onChange={set('visitType')}>
                {options.visitTypes.map(v => <option key={v} value={v}>{v.replace(/_/g, ' ')}</option>)}
              </select>
            </label>
            <label className="form-field">
              <span>Department</span>
              <select className="input" value={form.department} onChange={set('department')}>
                {options.departments.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </label>
            <label className="form-field">
              <span>Priority</span>
              <select className="input" value={form.priority} onChange={set('priority')}>
                {options.priorities.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </label>
            <label className="form-field">
              <span>Provider</span>
              <input className="input" value={form.provider} onChange={set('provider')} placeholder="Dr. Smith" />
            </label>
          </div>
          <label className="form-field full">
            <span>Notes</span>
            <textarea className="input textarea" value={form.notes} onChange={set('notes')} rows="3" placeholder="Optional clinical notes..." />
          </label>

          {error && <p className="error">{error}</p>}

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Encounter'}
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => history.push('/encounters')}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewEncounter;
