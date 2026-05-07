-- Initial schema: clinics, encounters, encounter_status_history

CREATE TABLE IF NOT EXISTS clinics (
    clinic_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    external_clinic_ref VARCHAR(100) UNIQUE NOT NULL,
    clinic_name VARCHAR(255) NOT NULL,
    ehr_vendor VARCHAR(100),
    integration_engine VARCHAR(100),
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS encounters (
    encounter_id VARCHAR(50) PRIMARY KEY,
    clinic_id UUID NOT NULL REFERENCES clinics(clinic_id),

    patient_reference VARCHAR(150) NOT NULL,
    external_visit_reference VARCHAR(150),

    visit_type VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    priority VARCHAR(50) DEFAULT 'normal',

    provider_reference VARCHAR(150),
    status VARCHAR(50) NOT NULL DEFAULT 'created',

    source_system VARCHAR(100),
    created_by VARCHAR(150),

    notes TEXT,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    discharged_at TIMESTAMP,

    CONSTRAINT valid_encounter_status CHECK (
        status IN (
            'created',
            'checked-in',
            'in-progress',
            'completed',
            'discharged',
            'voided'
        )
    ),

    CONSTRAINT valid_priority CHECK (
        priority IN (
            'low',
            'normal',
            'urgent',
            'critical'
        )
    )
);

CREATE TABLE IF NOT EXISTS encounter_status_history (
    history_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    encounter_id VARCHAR(50) NOT NULL REFERENCES encounters(encounter_id),

    previous_status VARCHAR(50),
    new_status VARCHAR(50) NOT NULL,

    changed_by VARCHAR(150),
    change_reason TEXT,

    changed_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_encounters_clinic_created
ON encounters (clinic_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_encounters_status
ON encounters (status);

CREATE INDEX IF NOT EXISTS idx_encounters_department
ON encounters (department);

CREATE INDEX IF NOT EXISTS idx_encounters_patient_reference
ON encounters (patient_reference);

CREATE INDEX IF NOT EXISTS idx_status_history_encounter
ON encounter_status_history (encounter_id, changed_at DESC);

-- Seed a default clinic for development
INSERT INTO clinics (external_clinic_ref, clinic_name, ehr_vendor, integration_engine)
VALUES ('clinic-default', 'Default Clinic', 'Generic', 'Direct API')
ON CONFLICT (external_clinic_ref) DO NOTHING;
