package com.ttk.cinema.DTOs.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CommentRequest {
    @NotBlank(message = "Content cannot be empty")
    String content;

    @NotBlank(message = "Movie cannot be null or empty")
    String movie; // Liên kết với bảng movie

    @NotBlank(message = "User cannot be null or empty")
    String user; // Liên kết với bảng user
}