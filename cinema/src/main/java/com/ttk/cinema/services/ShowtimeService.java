package com.ttk.cinema.services;

import com.ttk.cinema.DTOs.request.ShowtimeRequest;
import com.ttk.cinema.DTOs.response.ShowtimeResponse;
import com.ttk.cinema.POJOs.Showtime;
import com.ttk.cinema.exceptions.AppException;
import com.ttk.cinema.exceptions.ErrorCode;
import com.ttk.cinema.mappers.ShowtimeMapper;
import com.ttk.cinema.repositories.ShowEventRepository;
import com.ttk.cinema.repositories.ShowtimeRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ShowtimeService {
    ShowtimeRepository showtimeRepository;
    ShowtimeMapper showtimeMapper;
    private final ShowEventRepository showEventRepository;

    @PreAuthorize("hasRole('ADMIN')")
    public ShowtimeResponse createShowtime(ShowtimeRequest request) {
        Showtime showtime = showtimeMapper.toShowtime(request);

        return showtimeMapper.toShowtimeResponse(showtimeRepository.save(showtime));
    }

    public ShowtimeResponse getShowtime(String showtimeId) {
        Showtime showtime = showtimeRepository.findById(showtimeId)
                .orElseThrow(() -> new AppException(ErrorCode.SHOWTIME_NOT_FOUND));
        return showtimeMapper.toShowtimeResponse(showtime);
    }

    public List<ShowtimeResponse> getAllShowtimes() {
        return showtimeRepository.findAll().stream()
                .map(showtimeMapper::toShowtimeResponse)
                .toList();
    }

    @PreAuthorize("hasRole('ADMIN')")
    public void deleteShowtime(String showtimeId) {
        Showtime showtime = showtimeRepository.findById(showtimeId)
                .orElseThrow(() -> new AppException(ErrorCode.SHOWTIME_NOT_FOUND));

        for (var showEvent : showEventRepository.findAll()) {
            if (showtime == showEvent.getShowtime()) {
                showEvent.setShowtime(null);
                showEventRepository.save(showEvent);
            }
        }

        showtimeRepository.deleteById(showtime.getId());
    }

    @PreAuthorize("hasRole('ADMIN')")
    public ShowtimeResponse updateShowtime(String showtimeId, ShowtimeRequest request) {
        Showtime showtime = showtimeRepository.findById(showtimeId)
                .orElseThrow(() -> new AppException(ErrorCode.SHOWTIME_NOT_FOUND));

        showtimeMapper.updateShowtime(showtime, request);

        return showtimeMapper.toShowtimeResponse(showtimeRepository.save(showtime));
    }
}