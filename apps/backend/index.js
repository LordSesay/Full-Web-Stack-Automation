const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { CORS_ORIGIN, PORT } = require('./config');

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', CORS_ORIGIN || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
});

const encounters = [];

function generateEncounterId() {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const shortId = uuidv4().split('-')[0].toUpperCase();
  return `ENC-${date}-${shortId}`;
}

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'encounter-id-api',
    timestamp: new Date().toISOString()
  });
});

app.post('/api/encounters', (req, res) => {
  const {
    clinicId,
    patientReference,
    visitType,
    department
  } = req.body;

  if (!clinicId || !patientReference || !visitType) {
    return res.status(400).json({
      error: 'clinicId, patientReference, and visitType are required'
    });
  }

  const encounter = {
    encounterId: generateEncounterId(),
    clinicId,
    patientReference,
    visitType,
    department: department || 'general',
    status: 'created',
    createdAt: new Date().toISOString()
  };

  encounters.unshift(encounter);

  res.status(201).json(encounter);
});

app.get('/api/encounters', (req, res) => {
  res.json({
    count: encounters.length,
    encounters
  });
});

app.get('/api/encounters/:encounterId', (req, res) => {
  const encounter = encounters.find(
    item => item.encounterId === req.params.encounterId
  );

  if (!encounter) {
    return res.status(404).json({
      error: 'Encounter not found'
    });
  }

  res.json(encounter);
});

// Backward-compatible endpoint for pipeline/frontend testing
app.get('/api/id', (req, res) => {
  res.json({
    id: generateEncounterId(),
    message: 'Encounter ID generated successfully'
  });
});

app.listen(PORT, () => {
  console.log(`Encounter ID API running on port ${PORT}`);
});
