package com.ttk.cinema.DTOs.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ShowScheduleRequest {
    LocalDate showDate;
//    String movie; // Liên kết với bảng movie
}
