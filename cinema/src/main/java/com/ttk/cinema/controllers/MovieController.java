package com.ttk.cinema.controllers;

import com.ttk.cinema.DTOs.request.ApiResponse;
import com.ttk.cinema.DTOs.request.MovieRequest;
import com.ttk.cinema.DTOs.response.MovieResponse;
import com.ttk.cinema.services.MovieService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/movies")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MovieController {
    MovieService movieService;

    @PostMapping
    ApiResponse<MovieResponse> createMovie(@Valid @ModelAttribute MovieRequest request) throws IOException {
        return ApiResponse.<MovieResponse>builder()
                .result(movieService.createMovie(request))
                .build();
    }

    @GetMapping("/{movieId}")
    ApiResponse<MovieResponse> getMovie(@PathVariable String movieId) {
        return ApiResponse.<MovieResponse>builder()
                .result(movieService.getMovie(movieId))
                .build();
    }

    @GetMapping
    ApiResponse<List<MovieResponse>> getAllMovies() {
        return ApiResponse.<List<MovieResponse>>builder()
                .result(movieService.getAllMovies())
                .build();
    }

    @PutMapping("/{movieId}")
    ApiResponse<MovieResponse> updateMovie(@PathVariable String movieId, @Valid @ModelAttribute MovieRequest request) throws IOException {
        return ApiResponse.<MovieResponse>builder()
                .result(movieService.updateMovie(movieId, request))
                .build();
    }

    @DeleteMapping("/{movieId}")
    ApiResponse<Void> deleteMovie(@PathVariable String movieId) {
        movieService.deleteMovie(movieId);
        return ApiResponse.<Void>builder().build();
    }
}
