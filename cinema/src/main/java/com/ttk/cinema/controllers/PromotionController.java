package com.ttk.cinema.controllers;

import com.ttk.cinema.DTOs.request.ApiResponse;
import com.ttk.cinema.DTOs.request.PromotionRequest;
import com.ttk.cinema.DTOs.response.PromotionResponse;
import com.ttk.cinema.services.PromotionService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/promotions")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PromotionController {
    PromotionService promotionService;

    @PostMapping
    ApiResponse<PromotionResponse> createPromotion(@Valid @RequestBody PromotionRequest request) {
        return ApiResponse.<PromotionResponse>builder()
                .result(promotionService.createPromotion(request))
                .build();
    }

    @GetMapping("/{promotionId}")
    ApiResponse<PromotionResponse> getPromotion(@PathVariable String promotionId) {
        return ApiResponse.<PromotionResponse>builder()
                .result(promotionService.getPromotion(promotionId))
                .build();
    }

    @GetMapping
    ApiResponse<List<PromotionResponse>> getAllPromotions() {
        return ApiResponse.<List<PromotionResponse>>builder()
                .result(promotionService.getAllPromotions())
                .build();
    }

    @PutMapping("/{promotionId}")
    ApiResponse<PromotionResponse> updatePromotion(@PathVariable String promotionId,
                                                   @Valid @RequestBody PromotionRequest request) {
        return ApiResponse.<PromotionResponse>builder()
                .result(promotionService.updatePromotion(promotionId, request))
                .build();
    }

    @DeleteMapping("/{promotionId}")
    ApiResponse<Void> deletePromotion(@PathVariable String promotionId) {
        promotionService.deletePromotion(promotionId);
        return ApiResponse.<Void>builder().build();
    }
}