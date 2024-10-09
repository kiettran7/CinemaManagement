package com.ttk.cinema.services;

import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.property.TextAlignment;
import com.itextpdf.layout.property.UnitValue;
import com.ttk.cinema.POJOs.Bill;
import com.ttk.cinema.POJOs.Item;
import com.ttk.cinema.POJOs.Ticket;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PdfService {

    public ByteArrayInputStream createPdf(Bill bill, List<Ticket> tickets, String customerName) throws IOException {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        try (PdfWriter writer = new PdfWriter(out); PdfDocument pdf = new PdfDocument(writer); Document document = new Document(pdf, PageSize.A4)) {
            // Đường dẫn tới font hỗ trợ tiếng Việt (Arial hoặc NotoSans)
            String fontPath = "./arial.ttf";  // Đảm bảo tệp font tồn tại trong thư mục resources

            // Tạo PdfFont từ file font
            PdfFont font = PdfFontFactory.createFont(fontPath, "Identity-H", true);

            // Set font cho document
            document.setFont(font);

            // Title: HÓA ĐƠN
            Paragraph title = new Paragraph("HÓA ĐƠN ĐẶT VÉ")
                    .setTextAlignment(TextAlignment.CENTER)
                    .setBold()
                    .setFontSize(18);
            document.add(title);

            // Thông tin khách hàng
            document.add(new Paragraph(String.format("Khách hàng: %s", customerName)).setFont(font));
            document.add(new Paragraph(String.format("Mã hóa đơn: %s", bill.getId())).setFont(font));

            // Thông tin giảm giá (nếu có)
            document.add(new Paragraph(String.format("Mã giảm giá: %s", bill.getPromotion() != null ? bill.getPromotion().getPromotionName() : "Không có")).setFont(font));

            // Tổng tiền và số tiền khách hàng đã trả
            document.add(new Paragraph(String.format("Tổng tiền (chưa bao gồm mã giảm giá): %.2f VND", bill.getTotalAmount())).setFont(font));
            document.add(new Paragraph(String.format("Tổng hóa đơn khách hàng phải thanh toán: %.2f VND", bill.getCustomerPaid())).setFont(font));


            // Danh sách vé
            document.add(new Paragraph("\nDanh sách vé:").setBold().setFontSize(14));
            Table ticketTable = new Table(UnitValue.createPercentArray(new float[]{1, 2, 2, 1, 1, 2})).useAllAvailableWidth();
            ticketTable.addCell("STT");
            ticketTable.addCell("Lịch chiếu");
            ticketTable.addCell("Phim");
            ticketTable.addCell("Phòng");
            ticketTable.addCell("Ghế");
            ticketTable.addCell("Giá vé (VND)");

            int i = 1;
            String showDateMovie = "";
            for (Ticket ticket : tickets) {

                showDateMovie = String.valueOf(ticket.getShowEvent().getShowSchedule().getShowDate()) + " " + ticket.getShowEvent().getShowtime().getStartTime() + " - " + ticket.getShowEvent().getShowtime().getEndTime();
//                showDateMovie.concat(" ");
//                showDateMovie.concat(ticket.getShowEvent().getShowtime().getStartTime()) ;
//                showDateMovie.concat(" - ");
//                showDateMovie.concat(ticket.getShowEvent().getShowtime().getEndTime());


                ticketTable.addCell(String.valueOf(i++));
                ticketTable.addCell(showDateMovie);
                ticketTable.addCell(ticket.getMovie().getMovieName());
                ticketTable.addCell(ticket.getShowEvent().getShowRoom().getShowRoomName());
                ticketTable.addCell(ticket.getSeat().getSeatName());
                ticketTable.addCell(String.valueOf(ticket.getTicketPrice()));

                showDateMovie = "";
            }
            document.add(ticketTable);

            // Danh sách mặt hàng đã chọn (nếu có)
            if (bill.getItems() != null && !bill.getItems().isEmpty()) {
                document.add(new Paragraph("\nDanh sách mặt hàng đã chọn:").setBold().setFontSize(14));
                Table itemTable = new Table(UnitValue.createPercentArray(new float[]{1, 2, 2})).useAllAvailableWidth();
                itemTable.addCell("STT");
                itemTable.addCell("Tên mặt hàng");
                itemTable.addCell("Giá (VND)");

                int j = 1;
                for (Item item : bill.getItems()) {
                    itemTable.addCell(String.valueOf(j++));
                    itemTable.addCell(item.getItemName());
                    itemTable.addCell(String.valueOf(item.getItemPrice()));
                }
                document.add(itemTable);
            }

            document.add(new Paragraph("\nCảm ơn quý khách đã sử dụng dịch vụ!").setTextAlignment(TextAlignment.CENTER).setBold());
        } catch (IOException ex) {
            ex.printStackTrace();
        }
        return new ByteArrayInputStream(out.toByteArray());
    }

}
