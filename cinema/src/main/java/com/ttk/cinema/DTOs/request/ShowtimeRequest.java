package com.ttk.cinema.DTOs.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ShowtimeRequest {
    @NotBlank(message = "Start time cannot be empty")
    String startTime;

    @NotBlank(message = "End time cannot be empty")
    String endTime;
}
