package com.ttk.cinema.DTOs.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PromotionRequest {
    @NotBlank(message = "Promotion name cannot be empty")
    String promotionName; // Tên khuyến mãi

    @NotNull(message = "Discount value cannot be null")
    @Positive(message = "Discount value must be a positive number")
    Float discountValue; // Giá trị giảm giá
}
