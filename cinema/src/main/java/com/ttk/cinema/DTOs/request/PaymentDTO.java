package com.ttk.cinema.DTOs.request;

import lombok.Builder;

public class PaymentDTO {
    @Builder
    public static class VNPayResponse {
        public String code;
        public String message;
        public String paymentUrl;
        public String vnp_TmnCode;

        public VNPayResponse(String code, String message, String paymentUrl, String vnp_TmnCode) {
            this.code = code;
            this.message = message;
            this.paymentUrl = paymentUrl;
            this.vnp_TmnCode = vnp_TmnCode;
        }
    }
}