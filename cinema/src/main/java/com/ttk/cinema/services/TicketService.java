package com.ttk.cinema.services;

import com.ttk.cinema.DTOs.request.TicketRequest;
import com.ttk.cinema.DTOs.response.TicketResponse;
import com.ttk.cinema.POJOs.*;
import com.ttk.cinema.exceptions.AppException;
import com.ttk.cinema.exceptions.ErrorCode;
import com.ttk.cinema.mappers.TicketMapper;
import com.ttk.cinema.repositories.*;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class TicketService {
    TicketRepository ticketRepository;
    TicketMapper ticketMapper;
    ShowEventRepository showEventRepository;
    SeatRepository seatRepository;
    UserRepository userRepository;
    MovieRepository movieRepository;

    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'CUSTOMER')")
    public TicketResponse createTicket(TicketRequest request) {
        Ticket ticket = ticketMapper.toTicket(request);

        ShowEvent showEvent = showEventRepository.findById(request.getShowEvent())
                .orElseThrow(() -> new AppException(ErrorCode.SHOW_EVENT_NOT_FOUND));
        ticket.setShowEvent(showEvent);

        Seat seat = seatRepository.findById(request.getSeat())
                .orElseThrow(() -> new AppException(ErrorCode.SEAT_NOT_FOUND));
        ticket.setSeat(seat);

        if (request.getCustomer() != null && !request.getCustomer().isEmpty()) {
            User customer = userRepository.findById(request.getCustomer())
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
            ticket.setCustomer(customer);
        }

        if (request.getStaff() != null && !request.getStaff().isEmpty()) {
            User staff = userRepository.findById(request.getStaff())
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
            ticket.setStaff(staff);
        }

        Movie movie = movieRepository.findById(request.getMovie())
                .orElseThrow(() -> new AppException(ErrorCode.MOVIE_NOT_FOUND));
        ticket.setMovie(movie);

        ticket = ticketRepository.save(ticket);

        return ticketMapper.toTicketResponse(ticket);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'CUSTOMER')")
    public TicketResponse getTicket(String ticketId) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new AppException(ErrorCode.TICKET_NOT_FOUND));
        return ticketMapper.toTicketResponse(ticket);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'CUSTOMER')")
    public List<TicketResponse> getAllTickets() {
        return ticketRepository.findAll().stream()
                .map(ticketMapper::toTicketResponse)
                .toList();
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public void deleteTicket(String ticketId) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new AppException(ErrorCode.TICKET_NOT_FOUND));

        ticketRepository.deleteById(ticket.getId());
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'CUSTOMER')")
    public TicketResponse updateTicket(String ticketId, TicketRequest request) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new AppException(ErrorCode.TICKET_NOT_FOUND));

        ticketMapper.updateTicket(ticket, request);

        ShowEvent showEvent = showEventRepository.findById(request.getShowEvent())
                .orElseThrow(() -> new AppException(ErrorCode.SHOW_EVENT_NOT_FOUND));
        ticket.setShowEvent(showEvent);

        Seat seat = seatRepository.findById(request.getSeat())
                .orElseThrow(() -> new AppException(ErrorCode.SEAT_NOT_FOUND));
        ticket.setSeat(seat);

        User customer = userRepository.findById(request.getCustomer())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        ticket.setCustomer(customer);

        User staff = userRepository.findById(request.getStaff())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        ticket.setStaff(staff);

        Movie movie = movieRepository.findById(request.getMovie())
                .orElseThrow(() -> new AppException(ErrorCode.MOVIE_NOT_FOUND));
        ticket.setMovie(movie);


        return ticketMapper.toTicketResponse(ticketRepository.save(ticket));
    }
}