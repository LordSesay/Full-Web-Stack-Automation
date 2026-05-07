const { Router } = require('express');
const service = require('../services/encounters.service');

const router = Router();

router.get('/adt', async (req, res) => {
  try {
    const results = await service.listAdtEncounters(req.query);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Failed to list ADT encounters', detail: err.message });
  }
});

router.get('/adt/:id', async (req, res) => {
  try {
    const encounter = await service.getAdtEncounter(req.params.id);
    if (!encounter) return res.status(404).json({ error: 'Encounter not found' });
    res.json(encounter);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get encounter', detail: err.message });
  }
});

router.patch('/adt/:id/status', async (req, res) => {
  const { status } = req.body;

  if (!service.STATUS_FLOW.includes(status)) {
    return res.status(400).json({ error: 'Invalid status', valid_statuses: service.STATUS_FLOW });
  }

  try {
    const result = await service.updateAdtStatus(req.params.id, status);
    if (!result) return res.status(404).json({ error: 'Encounter not found' });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update status', detail: err.message });
  }
});

router.post('/from-adt', async (req, res) => {
  const { event_type, event_id, patient, visit } = req.body;

  if (event_type !== 'ADT_A04') {
    return res.status(400).json({ error: 'Unsupported ADT event type', supported_event: 'ADT_A04' });
  }
  if (!event_id || !patient?.mrn || !visit?.epic_csn) {
    return res.status(400).json({ error: 'Missing required ADT fields' });
  }

  try {
    const result = await service.createFromAdt(req.body);
    const statusCode = result.duplicate ? 200 : 201;
    res.status(statusCode).json(result.data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to process ADT event', detail: err.message });
  }
});

module.exports = router;
