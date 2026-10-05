-- ==============================================================================
-- GẠC MĂNG RÊ — M3 Event Architecture & Processing Status Migration
-- Version: 3.0
-- ==============================================================================

DO $$ BEGIN
    CREATE TYPE event_status AS ENUM (
        'PENDING',
        'PROCESSING',
        'PROCESSED',
        'FAILED'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Extend events table with lifecycle and retry semantics
ALTER TABLE events ADD COLUMN IF NOT EXISTS status event_status DEFAULT 'PENDING';
ALTER TABLE events ADD COLUMN IF NOT EXISTS retry_count INTEGER DEFAULT 0;
ALTER TABLE events ADD COLUMN IF NOT EXISTS last_error TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_type ON events(event_type);
