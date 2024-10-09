package com.ttk.cinema.mappers;

import com.ttk.cinema.DTOs.request.BillRequest;
import com.ttk.cinema.DTOs.response.BillResponse;
import com.ttk.cinema.POJOs.Bill;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

//@Mapper(componentModel = "spring")
//public interface BillMapper {
//    Bill toBill(BillCreationRequest request);
//    BillResponse toBillResponse(Bill bill);
//
//    @Mapping(target = "billItems", ignore = true)
//    void updateBill(@MappingTarget Bill bill, BillUpdateRequest request);
//}
@Mapper(componentModel = "spring")
public interface BillMapper {

    // Mapping từ BillCreationRequest sang Bill (bao gồm Promotion và Ticket)
    @Mapping(target = "items", ignore = true)
    @Mapping(target = "promotion", ignore = true)
    @Mapping(target = "totalAmount", ignore = true)
    @Mapping(target = "vnp_TmnCode", ignore = true)
    Bill toBill(BillRequest request);

    BillResponse toBillResponse(Bill bill);

    // Mapping khi cập nhật Bill
    @Mapping(target = "items", ignore = true) // Bỏ qua billItems vì không thay đổi
    @Mapping(target = "promotion", ignore = true)
    @Mapping(target = "vnp_TmnCode", ignore = true)
    @Mapping(target = "totalAmount", ignore = true)
    void updateBill(@MappingTarget Bill bill, BillRequest request);
}

