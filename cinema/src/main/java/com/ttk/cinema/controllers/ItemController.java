package com.ttk.cinema.controllers;

import com.ttk.cinema.DTOs.request.ApiResponse;
import com.ttk.cinema.DTOs.request.ItemRequest;
import com.ttk.cinema.DTOs.response.ItemResponse;
import com.ttk.cinema.services.ItemService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/items")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ItemController {
    ItemService itemService;

    @PostMapping
    ApiResponse<ItemResponse> createItem(@Valid @RequestBody ItemRequest request) {
        return ApiResponse.<ItemResponse>builder()
                .result(itemService.createItem(request))
                .build();
    }

    @GetMapping("/{itemId}")
    ApiResponse<ItemResponse> getItem(@PathVariable String itemId) {
        return ApiResponse.<ItemResponse>builder()
                .result(itemService.getItem(itemId))
                .build();
    }

    @GetMapping
    ApiResponse<List<ItemResponse>> getAllItems() {
        return ApiResponse.<List<ItemResponse>>builder()
                .result(itemService.getAllItems())
                .build();
    }

    @PutMapping("/{itemId}")
    ApiResponse<ItemResponse> updateItem(@PathVariable String itemId,
                                         @Valid @RequestBody ItemRequest request) {
        return ApiResponse.<ItemResponse>builder()
                .result(itemService.updateItem(itemId, request))
                .build();
    }

    @DeleteMapping("/{itemId}")
    ApiResponse<Void> deleteItem(@PathVariable String itemId) {
        itemService.deleteItem(itemId);
        return ApiResponse.<Void>builder().build();
    }
}