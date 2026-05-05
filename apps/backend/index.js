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
const STATUS_FLOW = ['created', 'checked-in', 'in-progress', 'completed', 'discharged', 'billed', 'closed'];
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
  const stats = { total: encounters.length };
  STATUS_FLOW.forEach(s => { stats[s] = 0; });

  const byDepartment = {};
  const byPriority = {};

  encounters.forEach(e => {
    if (stats[e.status] !== undefined) stats[e.status]++;
    byDepartment[e.department] = (byDepartment[e.department] || 0) + 1;
    byPriority[e.priority] = (byPriority[e.priority] || 0) + 1;
  });

  res.json({ message: 'Encounter stats retrieved successfully', stats, byStatus: stats, byDepartment, byPriority });
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

app.get('/api/encounters/adt', (req, res) => {
  const { status, facility_id, mrn } = req.query;
  let results = encounters.filter(e => e.event_id);

  if (status) results = results.filter(e => e.status === status);
  if (facility_id) results = results.filter(e => e.facility_id === facility_id);
  if (mrn) results = results.filter(e => e.mrn === mrn);

  return res.json(results);
});

app.get('/api/encounters/adt/:id', (req, res) => {
  const encounter = encounters.find(e => e.encounter_id === req.params.id);
  if (!encounter) return res.status(404).json({ error: 'Encounter not found' });
  return res.json(encounter);
});

app.patch('/api/encounters/adt/:id/status', (req, res) => {
  const { status } = req.body;

  if (!STATUS_FLOW.includes(status)) {
    return res.status(400).json({ error: 'Invalid status', valid_statuses: STATUS_FLOW });
  }

  const encounter = encounters.find(e => e.encounter_id === req.params.id);
  if (!encounter) return res.status(404).json({ error: 'Encounter not found' });

  encounter.status = status;
  encounter.updatedAt = new Date().toISOString();
  encounter.statusHistory.push({ status, timestamp: encounter.updatedAt, source: 'system-update' });

  return res.json({ message: 'Status updated', encounter_id: req.params.id, new_status: status });
});

app.post('/api/encounters/from-adt', (req, res) => {
  const { event_type, event_id, source_system, patient, visit } = req.body;

  if (event_type !== 'ADT_A04') {
    return res.status(400).json({ error: 'Unsupported ADT event type', supported_event: 'ADT_A04' });
  }

  if (!event_id || !patient?.mrn || !visit?.epic_csn) {
    return res.status(400).json({ error: 'Missing required ADT fields' });
  }

  const existing = encounters.find(e => e.event_id === event_id);
  if (existing) {
    return res.status(200).json({
      message: 'Duplicate ADT event detected. Returning existing encounter.',
      encounter_id: existing.encounter_id,
      status: existing.status,
      idempotent: true
    });
  }

  const encounter_id = `ENC-${Date.now()}`;
  const now = new Date().toISOString();

  encounters.unshift({
    encounter_id,
    event_id,
    event_type,
    source_system,
    mrn: patient.mrn,
    dob: patient.dob,
    sex: patient.sex,
    epic_csn: visit.epic_csn,
    facility_id: visit.facility_id,
    visit_type: visit.visit_type,
    status: 'created',
    createdAt: now,
    updatedAt: now,
    statusHistory: [{ status: 'created', timestamp: now, source: event_type }]
  });

  return res.status(201).json({
    message: 'Encounter created from ADT event',
    encounter_id,
    status: 'created',
    idempotent: false
  });
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
