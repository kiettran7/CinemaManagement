package com.ttk.cinema.DTOs.response;

import jakarta.persistence.Column;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BillResponse {
    String id;
    Float totalAmount;
    Float customerPaid;
    String pdfUrl;
    String vnp_TmnCode;
    PromotionResponse promotion; // Liên kết với promotion
    Set<ItemResponse> items;
}
