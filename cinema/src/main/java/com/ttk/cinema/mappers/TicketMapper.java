package com.ttk.cinema.mappers;

import com.ttk.cinema.DTOs.request.TicketRequest;
import com.ttk.cinema.DTOs.response.TicketResponse;
import com.ttk.cinema.POJOs.Ticket;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface TicketMapper {
    @Mapping(target = "showEvent", ignore = true)
    @Mapping(target = "seat", ignore = true)
    @Mapping(target = "customer", ignore = true)
    @Mapping(target = "staff", ignore = true)
    @Mapping(target = "movie", ignore = true)
    @Mapping(target = "bill", ignore = true)
    Ticket toTicket(TicketRequest request);

    @Mapping(source = "seat", target = "seat")
    @Mapping(source = "showEvent", target = "showEvent")
    @Mapping(source = "customer", target = "customer")
    @Mapping(source = "staff", target = "staff")
    @Mapping(source = "movie", target = "movie")
    @Mapping(source = "bill", target = "bill")
    TicketResponse toTicketResponse(Ticket ticket);

    @Mapping(target = "showEvent", ignore = true)
    @Mapping(target = "seat", ignore = true)
    @Mapping(target = "customer", ignore = true)
    @Mapping(target = "staff", ignore = true)
    @Mapping(target = "movie", ignore = true)
    @Mapping(target = "bill", ignore = true)
    void updateTicket(@MappingTarget Ticket ticket, TicketRequest request);
}
