package com.ttk.cinema.DTOs.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TicketRequest {
    @NotNull(message = "Ticket price cannot be null")
    Float ticketPrice;

    @NotBlank(message = "Status cannot be empty")
    String status;

    @NotBlank(message = "Booking type cannot be empty")
    String bookingType;

    @NotBlank(message = "Show event cannot be empty")
    String showEvent;    // Liên kết với bảng show_event

    @NotBlank(message = "Seat cannot be empty")
    String seat;    // Liên kết với bảng seat

    @NotBlank(message = "Customer cannot be empty")
    String customer; // Liên kết với bảng user

    String staff;    // Liên kết với bảng user

    @NotBlank(message = "Movie cannot be empty")
    String movie;    // Liên kết với bảng movie
}
