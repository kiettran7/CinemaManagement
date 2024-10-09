package com.ttk.cinema.controllers;

import com.ttk.cinema.DTOs.request.ApiResponse;
import com.ttk.cinema.DTOs.request.TagRequest;
import com.ttk.cinema.DTOs.response.TagResponse;
import com.ttk.cinema.services.TagService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tags")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class TagController {
    TagService tagService;

    @PostMapping
    ApiResponse<TagResponse> createTag(@RequestBody TagRequest request) {
        return ApiResponse.<TagResponse>builder()
                .result(tagService.createTag(request))
                .build();
    }

    @GetMapping("/{tagId}")
    ApiResponse<TagResponse> getTag(@PathVariable String tagId) {
        return ApiResponse.<TagResponse>builder()
                .result(tagService.getTag(tagId))
                .build();
    }

    @GetMapping
    ApiResponse<List<TagResponse>> getAllTags() {
        return ApiResponse.<List<TagResponse>>builder()
                .result(tagService.getAllTags())
                .build();
    }

    @PutMapping("/{tagId}")
    ApiResponse<TagResponse> updateTag(@PathVariable String tagId,
                                       @RequestBody TagRequest request) {
        return ApiResponse.<TagResponse>builder()
                .result(tagService.updateTag(tagId, request))
                .build();
    }

    @DeleteMapping("/{tagId}")
    ApiResponse<Void> deleteTag(@PathVariable String tagId) {
        tagService.deleteTag(tagId);
        return ApiResponse.<Void>builder().build();
    }
}