import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';

function EncounterList() {
  const [encounters, setEncounters] = useState([]);
  const [count, setCount] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [options, setOptions] = useState({ statuses: [], departments: [] });

  useEffect(() => {
    api.getOptions().then(setOptions).catch(() => {});
  }, []);

  const load = useCallback(() => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (statusFilter) params.set('status', statusFilter);
    if (deptFilter) params.set('department', deptFilter);
    api.getEncounters(params.toString()).then(d => {
      setEncounters(d.encounters || []);
      setCount(d.count || 0);
    }).catch(() => {});
  }, [search, statusFilter, deptFilter]);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="page">
      <div className="page-header">
        <h1>Encounters <span className="count-badge">{count}</span></h1>
        <Link to="/encounters/new" className="btn btn-primary">+ New Encounter</Link>
      </div>

      <div className="filters">
        <input
          type="text"
          placeholder="Search by ID, patient, or clinic..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="input"
        />
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="input">
          <option value="">All Statuses</option>
          {options.statuses.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)} className="input">
          <option value="">All Departments</option>
          {options.departments.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      {encounters.length === 0 ? (
        <div className="panel"><p className="empty">No encounters match your filters.</p></div>
      ) : (
        <div className="panel table-wrap">
          <table>
            <thead>
              <tr>
                <th>Encounter ID</th>
                <th>Patient</th>
                <th>Clinic</th>
                <th>Visit Type</th>
                <th>Department</th>
                <th>Priority</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {encounters.map(e => (
                <tr key={e.encounterId}>
                  <td><Link to={`/encounters/${e.encounterId}`} className="link">{e.encounterId}</Link></td>
                  <td>{e.patientReference}</td>
                  <td>{e.clinicId}</td>
                  <td>{e.visitType.replace(/_/g, ' ')}</td>
                  <td>{e.department}</td>
                  <td><PriorityBadge priority={e.priority} /></td>
                  <td><StatusBadge status={e.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default EncounterList;
