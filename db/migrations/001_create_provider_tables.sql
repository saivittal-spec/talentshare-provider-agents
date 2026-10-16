
CREATE TABLE provider_prospects (
    id TEXT PRIMARY KEY,
    display_name TEXT NOT NULL,
    provider_type TEXT NOT NULL,

    subjects TEXT[] NOT NULL,
    specializations TEXT[] NOT NULL DEFAULT '{}',
    geography TEXT,

    teaching_experience_years NUMERIC CHECK (
        teaching_experience_years >= 0
    ),
    subject_experience_years NUMERIC CHECK (
        subject_experience_years >= 0
    ),

    qualification_status TEXT NOT NULL
        DEFAULT 'not_evaluated',
    qualification_score NUMERIC CHECK (
        qualification_score BETWEEN 0 AND 100
    ),
    priority_tier TEXT NOT NULL DEFAULT 'not_scored',
    qualification_policy_version TEXT,

    contact_eligibility_status TEXT NOT NULL
        DEFAULT 'not_checked',
    is_suppressed BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,

    CONSTRAINT valid_subjects CHECK (
        cardinality(subjects) >= 1
        AND subjects <@ ARRAY['math', 'english']::TEXT[]
    ),

    CONSTRAINT valid_provider_type CHECK (
        provider_type IN (
            'tutor', 'teacher', 'instructor',
            'professor', 'mentor', 'coach',
            'subject_matter_expert', 'creator', 'other'
        )
    ),

    CONSTRAINT valid_qualification_status CHECK (
        qualification_status IN (
            'not_evaluated', 'qualified',
            'review_required', 'disqualified'
        )
    ),

    CONSTRAINT valid_priority_tier CHECK (
        priority_tier IN (
            'not_scored', 'high', 'standard',
            'review', 'low'
        )
    ),

    CONSTRAINT valid_contact_eligibility CHECK (
        contact_eligibility_status IN (
            'not_checked', 'permitted',
            'blocked', 'review_required'
        )
    )
);

CREATE TABLE provider_evidence (
    id TEXT PRIMARY KEY,
    provider_id TEXT NOT NULL
        REFERENCES provider_prospects(id)
        ON DELETE CASCADE,

    source_name TEXT NOT NULL,
    source_url TEXT,
    observed_at TIMESTAMPTZ NOT NULL,
    fact TEXT NOT NULL
);

CREATE INDEX idx_provider_evidence_provider_id
    ON provider_evidence(provider_id);

CREATE INDEX idx_provider_prospects_qualification
    ON provider_prospects(qualification_status);
