package com.ttk.cinema.POJOs;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.web.multipart.MultipartFile;

import java.util.Set;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
public class Movie {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;
    String movieImage;

    @Transient
    @JsonIgnore
    MultipartFile file;

    float moviePrice;
    String movieName;
    int duration; // Thời lượng phim
    String status; // NOW_SHOWING, UPCOMING, ARCHIVED

    @ManyToMany
    Set<Tag> tags;

    @ManyToMany
    Set<Genre> genres;

    @ManyToMany
    Set<ShowEvent> showEvents;
}
