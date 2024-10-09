package com.ttk.cinema.controllers;

import com.ttk.cinema.DTOs.request.ApiResponse;
import com.ttk.cinema.DTOs.request.SeatRequest;
import com.ttk.cinema.DTOs.response.SeatResponse;
import com.ttk.cinema.services.SeatService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/seats")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SeatController {
    SeatService seatService;

    @PostMapping
    ApiResponse<SeatResponse> createSeat(@RequestBody SeatRequest request) {
        return ApiResponse.<SeatResponse>builder()
                .result(seatService.createSeat(request))
                .build();
    }

    @GetMapping("/{seatId}")
    ApiResponse<SeatResponse> getSeat(@PathVariable String seatId) {
        return ApiResponse.<SeatResponse>builder()
                .result(seatService.getSeat(seatId))
                .build();
    }

    @GetMapping
    ApiResponse<List<SeatResponse>> getAllSeats() {
        return ApiResponse.<List<SeatResponse>>builder()
                .result(seatService.getAllSeats())
                .build();
    }

    @PutMapping("/{seatId}")
    ApiResponse<SeatResponse> updateSeat(@PathVariable String seatId,
                                         @RequestBody SeatRequest request) {
        return ApiResponse.<SeatResponse>builder()
                .result(seatService.updateSeat(seatId, request))
                .build();
    }

    @DeleteMapping("/{seatId}")
    ApiResponse<Void> deleteSeat(@PathVariable String seatId) {
        seatService.deleteSeat(seatId);
        return ApiResponse.<Void>builder().build();
    }
}