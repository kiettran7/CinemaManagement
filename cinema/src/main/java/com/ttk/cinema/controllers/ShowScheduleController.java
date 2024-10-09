package com.ttk.cinema.controllers;

import com.ttk.cinema.DTOs.request.ApiResponse;
import com.ttk.cinema.DTOs.request.ShowScheduleRequest;
import com.ttk.cinema.DTOs.response.ShowScheduleResponse;
import com.ttk.cinema.services.ShowScheduleService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/show-schedules")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ShowScheduleController {
    ShowScheduleService showScheduleService;

    @PostMapping
    ApiResponse<ShowScheduleResponse> createShowSchedule(@RequestBody ShowScheduleRequest request) {
        return ApiResponse.<ShowScheduleResponse>builder()
                .result(showScheduleService.createShowSchedule(request))
                .build();
    }

    @GetMapping("/{showScheduleId}")
    ApiResponse<ShowScheduleResponse> getShowSchedule(@PathVariable String showScheduleId) {
        return ApiResponse.<ShowScheduleResponse>builder()
                .result(showScheduleService.getShowSchedule(showScheduleId))
                .build();
    }

    @GetMapping
    ApiResponse<List<ShowScheduleResponse>> getAllShowSchedules() {
        return ApiResponse.<List<ShowScheduleResponse>>builder()
                .result(showScheduleService.getAllShowSchedules())
                .build();
    }

    @PutMapping("/{showScheduleId}")
    ApiResponse<ShowScheduleResponse> updateShowSchedule(@PathVariable String showScheduleId,
                                                         @RequestBody ShowScheduleRequest request) {
        return ApiResponse.<ShowScheduleResponse>builder()
                .result(showScheduleService.updateShowSchedule(showScheduleId, request))
                .build();
    }

    @DeleteMapping("/{showScheduleId}")
    ApiResponse<Void> deleteShowSchedule(@PathVariable String showScheduleId) {
        showScheduleService.deleteShowSchedule(showScheduleId);
        return ApiResponse.<Void>builder().build();
    }
}