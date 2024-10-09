package com.ttk.cinema.services;


import com.ttk.cinema.DTOs.request.ShowEventRequest;
import com.ttk.cinema.DTOs.response.ShowEventResponse;
import com.ttk.cinema.POJOs.*;
import com.ttk.cinema.exceptions.AppException;
import com.ttk.cinema.exceptions.ErrorCode;
import com.ttk.cinema.mappers.ShowEventMapper;
import com.ttk.cinema.repositories.*;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ShowEventService {
    ShowEventRepository showEventRepository;
    ShowEventMapper showEventMapper;
    ShowtimeRepository showtimeRepository;
    ShowRoomRepository showRoomRepository;
    ShowScheduleRepository showScheduleRepository;
    private final TicketRepository ticketRepository;

    @PreAuthorize("hasRole('ADMIN')")
    public ShowEventResponse createShowEvent(ShowEventRequest request) {
        ShowEvent showEvent = showEventMapper.toShowEvent(request);

        Showtime showtime = showtimeRepository.findById(request.getShowtime())
                .orElseThrow(() -> new AppException(ErrorCode.SHOWTIME_NOT_FOUND));
        showEvent.setShowtime(showtime);

        ShowRoom showRoom = showRoomRepository.findById(request.getShowRoom())
                .orElseThrow(() -> new AppException(ErrorCode.SHOW_ROOM_NOT_FOUND));
        showEvent.setShowRoom(showRoom);

        ShowSchedule showSchedule = showScheduleRepository.findById(request.getShowSchedule())
                .orElseThrow(() -> new AppException(ErrorCode.SHOW_SCHEDULE_NOT_FOUND));
        showEvent.setShowSchedule(showSchedule);

        return showEventMapper.toShowEventResponse(showEventRepository.save(showEvent));
    }

    public ShowEventResponse getShowEvent(String showtimeId) {
        ShowEvent showEvent = showEventRepository.findById(showtimeId)
                .orElseThrow(() -> new AppException(ErrorCode.SHOW_EVENT_NOT_FOUND));
        return showEventMapper.toShowEventResponse(showEvent);
    }

    public List<ShowEventResponse> getAllShowEvents() {
        return showEventRepository.findAll().stream()
                .map(showEventMapper::toShowEventResponse)
                .toList();
    }

    @PreAuthorize("hasRole('ADMIN')")
    public void deleteShowEvent(String showEventId) {
        ShowEvent showEvent = showEventRepository.findById(showEventId)
                .orElseThrow(() -> new AppException(ErrorCode.SHOW_EVENT_NOT_FOUND));

        showEventRepository.deleteMovieShowEventsByShowEventId(showEvent.getId());

        for (var ticket : ticketRepository.findAll()) {
            if (showEvent == ticket.getShowEvent()) {
                ticket.setShowEvent(null);
                ticketRepository.save(ticket);
            }
        }

        showEventRepository.deleteById(showEvent.getId());
    }

    @PreAuthorize("hasRole('ADMIN')")
    public ShowEventResponse updateShowEvent(String showEventId, ShowEventRequest request) {
        ShowEvent showEvent = showEventRepository.findById(showEventId)
                .orElseThrow(() -> new AppException(ErrorCode.SHOWTIME_NOT_FOUND));

        showEventMapper.updateShowEvent(showEvent, request);

        Showtime showtime = showtimeRepository.findById(request.getShowtime())
                .orElseThrow(() -> new AppException(ErrorCode.SHOWTIME_NOT_FOUND));
        showEvent.setShowtime(showtime);

        ShowRoom showRoom = showRoomRepository.findById(request.getShowRoom())
                .orElseThrow(() -> new AppException(ErrorCode.SHOW_ROOM_NOT_FOUND));
        showEvent.setShowRoom(showRoom);

        ShowSchedule showSchedule = showScheduleRepository.findById(request.getShowSchedule())
                .orElseThrow(() -> new AppException(ErrorCode.SHOW_SCHEDULE_NOT_FOUND));
        showEvent.setShowSchedule(showSchedule);

        return showEventMapper.toShowEventResponse(showEventRepository.save(showEvent));
    }
}