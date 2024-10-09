package com.ttk.cinema.services;

import com.ttk.cinema.DTOs.request.BillRequest;
import com.ttk.cinema.DTOs.response.BillResponse;
import com.ttk.cinema.POJOs.*;
import com.ttk.cinema.exceptions.AppException;
import com.ttk.cinema.exceptions.ErrorCode;
import com.ttk.cinema.mappers.BillMapper;
import com.ttk.cinema.repositories.*;
import com.ttk.cinema.utils.VNPayUtil;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BillService {
    BillRepository billRepository;
    BillMapper billMapper;
    PromotionRepository promotionRepository;
    ItemRepository itemRepository;
    TicketRepository ticketRepository;
    EmailService emailService;
    PdfService pdfService;
    AmazoneService amazoneService;

    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'CUSTOMER')")
    @Transactional
    public BillResponse createBill(BillRequest request) throws IOException {
        Bill billRequest = billMapper.toBill(request);

        billRequest = billRepository.save(billRequest);

        Bill bill = billRepository.findById(billRequest.getId())
                .orElseThrow(() -> new AppException(ErrorCode.MOVIE_NOT_FOUND));

        float totalAmount = 0;
        String customerName = "";

        for (var ticket : request.getTickets()) {
            Ticket t = ticketRepository.findById(ticket)
                    .orElseThrow(() -> new AppException(ErrorCode.TICKET_NOT_FOUND));

            if (t != null) {
                t.setBill(bill);
                totalAmount += t.getTicketPrice();
                ticketRepository.save(t);
                customerName = t.getCustomer().getFullName();
            }

            t = null;
        }

        if (request.getItems() != null && !request.getItems().isEmpty()) {
            List<Item> items = new ArrayList<>();
            Item item;
            for (var i : request.getItems()) {
                item = itemRepository.findById(i).orElseThrow(() -> new AppException(ErrorCode.ITEM_NOT_FOUND));
                items.add(item);
                totalAmount += item.getItemPrice();
            }

            bill.setItems(items);
            billRepository.save(bill);
        }

        bill.setTotalAmount(totalAmount);

        var customerPaid = totalAmount;

        if (request.getPromotion() != null && !request.getPromotion().isEmpty()) {
            var promotionCustomerUser = promotionRepository.findById(request.getPromotion())
                    .orElseThrow(() -> new AppException(ErrorCode.PROMOTION_NOT_FOUND));

            customerPaid = customerPaid - (customerPaid * (promotionCustomerUser.getDiscountValue()));
            bill.setPromotion(promotionCustomerUser);
        }

        bill.setCustomerPaid(customerPaid);

        if (VNPayUtil.vnp_TmnCode != "") {
            bill.setVnp_TmnCode(VNPayUtil.vnp_TmnCode);
            VNPayUtil.vnp_TmnCode = "";
        }

        var savedBill = billRepository.save(bill);

        // Lấy danh sách vé thuộc về hóa đơn
        List<Ticket> tickets = ticketRepository.findByBill(savedBill);

        // Tạo nội dung email
        String subject = "Hóa đơn đặt vé: " + savedBill.getId();
        StringBuilder emailBody = new StringBuilder();
        emailBody.append("Kính gửi ").append(customerName).append(",\n\n");
        emailBody.append("\nTHÔNG TIN HÓA ĐƠN\n\n");
        emailBody.append("Mã hóa đơn: ").append(savedBill.getId()).append("\n");
        emailBody.append("Mã giảm giá: ").append(bill.getPromotion() != null ? bill.getPromotion().getPromotionName() : "Không có").append("\n");
        emailBody.append("Tổng tiền: ").append(savedBill.getTotalAmount()).append(" VND\n");
        emailBody.append("\nDanh sách vé:\n");

        // Duyệt qua các vé để tạo nội dung email
        for (Ticket ticket : tickets) {
            emailBody.append(" - Phim: ").append(ticket.getMovie().getMovieName())
                    .append(", Giá: ").append(ticket.getTicketPrice()).append(" VND\n");
        }

        emailBody.append("\nDanh sách mặt hàng đã chọn:\n");
        for (Item item : savedBill.getItems()) {
            emailBody.append(" - ").append(item.getItemName()).append("Giá: ").append(String.valueOf(item.getItemPrice())).append("\n");
        }

        emailBody.append("\n\nCảm ơn quý khách đã sử dụng dịch vụ!\n\nTrân trọng");

        // Gọi PdfService để tạo PDF
        ByteArrayInputStream pdfStream = pdfService.createPdf(savedBill, tickets, customerName);
        String hoa_don = "hoa_don_" + savedBill.getId() + ".pdf";

        // Gửi email
        String emailTo = tickets.stream()
                .findFirst()
                .map(ticket -> ticket.getCustomer() != null ? ticket.getCustomer().getEmail() : "kiettran.cv@gmail.com")
                .orElse("kiettran.cv@gmail.com"); // Email mặc định nếu không có

//        emailService.sendEmail("kiettran.cv@gmail.com", subject, emailBody.toString());

        emailService.sendEmailWithAttachment(emailTo, subject, emailBody.toString(), pdfStream, hoa_don);

        bill.setPdfUrl(amazoneService.uploadFile(pdfService.createPdf(savedBill, tickets, customerName), hoa_don));
        // Gửi link cho front-end
        System.out.println("URL PDF: " + bill.getPdfUrl());

//        // Gửi email
//        String emailTo = tickets.stream()
//                .findFirst()
//                .map(ticket -> ticket.getCustomer() != null ? ticket.getCustomer().getEmail() : "kiettran.cv@gmail.com")
//                .orElse("kiettran.cv@gmail.com"); // Email mặc định nếu không có
//
////        emailService.sendEmail("kiettran.cv@gmail.com", subject, emailBody.toString());
//
//        emailService.sendEmailWithAttachment(emailTo, subject, emailBody.toString(), pdfStream, hoa_don);

        return billMapper.toBillResponse(savedBill);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'CUSTOMER')")
    public BillResponse getBill(String billId) {
        Bill bill = billRepository.findById(billId)
                .orElseThrow(() -> new AppException(ErrorCode.BILL_NOT_FOUND));
        return billMapper.toBillResponse(bill);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'CUSTOMER')")
    public List<BillResponse> getAllBills() {
        return billRepository.findAll().stream()
                .map(billMapper::toBillResponse)
                .toList();
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public void deleteBill(String billId) {
        Bill bill = billRepository.findById(billId)
                .orElseThrow(() -> new AppException(ErrorCode.BILL_NOT_FOUND));

        billRepository.deleteBillItemsById(bill.getId());

        for (var ticket : ticketRepository.findAll()) {
            if (bill == ticket.getBill()) {
                ticketRepository.delete(ticket);
            }
        }

        billRepository.deleteById(bill.getId());
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public BillResponse updateBill(String billId, BillRequest request) {
        Bill bill = billRepository.findById(billId)
                .orElseThrow(() -> new AppException(ErrorCode.BILL_NOT_FOUND));
        billMapper.updateBill(bill, request);

        Promotion promotion = promotionRepository.findById(request.getPromotion()).orElseThrow(() -> new AppException(ErrorCode.PROMOTION_NOT_FOUND));
        bill.setPromotion(promotion);

        var items = itemRepository.findAllById(request.getItems());
        bill.setItems(items);

        return billMapper.toBillResponse(billRepository.save(bill));
    }
}