package com.ttk.cinema.controllers;

import com.ttk.cinema.DTOs.request.ApiResponse;
import com.ttk.cinema.DTOs.request.ShowtimeRequest;
import com.ttk.cinema.DTOs.response.ShowtimeResponse;
import com.ttk.cinema.services.ShowtimeService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/showtimes")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ShowtimeController {
    ShowtimeService showtimeService;

    @PostMapping
    ApiResponse<ShowtimeResponse> createShowtime(@Valid @RequestBody ShowtimeRequest request) {
        return ApiResponse.<ShowtimeResponse>builder()
                .result(showtimeService.createShowtime(request))
                .build();
    }

    @GetMapping("/{showtimeId}")
    ApiResponse<ShowtimeResponse> getShowtime(@PathVariable String showtimeId) {
        return ApiResponse.<ShowtimeResponse>builder()
                .result(showtimeService.getShowtime(showtimeId))
                .build();
    }

    @GetMapping
    ApiResponse<List<ShowtimeResponse>> getAllShowtimes() {
        return ApiResponse.<List<ShowtimeResponse>>builder()
                .result(showtimeService.getAllShowtimes())
                .build();
    }

    @PutMapping("/{showtimeId}")
    ApiResponse<ShowtimeResponse> updateShowtime(@PathVariable String showtimeId,
                                                 @Valid @RequestBody ShowtimeRequest request) {
        return ApiResponse.<ShowtimeResponse>builder()
                .result(showtimeService.updateShowtime(showtimeId, request))
                .build();
    }

    @DeleteMapping("/{showtimeId}")
    ApiResponse<Void> deleteShowtime(@PathVariable String showtimeId) {
        showtimeService.deleteShowtime(showtimeId);
        return ApiResponse.<Void>builder().build();
    }
}