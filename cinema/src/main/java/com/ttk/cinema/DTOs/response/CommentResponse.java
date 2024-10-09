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
public class CommentResponse {
    String id;
    String content;
    String sentiment;
    String modelResponse;
    LocalDate createdDate;
    MovieResponse movie; // Liên kết với Movie
    UserResponse user; // Liên kết với User
}
