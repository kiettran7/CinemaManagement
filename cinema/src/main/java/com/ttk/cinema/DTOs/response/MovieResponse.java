package com.ttk.cinema.DTOs.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MovieResponse {
    String id;
    String movieImage;
    String movieName;
    float moviePrice;
    int duration;
    String status;
    Set<GenreResponse> genres; // Thay đổi từ Set<Long> thành Set<GenreResponse>
    Set<TagResponse> tags;     // Thay đổi từ Set<Long> thành Set<TagResponse>
    Set<ShowEventResponse> showEvents;
}
