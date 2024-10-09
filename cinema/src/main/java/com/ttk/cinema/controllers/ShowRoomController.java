package com.ttk.cinema.controllers;

import com.ttk.cinema.DTOs.request.ApiResponse;
import com.ttk.cinema.DTOs.request.ShowRoomRequest;
import com.ttk.cinema.DTOs.response.ShowRoomResponse;
import com.ttk.cinema.services.ShowRoomService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/show-rooms")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ShowRoomController {
    ShowRoomService showRoomService;

    @PostMapping
    ApiResponse<ShowRoomResponse> createShowRoom(@RequestBody ShowRoomRequest request) {
        return ApiResponse.<ShowRoomResponse>builder()
                .result(showRoomService.createShowRoom(request))
                .build();
    }

    @GetMapping("/{showRoomId}")
    ApiResponse<ShowRoomResponse> getShowRoom(@PathVariable String showRoomId) {
        return ApiResponse.<ShowRoomResponse>builder()
                .result(showRoomService.getShowRoom(showRoomId))
                .build();
    }

    @GetMapping
    ApiResponse<List<ShowRoomResponse>> getAllShowRooms() {
        return ApiResponse.<List<ShowRoomResponse>>builder()
                .result(showRoomService.getAllShowRooms())
                .build();
    }

    @PutMapping("/{showRoomId}")
    ApiResponse<ShowRoomResponse> updateShowRoom(@PathVariable String showRoomId,
                                                 @RequestBody ShowRoomRequest request) {
        return ApiResponse.<ShowRoomResponse>builder()
                .result(showRoomService.updateShowRoom(showRoomId, request))
                .build();
    }

    @DeleteMapping("/{showRoomId}")
    ApiResponse<Void> deleteShowRoom(@PathVariable String showRoomId) {
        showRoomService.deleteShowRoom(showRoomId);
        return ApiResponse.<Void>builder().build();
    }
}