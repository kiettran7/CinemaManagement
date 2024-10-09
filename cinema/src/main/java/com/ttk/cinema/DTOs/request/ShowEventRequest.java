package com.ttk.cinema.DTOs.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ShowEventRequest {
    String showtime; //bang showtime
    String showRoom; //bang showRoom
    String showSchedule; //bang showSchedule
}
