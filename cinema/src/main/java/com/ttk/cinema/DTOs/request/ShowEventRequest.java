package com.ttk.cinema.DTOs.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ShowEventRequest {
    @NotBlank(message = "Showtime cannot be empty")
    String showtime; // Liên kết với bảng showtime

    @NotBlank(message = "ShowRoom cannot be empty")
    String showRoom; // Liên kết với bảng showRoom

    @NotBlank(message = "ShowSchedule cannot be empty")
    String showSchedule; // Liên kết với bảng showSchedule
}
