package com.ttk.cinema.controllers;

import com.ttk.cinema.DTOs.request.ApiResponse;
import com.ttk.cinema.DTOs.request.ShowEventRequest;
import com.ttk.cinema.DTOs.response.ShowEventResponse;
import com.ttk.cinema.services.ShowEventService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/show-events")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ShowEventController {
    ShowEventService showEventService;

    @PostMapping
    ApiResponse<ShowEventResponse> createShowEvent(@RequestBody ShowEventRequest request) {
        return ApiResponse.<ShowEventResponse>builder()
                .result(showEventService.createShowEvent(request))
                .build();
    }

    @GetMapping("/{showEventId}")
    ApiResponse<ShowEventResponse> getShowEvent(@PathVariable String showEventId) {
        return ApiResponse.<ShowEventResponse>builder()
                .result(showEventService.getShowEvent(showEventId))
                .build();
    }

    @GetMapping
    ApiResponse<List<ShowEventResponse>> getAllShowEvents() {
        return ApiResponse.<List<ShowEventResponse>>builder()
                .result(showEventService.getAllShowEvents())
                .build();
    }

    @PutMapping("/{showEventId}")
    ApiResponse<ShowEventResponse> updateShowEvent(@PathVariable String showEventId,
                                                 @RequestBody ShowEventRequest request) {
        return ApiResponse.<ShowEventResponse>builder()
                .result(showEventService.updateShowEvent(showEventId, request))
                .build();
    }

    @DeleteMapping("/{showEventId}")
    ApiResponse<Void> deleteShowRoom(@PathVariable String showEventId) {
        showEventService.deleteShowEvent(showEventId);
        return ApiResponse.<Void>builder().build();
    }
}