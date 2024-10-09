package com.ttk.cinema.DTOs.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MovieRequest {
    @NotBlank(message = "Movie name cannot be empty")
    String movieName; // Tên phim

    @NotNull(message = "Movie price cannot be null")
    @Positive(message = "Movie price must be a positive number")
    long moviePrice; // Giá phim

    @NotNull(message = "Duration cannot be null")
    @Positive(message = "Duration must be a positive number")
    int duration; // Thời gian phim

    @NotBlank(message = "Status cannot be empty")
    String status; // Trạng thái phim

    MultipartFile file;
    Set<String> genres;
    Set<String> tags;
    Set<String> showEvents;
}