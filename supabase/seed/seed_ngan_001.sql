-- ==============================================================================
-- GẠC MĂNG RÊ — Seed Data: Golden Sample Ngăn #001
-- Sản vật: Mật ong rừng hoa bạc hà cao nguyên đá Hà Giang
-- ==============================================================================

DO $$
DECLARE
    v_producer_id UUID := 'a1111111-1111-1111-1111-111111111111';
    v_product_id  UUID := 'b2222222-2222-2222-2222-222222222222';
    v_ngan_id     UUID := 'c3333333-3333-3333-3333-333333333333';
    v_story_id    UUID := 'd4444444-4444-4444-4444-444444444444';
BEGIN

    -- 1. Producer: Anh Giàng A Páo (Hà Giang)
    INSERT INTO producers (id, name, slug, brand_name, location, description, story, avatar, phone, zalo, capacity, status)
    VALUES (
        v_producer_id,
        'Giàng A Páo',
        'giang-a-pao-ha-giang',
        'Tổ ong đá Đồng Văn',
        'Mèo Vạc, Hà Giang',
        'Người gắn bó hơn 18 năm với đàn ong nội địa trên triền đá tai mèo cheo leo.',
        'Mỗi mùa gió bấc ùa về cao nguyên đá, khi cây bạc hà dại nở những nụ hoa phớt tím trong sương muối, là lúc A Páo mang từng thùng ong gỗ mộc lên lưng chừng núi. Không pha đường, không đun sôi hạ thủy phần công nghiệp, mật của anh giữ nguyên phấn hoa và men tự nhiên.',
        'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=800&auto=format&fit=crop',
        '0912345678',
        '0912345678',
        100,
        'ACTIVE'
    ) ON CONFLICT (id) DO NOTHING;

    -- 2. Product: Mật ong rừng bạc hà dại
    INSERT INTO products (id, producer_id, name, slug, description, origin, unit, weight, price, ingredients, storage, expiry, certifications, status)
    VALUES (
        v_product_id,
        v_producer_id,
        'Mật ong bạc hà cao nguyên đá',
        'mat-ong-bac-ha-cao-nguyen-da',
        'Mật ong khai thác từ hoa bạc hà mọc hoang dã trên hốc đá vôi ở độ cao trên 1.200m.',
        'Đồng Văn & Mèo Vạc, Hà Giang',
        'Chai thuỷ tinh 500ml',
        '700g',
        280000,
        '100% Mật ong hoa bạc hà tự nhiên thô (chưa qua xử lý nhiệt công nghiệp)',
        'Bảo quản nơi khô ráo, thoáng mát, tránh ánh nắng trực tiếp. Không để trong ngăn mát tủ lạnh.',
        '24 tháng kể từ ngày quay mật',
        'Chỉ dẫn địa lý Hà Giang · Kiểm nghiệm vi sinh & thủy phần đạt chuẩn',
        'ACTIVE'
    ) ON CONFLICT (id) DO NOTHING;

    -- 3. Ngăn #001: Mở Ngăn Mật Ong Hà Giang
    INSERT INTO ngans (
        id, number, slug, product_id, title, short_description, price, moq, current_quantity,
        open_at, deadline, status, hero_image, gallery,
        selection_dat, selection_nguoi, selection_vi, selection_chuyen, shipping_estimate
    )
    VALUES (
        v_ngan_id,
        '#001',
        'ngan-001-mat-ong-bac-ha-ha-giang',
        v_product_id,
        'Mật ong bạc hà hoa dại Hà Giang',
        'Được chắt chiu từ những thung lũng đá tai mèo lạnh buốt mùa đông. Màu vàng chanh ánh xanh, vị ngọt thanh mát sâu cổ họng.',
        280000,
        100,
        74, -- Đã gom 74/100 phần ở mốc mẫu
        NOW() - INTERVAL '3 days',
        NOW() + INTERVAL '7 days',
        'OPEN',
        'https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=1200&auto=format&fit=crop',
        '[
            "https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=1200&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?q=80&w=1200&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?q=80&w=1200&auto=format&fit=crop"
        ]'::jsonb,
        'Thổ nhưỡng đá vôi khô cằn trên độ cao 1.200m tạo nên loài hoa bạc hà dại tím ngát đặc hữu chỉ nở vào mùa đông lạnh nhất năm.',
        'Anh Giàng A Páo — người Mông giữ phương thức quay mật truyền thống: chỉ lấy mật khi tàng ong vít nắp 100%, tuyệt đối không vắt ép vội vã.',
        'Vị ngọt dịu thanh, không gắt họng như mật hoa nhãn, thoang thoảng hương thảo mộc the nhẹ ở hậu vị.',
        'Chuyến đi 6 ngày qua 4 con đèo cao của Gạc Măng Rê để tìm người giữ được đúng mẻ mật sánh nguyên bản không pha tạp chất.',
        '18–20/10/2026'
    ) ON CONFLICT (id) DO NOTHING;

    -- 4. Story: Bài viết kể chuyện
    INSERT INTO stories (
        id, title, slug, type, excerpt, content, cover_image, producer_id, product_id, published_at, status
    )
    VALUES (
        v_story_id,
        'Hương hoa dại nở trên vách đá tai mèo Mèo Vạc',
        'huong-hoa-dai-no-tren-vach-da-tai-meo-meo-vac',
        'ARTICLE',
        'Ở nơi chỉ có đá xám và gió lạnh, có một thứ mật ngọt màu xanh chanh kì lạ được chắt chiu từ sự nhẫn nại của con người và loài ong bản địa.',
        'Mùa đông ở cao nguyên đá không có màu của sự sống vội vã. Tất cả thu mình lại dưới lớp sương muối đặc quánh. Nhưng chính trong cái rét căm căm ấy, những vạt hoa bạc hà dại lại bừng nở tím ngát khắp các triền đá nứt nẻ.

Chúng tôi tìm đến lán của anh Giàng A Páo khi sương chiều vừa buông. Trong gian nhà đất ám mùi khói củi, những bình mật ong sóng sánh màu vàng chanh ánh xanh được xếp ngay ngắn trên kệ gỗ. 

"Mật này một năm chỉ có đúng một vụ vào tháng 10 tới tháng 12 âm lịch," anh Páo vừa rót mời chúng tôi ngụm trà nóng pha mật, vừa cười bảo. "Nếu ham lấy nhiều mà vắt non, mật sẽ loãng và chua. Phải đợi đàn ong quạt cánh cô đặc, vít kín sáp tổ lại mới được hạ tầng quay."

Ngụm mật đầu tiên tan trên đầu lưỡi mang đến cảm giác hoàn toàn khác biệt: không ngọt khé, không nồng mùi hương liệu, mà thanh mát, có một chút the nhẹ như gió sớm thổi qua rặng cây.

Đó là lý do Gạc Măng Rê quyết định mở Ngăn #001: đưa hương vị chân thật của triền đá Hà Giang về đúng căn bếp của những người biết trân trọng sự tử tế.',
        'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?q=80&w=1200&auto=format&fit=crop',
        v_producer_id,
        v_product_id,
        NOW() - INTERVAL '3 days',
        'ACTIVE'
    ) ON CONFLICT (id) DO NOTHING;

END $$;
