# GẠC MĂNG RÊ — AUTOMATION & COMMUNICATION MAP

## 1. Kiến trúc luồng Tự động hóa qua Make (Integromat)

```text
Database Event (events table in Supabase)
     │
     ↓ (HTTP POST Webhook with Secret Header)
Make Router Scenario
     │
     ├── Event: ORDER_CREATED       ──→ Bắn Zalo xác nhận đơn cho Khách
     ├── Event: MOQ_REACHED         ──→ Bắn Zalo báo Ngăn đầy cho Khách & Link xác nhận cho Nhà sản xuất
     ├── Event: PRODUCER_CONFIRMED  ──→ Bắn Zalo cập nhật mẻ hàng đã bắt đầu chuẩn bị
     ├── Event: ORDER_SHIPPED       ──→ Bắn Zalo kèm Mã vận đơn & dự kiến ngày nhận
     └── Event: ORDER_DELIVERED     ──→ Bắn Zalo hỏi thăm trải nghiệm & thu thập "Hậu vị"
```

## 2. Kịch bản Bản tin Zalo (Transactional Messaging Specs)

### Kịch bản 1: Khi khách đặt thành công (`ORDER_CREATED`)
> **GẠC MĂNG RÊ**  
> Chào {{customer_name}}, bạn vừa đặt **{{quantity}} phần {{product_name}}** – Ngăn #{{ngan_number}}.  
> Mã đơn: **{{order_code}}**.  
> Hiện Ngăn này đã gom được **{{current_quantity}}/{{moq}} phần**.  
> Chúng tôi sẽ gửi thông báo đến bạn ngay khi Ngăn đủ đầy để người làm bắt đầu mẻ mới!

### Kịch bản 2: Khi Ngăn chạm mốc MOQ (`MOQ_REACHED`)
* **Gửi tới Khách hàng:**
  > 🗄 **NGĂN ĐÃ ĐẦY**  
  > Cảm ơn bạn đã cùng mở Ngăn #{{ngan_number}}!  
  > Toàn bộ {{moq}} phần đã được gom đủ. Nhà sản xuất đã nhận thông tin và bắt đầu chuẩn bị mẻ tươi ngon nhất.  
  > Dự kiến giao hàng: **{{shipping_estimate}}**.
* **Gửi tới Nhà sản xuất:**
  > 🐝 **GẠC MĂNG RÊ THÔNG BÁO MẺ HÀNG**  
  > Chào anh/chị {{producer_name}}, Ngăn #{{ngan_number}} ({{product_name}}) đã gom đủ **{{moq}} phần**!  
  > Kính nhờ anh/chị bấm xác nhận khả năng cung ứng để chúng tôi báo tin cho khách hàng:  
  > 👉 [ XÁC NHẬN CUNG ỨNG ]({{confirmation_url}})

### Kịch bản 3: Khi Nhà sản xuất xác nhận (`PRODUCER_CONFIRMED`)
> **GẠC MĂNG RÊ**  
> Tin vui từ {{producer_name}}: Người làm tại {{location}} đã chính thức xác nhận chuẩn bị mẻ sản vật của bạn. Từng chai/phần quà đang được đóng gói nâng niu.

### Kịch bản 4: Khi đơn hàng được xuất kho vận chuyển (`ORDER_SHIPPED`)
> 📦 **Ngăn của bạn đang trên đường về bếp!**  
> Đơn hàng: **{{order_code}}**  
> Đơn vị vận chuyển: {{carrier}} — Mã vận đơn: **{{tracking_number}}**.

### Kịch bản 5: Khi giao hàng thành công & xin cảm nhận (`ORDER_DELIVERED`)
> **Ngăn đã về đến nhà chưa?**  
> Món quà quê từ đất {{origin}} hy vọng mang lại cho bạn một vị ngon trọn vẹn và an lành.  
> Nếu có một điều bạn thích nhất ở sản vật này, hãy kể cho Gạc Măng Rê nghe nhé.
