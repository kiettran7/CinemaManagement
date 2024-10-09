package com.ttk.cinema.controllers;

import com.ttk.cinema.DTOs.request.ApiResponse;
import com.ttk.cinema.DTOs.request.GenreRequest;
import com.ttk.cinema.DTOs.response.GenreResponse;
import com.ttk.cinema.services.GenreService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/genres")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class GenreController {
    GenreService genreService;

    @PostMapping
    ApiResponse<GenreResponse> createGenre(@Valid @RequestBody GenreRequest request) {
        return ApiResponse.<GenreResponse>builder()
                .result(genreService.createGenre(request))
                .build();
    }

    @GetMapping("/{genreId}")
    ApiResponse<GenreResponse> getGenre(@PathVariable String genreId) {
        return ApiResponse.<GenreResponse>builder()
                .result(genreService.getGenre(genreId))
                .build();
    }

    @GetMapping
    ApiResponse<List<GenreResponse>> getAllGenres() {
        return ApiResponse.<List<GenreResponse>>builder()
                .result(genreService.getAllGenres())
                .build();
    }

    @PutMapping("/{genreId}")
    ApiResponse<GenreResponse> updateGenre(@PathVariable String genreId,
                                           @Valid @RequestBody GenreRequest request) {
        return ApiResponse.<GenreResponse>builder()
                .result(genreService.updateGenre(genreId, request))
                .build();
    }

    @DeleteMapping("/{genreId}")
    ApiResponse<Void> deleteGenre(@PathVariable String genreId) {
        genreService.deleteGenre(genreId);
        return ApiResponse.<Void>builder().build();
    }
}