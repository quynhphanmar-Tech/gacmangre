-- ==============================================================================
-- GẠC MĂNG RÊ — M2 Order Engine & Atomic Concurrency Migration
-- Version: 2.0
-- ==============================================================================

-- 1. Create Order Code Sequence: GM-2026-000001...
CREATE SEQUENCE IF NOT EXISTS order_code_seq START WITH 74;

-- 2. Add idempotency_key to orders table for double-click/network retry protection
ALTER TABLE orders ADD COLUMN IF NOT EXISTS idempotency_key VARCHAR(100) UNIQUE;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS landing_url TEXT;

-- 3. Atomic Order Creation Function with Row Locking
CREATE OR REPLACE FUNCTION fn_create_order_atomic(
    p_ngan_id UUID,
    p_customer_name VARCHAR(255),
    p_customer_phone VARCHAR(50),
    p_customer_zalo VARCHAR(100),
    p_customer_address TEXT,
    p_customer_province VARCHAR(100),
    p_quantity INTEGER,
    p_idempotency_key VARCHAR(100),
    p_note TEXT DEFAULT NULL,
    p_source VARCHAR(100) DEFAULT 'DIRECT',
    p_utm_source VARCHAR(100) DEFAULT NULL,
    p_utm_medium VARCHAR(100) DEFAULT NULL,
    p_utm_campaign VARCHAR(100) DEFAULT NULL,
    p_utm_content VARCHAR(100) DEFAULT NULL,
    p_landing_url TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
    v_ngan RECORD;
    v_current_confirmed INTEGER;
    v_customer_id UUID;
    v_order_id UUID;
    v_order_code VARCHAR(50);
    v_unit_price NUMERIC(12, 2);
    v_total_amount NUMERIC(12, 2);
    v_existing_order RECORD;
    v_new_total INTEGER;
    v_year VARCHAR(4);
    v_seq_num BIGINT;
BEGIN
    -- A. Idempotency Check: if this key already generated an order, return it immediately
    IF p_idempotency_key IS NOT NULL THEN
        SELECT o.id, o.order_code, o.quantity, o.total_amount, o.status, n.moq, n.number AS ngan_number
        INTO v_existing_order
        FROM orders o
        JOIN ngans n ON n.id = o.ngan_id
        WHERE o.idempotency_key = p_idempotency_key;

        IF FOUND THEN
            -- Calculate current total confirmed
            SELECT COALESCE(SUM(quantity), 0) INTO v_new_total
            FROM orders
            WHERE ngan_id = p_ngan_id AND status NOT IN ('CANCELLED', 'REFUNDED');

            RETURN jsonb_build_object(
                'success', true,
                'is_duplicate', true,
                'order_id', v_existing_order.id,
                'order_code', v_existing_order.order_code,
                'quantity', v_existing_order.quantity,
                'total_amount', v_existing_order.total_amount,
                'ngan_number', v_existing_order.ngan_number,
                'current_total_quantity', v_new_total,
                'moq', v_existing_order.moq
            );
        END IF;
    END IF;

    -- B. Lock the Ngăn row to prevent race conditions during concurrent orders
    SELECT * INTO v_ngan
    FROM ngans
    WHERE id = p_ngan_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object(
            'success', false,
            'error_code', 'NGAN_NOT_FOUND',
            'error_message', 'Ngăn không tồn tại.'
        );
    END IF;

    -- C. Check if Ngăn accepts orders
    IF v_ngan.status != 'OPEN' THEN
        RETURN jsonb_build_object(
            'success', false,
            'error_code', 'NGAN_CLOSED',
            'error_message', 'Ngăn này hiện không còn nhận đơn.'
        );
    END IF;

    -- D. Calculate real confirmed quantity from valid orders
    SELECT COALESCE(SUM(quantity), 0)
    INTO v_current_confirmed
    FROM orders
    WHERE ngan_id = p_ngan_id
      AND status NOT IN ('CANCELLED', 'REFUNDED');

    -- E. Check capacity: prevent over-ordering past MOQ
    IF v_current_confirmed + p_quantity > v_ngan.moq THEN
        RETURN jsonb_build_object(
            'success', false,
            'error_code', 'QUANTITY_UNAVAILABLE',
            'error_message', 'Số lượng bạn chọn đã vượt quá phần còn lại của Ngăn.',
            'remaining_capacity', GREATEST(0, v_ngan.moq - v_current_confirmed)
        );
    END IF;

    -- F. Server-side price retrieval (never trust client price)
    v_unit_price := v_ngan.price;
    v_total_amount := v_unit_price * p_quantity;

    -- G. Generate Sequential Order Code: GM-YYYY-000001
    v_year := TO_CHAR(NOW(), 'YYYY');
    v_seq_num := nextval('order_code_seq');
    v_order_code := 'GM-' || v_year || '-' || LPAD(v_seq_num::TEXT, 6, '0');

    -- H. Upsert Customer Record
    INSERT INTO customers (
        name, phone, zalo_identifier, address, province, source,
        utm_source, utm_medium, utm_campaign, utm_content
    )
    VALUES (
        TRIM(p_customer_name),
        TRIM(p_customer_phone),
        COALESCE(TRIM(p_customer_zalo), TRIM(p_customer_phone)),
        TRIM(p_customer_address),
        COALESCE(p_customer_province, 'Toàn quốc'),
        COALESCE(p_source, 'DIRECT'),
        p_utm_source, p_utm_medium, p_utm_campaign, p_utm_content
    )
    RETURNING id INTO v_customer_id;

    -- I. Insert Order Record
    INSERT INTO orders (
        order_code,
        customer_id,
        ngan_id,
        quantity,
        unit_price,
        total_amount,
        status,
        payment_status,
        note,
        source,
        utm_source,
        utm_medium,
        utm_campaign,
        utm_content,
        idempotency_key,
        landing_url
    )
    VALUES (
        v_order_code,
        v_customer_id,
        p_ngan_id,
        p_quantity,
        v_unit_price,
        v_total_amount,
        'CONFIRMED',
        'UNPAID', -- PM Lock: no payment gateway yet, pure demand signal
        p_note,
        COALESCE(p_source, 'DIRECT'),
        p_utm_source,
        p_utm_medium,
        p_utm_campaign,
        p_utm_content,
        p_idempotency_key,
        p_landing_url
    )
    RETURNING id INTO v_order_id;

    -- J. Recalculate new total
    v_new_total := v_current_confirmed + p_quantity;

    -- K. Check if Ngăn reaches FULL
    IF v_new_total >= v_ngan.moq THEN
        UPDATE ngans
        SET current_quantity = v_new_total,
            status = 'FULL',
            updated_at = NOW()
        WHERE id = p_ngan_id;

        -- Emit MOQ_REACHED event for future M3 automation
        INSERT INTO events (event_type, entity_type, entity_id, payload)
        VALUES (
            'MOQ_REACHED',
            'ngan',
            p_ngan_id,
            jsonb_build_object(
                'ngan_id', p_ngan_id,
                'moq', v_ngan.moq,
                'total_quantity', v_new_total,
                'triggered_at', NOW()
            )
        );
    ELSE
        UPDATE ngans
        SET current_quantity = v_new_total,
            updated_at = NOW()
        WHERE id = p_ngan_id;
    END IF;

    -- L. Return full successful order result
    RETURN jsonb_build_object(
        'success', true,
        'is_duplicate', false,
        'order_id', v_order_id,
        'order_code', v_order_code,
        'quantity', p_quantity,
        'unit_price', v_unit_price,
        'total_amount', v_total_amount,
        'ngan_number', v_ngan.number,
        'current_total_quantity', v_new_total,
        'moq', v_ngan.moq,
        'is_full', (v_new_total >= v_ngan.moq)
    );
END;
$$ LANGUAGE plpgsql;
