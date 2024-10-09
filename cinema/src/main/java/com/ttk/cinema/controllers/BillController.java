package com.ttk.cinema.controllers;

import com.ttk.cinema.DTOs.request.ApiResponse;
import com.ttk.cinema.DTOs.request.BillRequest;
import com.ttk.cinema.DTOs.response.BillResponse;
import com.ttk.cinema.services.BillService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/bills")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BillController {
    BillService billService;

    @PostMapping
    ApiResponse<BillResponse> createBill(@Valid @RequestBody BillRequest request) throws IOException {
        return ApiResponse.<BillResponse>builder()
                .result(billService.createBill(request))
                .build();
    }

    @GetMapping("/{billId}")
    ApiResponse<BillResponse> getBill(@PathVariable String billId) {
        return ApiResponse.<BillResponse>builder()
                .result(billService.getBill(billId))
                .build();
    }

    @GetMapping
    ApiResponse<List<BillResponse>> getAllBills() {
        return ApiResponse.<List<BillResponse>>builder()
                .result(billService.getAllBills())
                .build();
    }

    @PutMapping("/{billId}")
    ApiResponse<BillResponse> updateBill(@Valid @PathVariable String billId,
                                         @RequestBody BillRequest request) {
        return ApiResponse.<BillResponse>builder()
                .result(billService.updateBill(billId, request))
                .build();
    }

    @DeleteMapping("/{billId}")
    ApiResponse<Void> deleteBill(@PathVariable String billId) {
        billService.deleteBill(billId);
        return ApiResponse.<Void>builder().build();
    }
}