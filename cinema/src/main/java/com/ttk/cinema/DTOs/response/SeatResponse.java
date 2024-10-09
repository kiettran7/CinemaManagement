package com.ttk.cinema.DTOs.response;

import com.ttk.cinema.POJOs.ShowRoom;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SeatResponse {
    String id;
    String seatName;
    ShowRoomResponse showRoom; // Liên kết với show_room
}
