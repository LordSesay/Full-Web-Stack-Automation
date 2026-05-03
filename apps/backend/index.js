const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { CORS_ORIGIN, PORT } = require('./config');

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', CORS_ORIGIN || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

const encounters = [];
const STATUS_FLOW = ['created', 'checked-in', 'in-progress', 'completed', 'discharged'];
const VALID_VISIT_TYPES = ['routine_checkup', 'follow_up', 'urgent_care', 'emergency', 'specialist_referral', 'lab_work'];
const VALID_DEPARTMENTS = ['general', 'outpatient', 'inpatient', 'emergency', 'radiology', 'laboratory', 'cardiology', 'pediatrics'];
const VALID_PRIORITIES = ['low', 'normal', 'high', 'critical'];

function generateEncounterId() {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const shortId = uuidv4().split('-')[0].toUpperCase();
  return `ENC-${date}-${shortId}`;
}

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'encounter-id-api', uptime: process.uptime(), timestamp: new Date().toISOString() });
});

app.get('/api/encounters/stats', (req, res) => {
  const byStatus = {};
  const byDepartment = {};
  const byPriority = {};
  STATUS_FLOW.forEach(s => { byStatus[s] = 0; });

  encounters.forEach(e => {
    byStatus[e.status] = (byStatus[e.status] || 0) + 1;
    byDepartment[e.department] = (byDepartment[e.department] || 0) + 1;
    byPriority[e.priority] = (byPriority[e.priority] || 0) + 1;
  });

  res.json({ total: encounters.length, byStatus, byDepartment, byPriority });
});

app.get('/api/encounters/options', (req, res) => {
  res.json({ visitTypes: VALID_VISIT_TYPES, departments: VALID_DEPARTMENTS, priorities: VALID_PRIORITIES, statuses: STATUS_FLOW });
});

app.post('/api/encounters', (req, res) => {
  const { clinicId, patientReference, visitType, department, priority, provider, notes } = req.body;

  if (!clinicId || !patientReference || !visitType) {
    return res.status(400).json({ error: 'clinicId, patientReference, and visitType are required' });
  }

  const encounter = {
    encounterId: generateEncounterId(),
    clinicId,
    patientReference,
    visitType,
    department: department || 'general',
    priority: VALID_PRIORITIES.includes(priority) ? priority : 'normal',
    provider: provider || null,
    notes: notes || null,
    status: 'created',
    statusHistory: [{ status: 'created', timestamp: new Date().toISOString() }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  encounters.unshift(encounter);
  res.status(201).json(encounter);
});

app.get('/api/encounters', (req, res) => {
  let result = [...encounters];
  const { status, department, priority, search, limit } = req.query;

  if (status) result = result.filter(e => e.status === status);
  if (department) result = result.filter(e => e.department === department);
  if (priority) result = result.filter(e => e.priority === priority);
  if (search) {
    const q = search.toLowerCase();
    result = result.filter(e =>
      e.encounterId.toLowerCase().includes(q) ||
      e.patientReference.toLowerCase().includes(q) ||
      e.clinicId.toLowerCase().includes(q)
    );
  }

  const cap = Math.min(parseInt(limit) || 50, 100);
  res.json({ count: result.length, encounters: result.slice(0, cap) });
});

app.get('/api/encounters/:encounterId', (req, res) => {
  const encounter = encounters.find(e => e.encounterId === req.params.encounterId);
  if (!encounter) return res.status(404).json({ error: 'Encounter not found' });
  res.json(encounter);
});

app.patch('/api/encounters/:encounterId/status', (req, res) => {
  const encounter = encounters.find(e => e.encounterId === req.params.encounterId);
  if (!encounter) return res.status(404).json({ error: 'Encounter not found' });

  const currentIdx = STATUS_FLOW.indexOf(encounter.status);
  if (currentIdx === STATUS_FLOW.length - 1) {
    return res.status(400).json({ error: 'Encounter already at final status' });
  }

  const nextStatus = STATUS_FLOW[currentIdx + 1];
  encounter.status = nextStatus;
  encounter.updatedAt = new Date().toISOString();
  encounter.statusHistory.push({ status: nextStatus, timestamp: encounter.updatedAt });

  res.json(encounter);
});

app.patch('/api/encounters/:encounterId', (req, res) => {
  const encounter = encounters.find(e => e.encounterId === req.params.encounterId);
  if (!encounter) return res.status(404).json({ error: 'Encounter not found' });

  const { notes, provider, priority } = req.body;
  if (notes !== undefined) encounter.notes = notes;
  if (provider !== undefined) encounter.provider = provider;
  if (priority && VALID_PRIORITIES.includes(priority)) encounter.priority = priority;
  encounter.updatedAt = new Date().toISOString();

  res.json(encounter);
});

app.delete('/api/encounters/:encounterId', (req, res) => {
  const idx = encounters.findIndex(e => e.encounterId === req.params.encounterId);
  if (idx === -1) return res.status(404).json({ error: 'Encounter not found' });

  const [removed] = encounters.splice(idx, 1);
  res.json({ message: 'Encounter voided', encounterId: removed.encounterId });
});

app.get('/api/id', (req, res) => {
  res.json({ id: generateEncounterId(), message: 'Encounter ID generated successfully' });
});

app.listen(PORT, () => {
  console.log(`Encounter ID API running on port ${PORT}`);
});
