package com.ttk.cinema.services;

import com.ttk.cinema.DTOs.request.SeatRequest;
import com.ttk.cinema.DTOs.response.SeatResponse;
import com.ttk.cinema.POJOs.Seat;
import com.ttk.cinema.POJOs.ShowRoom;
import com.ttk.cinema.exceptions.AppException;
import com.ttk.cinema.exceptions.ErrorCode;
import com.ttk.cinema.mappers.SeatMapper;
import com.ttk.cinema.repositories.SeatRepository;
import com.ttk.cinema.repositories.ShowRoomRepository;
import com.ttk.cinema.repositories.TicketRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SeatService {
    SeatRepository seatRepository;
    SeatMapper seatMapper;
    ShowRoomRepository showRoomRepository;
    private final TicketRepository ticketRepository;

    @PreAuthorize("hasRole('ADMIN')")
    public SeatResponse createSeat(SeatRequest request) {
        Seat seat = seatMapper.toSeat(request);

        ShowRoom showRoom = showRoomRepository.findById(request.getShowRoom())
                .orElseThrow(() -> new AppException(ErrorCode.PROMOTION_NOT_FOUND));
        seat.setShowRoom(showRoom);

        return seatMapper.toSeatResponse(seatRepository.save(seat));
    }

    public SeatResponse getSeat(String seatId) {
        Seat seat = seatRepository.findById(seatId)
                .orElseThrow(() -> new AppException(ErrorCode.SEAT_NOT_FOUND));
        return seatMapper.toSeatResponse(seat);
    }

    public List<SeatResponse> getAllSeats() {
        return seatRepository.findAll().stream()
                .map(seatMapper::toSeatResponse)
                .toList();
    }

    @PreAuthorize("hasRole('ADMIN')")
    public void deleteSeat(String seatId) {
        Seat seat = seatRepository.findById(seatId)
                .orElseThrow(() -> new AppException(ErrorCode.SEAT_NOT_FOUND));

        for (var ticket : ticketRepository.findAll()) {
            if (seat == ticket.getSeat()) {
                ticket.setSeat(null);
                ticketRepository.save(ticket);
            }
        }

        seatRepository.deleteById(seat.getId());
    }

    @PreAuthorize("hasRole('ADMIN')")
    public SeatResponse updateSeat(String seatId, SeatRequest request) {
        Seat seat = seatRepository.findById(seatId)
                .orElseThrow(() -> new AppException(ErrorCode.SEAT_NOT_FOUND));

        ShowRoom showRoom = showRoomRepository.findById(request.getShowRoom())
                .orElseThrow(() -> new AppException(ErrorCode.SHOW_ROOM_NOT_FOUND));
        seat.setShowRoom(showRoom);

        seatMapper.updateSeat(seat, request);

        return seatMapper.toSeatResponse(seatRepository.save(seat));
    }
}