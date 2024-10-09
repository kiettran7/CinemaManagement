package com.ttk.cinema.DTOs.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ShowEventResponse {
    String id;
    ShowtimeResponse showtime;  // Liên kết với showtime
    ShowRoomResponse showRoom;   // Liên kết với show room
    ShowScheduleResponse showSchedule;   // Liên kết với show schedule
}
