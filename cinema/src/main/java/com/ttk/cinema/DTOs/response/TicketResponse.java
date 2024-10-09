package com.ttk.cinema.DTOs.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TicketResponse {
    String id;
    Float ticketPrice;
    LocalDateTime createdDate;
    String status;
    String bookingType;
    ShowEventResponse showEvent; // Liên kết với show_event
    SeatResponse seat;      // Liên kết với seat
    UserResponse customer;  // Liên kết với user
    UserResponse staff;     // Liên kết với user
    MovieResponse movie;    // Liên kết với movie
    BillResponse bill;    // Liên kết với movie
}