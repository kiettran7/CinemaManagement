package com.ttk.cinema.DTOs.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TicketRequest {
    Float ticketPrice;
    String status;
    String bookingType;
    String showEvent;    // Liên kết với bảng show_event
    String seat;    // Liên kết với bảng seat
    String customer; // Liên kết với bảng user
    String staff;    // Liên kết với bảng user
    String movie;    // Liên kết với bảng movie
}
