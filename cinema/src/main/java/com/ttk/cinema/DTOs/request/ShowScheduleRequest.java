package com.ttk.cinema.DTOs.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ShowScheduleRequest {
    @NotBlank(message = "Show date cannot be empty")
    LocalDate showDate;
//    String movie; // Liên kết với bảng movie
}
