package com.ttk.cinema.mappers;

import com.ttk.cinema.DTOs.request.SeatRequest;
import com.ttk.cinema.DTOs.response.SeatResponse;
import com.ttk.cinema.POJOs.Seat;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface SeatMapper {
    @Mapping(target = "showRoom", ignore = true)
    Seat toSeat(SeatRequest request);

    // Ánh xạ từ Seat sang SeatResponse bao gồm ShowRoom
    @Mapping(source = "showRoom", target = "showRoom")
    SeatResponse toSeatResponse(Seat seat);

    @Mapping(target = "showRoom", ignore = true)
    void updateSeat(@MappingTarget Seat seat, SeatRequest request);
}