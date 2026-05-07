const repo = require('../models/encounters.repository');
const { generateEncounterId } = require('../utils/id-generator');

const STATUS_FLOW = ['created', 'checked-in', 'in-progress', 'completed', 'discharged'];
const VALID_PRIORITIES = ['low', 'normal', 'urgent', 'critical'];

async function getStats() {
  return repo.getStats();
}

async function createEncounter({ clinicId, patientReference, visitType, department, priority, provider, notes }) {
  const encounter = await repo.createEncounter({
    encounterId: generateEncounterId(),
    clinicId,
    patientReference,
    visitType,
    department: department || 'general',
    priority: VALID_PRIORITIES.includes(priority) ? priority : 'normal',
    provider: provider || null,
    notes: notes || null,
    status: 'created'
  });

  encounter.statusHistory = await repo.getStatusHistory(encounter.encounterId);
  return encounter;
}

async function listEncounters(filters) {
  return repo.listEncounters(filters);
}

async function getEncounterById(encounterId) {
  const encounter = await repo.getEncounterById(encounterId);
  if (!encounter) return null;

  encounter.statusHistory = await repo.getStatusHistory(encounterId);
  return encounter;
}

async function advanceStatus(encounterId) {
  const encounter = await repo.getEncounterById(encounterId);
  if (!encounter) return { error: 'Encounter not found', status: 404 };

  const currentIdx = STATUS_FLOW.indexOf(encounter.status);
  if (currentIdx === -1 || currentIdx === STATUS_FLOW.length - 1) {
    return { error: 'Encounter already at final status', status: 400 };
  }

  const nextStatus = STATUS_FLOW[currentIdx + 1];
  const updated = await repo.updateStatus(encounterId, nextStatus, encounter.status);
  updated.statusHistory = await repo.getStatusHistory(encounterId);
  return { data: updated };
}

async function updateEncounter(encounterId, updates) {
  const encounter = await repo.getEncounterById(encounterId);
  if (!encounter) return null;

  return repo.updateEncounter(encounterId, updates);
}

async function deleteEncounter(encounterId) {
  return repo.deleteEncounter(encounterId);
}

// ADT operations
async function createFromAdt({ event_type, event_id, source_system, patient, visit }) {
  const existing = await repo.findByEventId(event_id);
  if (existing) {
    return {
      duplicate: true,
      data: { message: 'Duplicate ADT event detected. Returning existing encounter.', encounter_id: existing.encounterId, status: existing.status, idempotent: true }
    };
  }

  const encounter = await repo.createEncounter({
    encounterId: `ENC-${Date.now()}`,
    clinicId: visit.facility_id || 'clinic-default',
    patientReference: patient.mrn,
    visitType: visit.visit_type || 'urgent_care',
    department: 'emergency',
    priority: 'normal',
    provider: null,
    notes: null,
    status: 'created',
    sourceSystem: source_system,
    externalVisitReference: event_id
  });

  return {
    duplicate: false,
    data: { message: 'Encounter created from ADT event', encounter_id: encounter.encounterId, status: 'created', idempotent: false }
  };
}

async function listAdtEncounters({ status, facility_id, mrn }) {
  const filters = {};
  if (status) filters.status = status;
  if (mrn) filters.search = mrn;

  const result = await repo.listEncounters(filters);
  return result.encounters;
}

async function getAdtEncounter(id) {
  return repo.getEncounterById(id);
}

async function updateAdtStatus(id, status) {
  const encounter = await repo.getEncounterById(id);
  if (!encounter) return null;

  await repo.updateStatus(id, status, encounter.status);
  return { message: 'Status updated', encounter_id: id, new_status: status };
}

module.exports = {
  getStats,
  createEncounter,
  listEncounters,
  getEncounterById,
  advanceStatus,
  updateEncounter,
  deleteEncounter,
  createFromAdt,
  listAdtEncounters,
  getAdtEncounter,
  updateAdtStatus,
  STATUS_FLOW,
  VALID_PRIORITIES
};
