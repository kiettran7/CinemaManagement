package com.ttk.cinema.controllers;

import com.ttk.cinema.DTOs.request.ApiResponse;
import com.ttk.cinema.DTOs.request.CommentRequest;
import com.ttk.cinema.DTOs.request.ItemRequest;
import com.ttk.cinema.DTOs.response.CommentResponse;
import com.ttk.cinema.DTOs.response.ItemResponse;
import com.ttk.cinema.services.CommentService;
import com.ttk.cinema.services.ItemService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/comments")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CommentController {
    CommentService commentService;

    @PostMapping
    ApiResponse<CommentResponse> createComment(@Valid @RequestBody CommentRequest request) {
        return ApiResponse.<CommentResponse>builder()
                .result(commentService.createComment(request))
                .build();
    }

    @GetMapping("/{commentId}")
    ApiResponse<CommentResponse> getComment(@PathVariable String commentId) {
        return ApiResponse.<CommentResponse>builder()
                .result(commentService.getComment(commentId))
                .build();
    }

    @GetMapping
    ApiResponse<List<CommentResponse>> getAllComments() {
        return ApiResponse.<List<CommentResponse>>builder()
                .result(commentService.getAllComments())
                .build();
    }

    @PutMapping("/{commentId}")
    ApiResponse<CommentResponse> updateComment(@PathVariable String commentId,
                                               @Valid @RequestBody CommentRequest request) {
        return ApiResponse.<CommentResponse>builder()
                .result(commentService.updateComment(commentId, request))
                .build();
    }

    @DeleteMapping("/{commentId}")
    ApiResponse<Void> deleteComment(@PathVariable String commentId) {
        commentService.deleteComment(commentId);
        return ApiResponse.<Void>builder().build();
    }
}