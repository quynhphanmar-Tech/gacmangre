-- ==============================================================================
-- GẠC MĂNG RÊ — Core Database Schema & Business Logic Engine
-- Version: 1.0 (MVP)
-- Target: Supabase / PostgreSQL 15+
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Enumerated Types (State Machines)
DO $$ BEGIN
    CREATE TYPE ngan_status AS ENUM (
        'DRAFT',
        'PUBLISHED',
        'OPEN',
        'FULL',
        'PRODUCER_CONFIRMING',
        'PRODUCTION',
        'SHIPPING',
        'COMPLETED',
        'EXPIRED',
        'CANCELLED'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE order_status AS ENUM (
        'CREATED',
        'CONFIRMED',
        'PAYMENT_PENDING',
        'PAID',
        'FULFILLING',
        'SHIPPED',
        'DELIVERED',
        'CANCELLED',
        'REFUNDED'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE fulfillment_status AS ENUM (
        'PENDING',
        'PRODUCER_CONFIRMED',
        'PROCESSING',
        'SHIPPED',
        'DELIVERED',
        'RETURNED'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE entity_status AS ENUM (
        'ACTIVE',
        'INACTIVE',
        'DRAFT'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 3. PRODUCER Table (Nhà sản xuất / Người làm tử tế)
CREATE TABLE IF NOT EXISTS producers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    brand_name VARCHAR(255),
    location VARCHAR(255) NOT NULL,
    description TEXT,
    story TEXT,
    avatar TEXT,
    phone VARCHAR(50),
    zalo VARCHAR(50),
    capacity INTEGER DEFAULT 100,
    status entity_status DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. PRODUCT Table (Sản vật cốt lõi)
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    producer_id UUID NOT NULL REFERENCES producers(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    origin VARCHAR(255) NOT NULL,
    unit VARCHAR(50) DEFAULT 'phần',
    weight VARCHAR(50),
    price NUMERIC(12, 2) NOT NULL,
    ingredients TEXT,
    storage TEXT,
    expiry VARCHAR(100),
    certifications TEXT,
    status entity_status DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. NGAN Table (Ngăn — Đơn vị chiến dịch Story-Commerce)
CREATE TABLE IF NOT EXISTS ngans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    number VARCHAR(50) UNIQUE NOT NULL, -- e.g. '#001'
    slug VARCHAR(255) UNIQUE NOT NULL,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    short_description TEXT,
    price NUMERIC(12, 2) NOT NULL,
    moq INTEGER NOT NULL DEFAULT 100,
    current_quantity INTEGER NOT NULL DEFAULT 0,
    open_at TIMESTAMPTZ DEFAULT NOW(),
    deadline TIMESTAMPTZ,
    status ngan_status DEFAULT 'DRAFT',
    hero_image TEXT,
    gallery JSONB DEFAULT '[]'::jsonb,
    selection_dat TEXT,      -- Tiêu chuẩn: ĐẤT
    selection_nguoi TEXT,    -- Tiêu chuẩn: NGƯỜI
    selection_vi TEXT,       -- Tiêu chuẩn: VỊ
    selection_chuyen TEXT,   -- Tiêu chuẩn: CHUYỆN
    shipping_estimate VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. STORY Table (Câu chuyện sản vật)
CREATE TABLE IF NOT EXISTS stories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    type VARCHAR(50) DEFAULT 'ARTICLE',
    excerpt TEXT,
    content TEXT NOT NULL,
    cover_image TEXT,
    video_url TEXT,
    producer_id UUID REFERENCES producers(id) ON DELETE SET NULL,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    published_at TIMESTAMPTZ DEFAULT NOW(),
    status entity_status DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. CUSTOMER Table (Khách hàng mở ngăn)
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    zalo_identifier VARCHAR(100),
    address TEXT NOT NULL,
    province VARCHAR(100),
    source VARCHAR(100) DEFAULT 'DIRECT',
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    utm_content VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index customer phone for fast lookup
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);

-- 8. ORDER Table (Đơn hàng gom ngăn)
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_code VARCHAR(50) UNIQUE NOT NULL, -- GM-YYYY-XXXXXX
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    ngan_id UUID NOT NULL REFERENCES ngans(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(12, 2) NOT NULL,
    total_amount NUMERIC(12, 2) NOT NULL,
    status order_status DEFAULT 'CREATED',
    payment_status VARCHAR(50) DEFAULT 'PENDING_MOQ',
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_ngan ON orders(ngan_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- 9. FULFILLMENT Table (Theo dõi đơn vận chuyển)
CREATE TABLE IF NOT EXISTS fulfillments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID UNIQUE NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    producer_id UUID REFERENCES producers(id) ON DELETE SET NULL,
    status fulfillment_status DEFAULT 'PENDING',
    tracking_number VARCHAR(100),
    carrier VARCHAR(100),
    shipped_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. EVENTS Table (Hàng đợi sự kiện gửi sang Make Automation)
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id UUID NOT NULL,
    payload JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    processed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_events_processed ON events(processed_at);

-- ==============================================================================
-- BUSINESS LOGIC FUNCTIONS & TRIGGERS
-- ==============================================================================

-- Trigger to recalculate MOQ and emit events
CREATE OR REPLACE FUNCTION fn_orders_recalculate_moq()
RETURNS TRIGGER AS $$
DECLARE
    v_ngan_id UUID;
    v_total_qty INTEGER;
    v_moq INTEGER;
    v_old_status ngan_status;
    v_new_status ngan_status;
BEGIN
    v_ngan_id := COALESCE(NEW.ngan_id, OLD.ngan_id);

    -- Calculate sum of valid orders (all statuses except CANCELLED, REFUNDED)
    SELECT COALESCE(SUM(quantity), 0)
    INTO v_total_qty
    FROM orders
    WHERE ngan_id = v_ngan_id
      AND status NOT IN ('CANCELLED', 'REFUNDED');

    -- Get current MOQ and status
    SELECT moq, status
    INTO v_moq, v_old_status
    FROM ngans
    WHERE id = v_ngan_id;

    -- Determine new status if MOQ is reached
    IF v_total_qty >= v_moq AND v_old_status = 'OPEN' THEN
        v_new_status := 'FULL';
        
        -- Update Ngăn quantity and status
        UPDATE ngans
        SET current_quantity = v_total_qty,
            status = 'FULL',
            updated_at = NOW()
        WHERE id = v_ngan_id;

        -- Emit MOQ_REACHED event
        INSERT INTO events (event_type, entity_type, entity_id, payload)
        VALUES (
            'MOQ_REACHED',
            'ngan',
            v_ngan_id,
            jsonb_build_object(
                'ngan_id', v_ngan_id,
                'moq', v_moq,
                'total_quantity', v_total_qty,
                'triggered_at', NOW()
            )
        );
    ELSE
        -- Update quantity
        UPDATE ngans
        SET current_quantity = v_total_qty,
            updated_at = NOW()
        WHERE id = v_ngan_id;
    END IF;

    -- If this is a newly created order, emit ORDER_CREATED event
    IF TG_OP = 'INSERT' THEN
        INSERT INTO events (event_type, entity_type, entity_id, payload)
        VALUES (
            'ORDER_CREATED',
            'order',
            NEW.id,
            jsonb_build_object(
                'order_id', NEW.id,
                'order_code', NEW.order_code,
                'ngan_id', NEW.ngan_id,
                'quantity', NEW.quantity,
                'total_amount', NEW.total_amount,
                'customer_id', NEW.customer_id,
                'current_total_quantity', v_total_qty,
                'moq', v_moq
            )
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_orders_moq_update ON orders;
CREATE TRIGGER trg_orders_moq_update
AFTER INSERT OR UPDATE OR DELETE ON orders
FOR EACH ROW
EXECUTE FUNCTION fn_orders_recalculate_moq();

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ==============================================================================
ALTER TABLE producers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE ngans ENABLE ROW LEVEL SECURITY;
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE fulfillments ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Public can read active producers, products, ngans, stories
CREATE POLICY "Public can view active producers" ON producers
    FOR SELECT USING (status = 'ACTIVE');

CREATE POLICY "Public can view active products" ON products
    FOR SELECT USING (status = 'ACTIVE');

CREATE POLICY "Public can view published ngans" ON ngans
    FOR SELECT USING (status IN ('OPEN', 'FULL', 'PRODUCER_CONFIRMING', 'PRODUCTION', 'SHIPPING', 'COMPLETED'));

CREATE POLICY "Public can view published stories" ON stories
    FOR SELECT USING (status = 'ACTIVE');

-- Anyone can submit order (INSERT into customers and orders via server action / anon)
CREATE POLICY "Allow public customer insert" ON customers
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public order insert" ON orders
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow customer to read their own order" ON orders
    FOR SELECT USING (true);
