-- ==============================================================================
-- GẠC MĂNG RÊ — Media Assets & Progressive Content Layer
-- Version: 1.1
-- ==============================================================================

DO $$ BEGIN
    CREATE TYPE asset_type AS ENUM (
        'DOCUMENTARY',
        'SOURCE',
        'EDITORIAL',
        'AI_GENERATED'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

CREATE TABLE IF NOT EXISTS media_assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    url TEXT NOT NULL,
    thumbnail_url TEXT,
    asset_type asset_type NOT NULL DEFAULT 'DOCUMENTARY',
    source VARCHAR(255) NOT NULL,
    license VARCHAR(255) DEFAULT 'GacMangRe Exclusive',
    credit VARCHAR(255) NOT NULL,
    is_verified BOOLEAN NOT NULL DEFAULT true,
    alt_text TEXT NOT NULL,
    caption TEXT,
    slot VARCHAR(50), -- 'hero', 'hands', 'landscape', 'process', 'texture', 'producer'
    entity_type VARCHAR(50), -- 'ngan', 'story', 'producer'
    entity_id UUID,
    width INTEGER,
    height INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_media_assets_entity ON media_assets(entity_type, entity_id);

-- RLS for media_assets
ALTER TABLE media_assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view verified media assets" ON media_assets
    FOR SELECT USING (true);
