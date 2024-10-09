package com.ttk.cinema.controllers;

import com.ttk.cinema.DTOs.request.PaymentDTO;
import com.ttk.cinema.DTOs.response.ResponseObject;
import com.ttk.cinema.POJOs.Bill;
import com.ttk.cinema.configurations.SecurityConfig;
import com.ttk.cinema.exceptions.AppException;
import com.ttk.cinema.exceptions.ErrorCode;
import com.ttk.cinema.repositories.BillRepository;
import com.ttk.cinema.services.PaymentService;
import com.ttk.cinema.utils.VNPayUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@RequestMapping("/payment")
@RequiredArgsConstructor
public class PaymentController {
    private final SecurityConfig securityConfig;
    private final PaymentService paymentService;
    private final BillRepository billRepository;


    @GetMapping("/vn-pay")
    public ResponseObject<PaymentDTO.VNPayResponse> pay(HttpServletRequest request) {
        return new ResponseObject<>(HttpStatus.OK, "Success", paymentService.createVnPayPayment(request));
    }

    @GetMapping("/vn-pay-callback")
    public void  payCallbackHandler(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String status = request.getParameter("vnp_ResponseCode");

        String txnRef = request.getParameter("vnp_TxnRef"); // Lấy txnRef từ VNPay callback
        String[] refParts = txnRef.split("_");
        String billId = refParts[0]; // Lấy bill ID
        String movieId = refParts[1]; // Lấy movieId

        Bill bill = billRepository.findById(billId)
                .orElseThrow(() -> new AppException(ErrorCode.BILL_NOT_FOUND));

        bill.setVnp_TmnCode(request.getParameter("vnp_TmnCode"));
        billRepository.save(bill);

        if (status.equals("00")) {
            response.sendRedirect("http://localhost:3000/bill");
//            return new ResponseObject<>(HttpStatus.OK, "Success",
//                    new PaymentDTO.VNPayResponse("00", "Success", "", request.getParameter("vnp_TmnCode")));
        }
    }
}