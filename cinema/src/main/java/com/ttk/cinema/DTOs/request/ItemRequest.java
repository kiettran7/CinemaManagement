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
public class ItemRequest {
    @NotBlank(message = "Item name cannot be empty")
    String itemName; // Tên mặt hàng

    @NotBlank(message = "Item type cannot be empty")
    String itemType; // Loại mặt hàng

    @NotNull(message = "Item price cannot be null")
    @Positive(message = "Item price must be a positive number")
    float itemPrice; // Giá mặt hàng
}