package com.ttk.cinema.DTOs.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SeatRequest {
    @NotBlank(message = "Seat name cannot be empty")
    String seatName; // Tên ghế

    @NotBlank(message = "Showroom cannot be empty")
    String showRoom; // Liên kết với bảng show_room
}