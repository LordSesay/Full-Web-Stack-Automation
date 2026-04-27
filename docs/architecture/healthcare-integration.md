
### `docs/architecture/healthcare-integration.md`

```markdown
# Healthcare Integration Context

## Purpose

The Clinic Encounter ID Platform provides a REST API that generates unique encounter IDs for patient visits.

## Real-World Integration Flow

```text
Epic EHR
   ↓
Patient check-in event
   ↓
Epic Integration Engine / Bridges / Rhapsody / MuleSoft
   ↓
AWS API Gateway or ALB endpoint
   ↓
POST /api/encounters
   ↓
Encounter ID generated
   ↓
Response returned to integration engine
   ↓
Encounter ID stored in Epic encounter record
