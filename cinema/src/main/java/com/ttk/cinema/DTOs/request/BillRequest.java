package com.ttk.cinema.DTOs.request;

import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BillRequest {
    String promotion; // Liên kết với bảng promotion

    @NotNull(message = "Tickets cannot be null")
    Set<String> tickets;    // Liên kết với bảng ticket

    List<String> items; // Liên kết với items
}