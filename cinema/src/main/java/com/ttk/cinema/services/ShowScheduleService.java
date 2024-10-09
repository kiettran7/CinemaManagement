package com.ttk.cinema.services;

import com.ttk.cinema.DTOs.request.ShowScheduleRequest;
import com.ttk.cinema.DTOs.response.ShowScheduleResponse;
import com.ttk.cinema.POJOs.Movie;
import com.ttk.cinema.POJOs.ShowSchedule;
import com.ttk.cinema.exceptions.AppException;
import com.ttk.cinema.exceptions.ErrorCode;
import com.ttk.cinema.mappers.ShowScheduleMapper;
import com.ttk.cinema.repositories.MovieRepository;
import com.ttk.cinema.repositories.ShowEventRepository;
import com.ttk.cinema.repositories.ShowScheduleRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ShowScheduleService {
    ShowScheduleRepository showScheduleRepository;
    ShowScheduleMapper showScheduleMapper;
    MovieRepository movieRepository;
    private final ShowEventRepository showEventRepository;

    @PreAuthorize("hasRole('ADMIN')")
    public ShowScheduleResponse createShowSchedule(ShowScheduleRequest request) {
        ShowSchedule showSchedule = showScheduleMapper.toShowSchedule(request);

        return showScheduleMapper.toShowScheduleResponse(showScheduleRepository.save(showSchedule));
    }

    public ShowScheduleResponse getShowSchedule(String showScheduleId) {
        ShowSchedule showSchedule = showScheduleRepository.findById(showScheduleId)
                .orElseThrow(() -> new AppException(ErrorCode.SHOW_SCHEDULE_NOT_FOUND));
        return showScheduleMapper.toShowScheduleResponse(showSchedule);
    }

    public List<ShowScheduleResponse> getAllShowSchedules() {
        return showScheduleRepository.findAll().stream()
                .map(showScheduleMapper::toShowScheduleResponse)
                .toList();
    }

    @PreAuthorize("hasRole('ADMIN')")
    public void deleteShowSchedule(String showScheduleId) {
        ShowSchedule showSchedule = showScheduleRepository.findById(showScheduleId)
                .orElseThrow(() -> new AppException(ErrorCode.SHOW_SCHEDULE_NOT_FOUND));

        for (var showEvent : showEventRepository.findAll()){
            if (showSchedule == showEvent.getShowSchedule()){
                showEvent.setShowSchedule(null);
                showEventRepository.delete(showEvent);
            }
        }

        showScheduleRepository.deleteById(showSchedule.getId());
    }

    @PreAuthorize("hasRole('ADMIN')")
    public ShowScheduleResponse updateShowSchedule(String showScheduleId, ShowScheduleRequest request) {
        ShowSchedule showSchedule = showScheduleRepository.findById(showScheduleId)
                .orElseThrow(() -> new AppException(ErrorCode.SHOW_SCHEDULE_NOT_FOUND));

        showScheduleMapper.updateShowSchedule(showSchedule, request);

//        Movie movie = movieRepository.findById(request.getMovie())
//                .orElseThrow(() -> new AppException(ErrorCode.MOVIE_NOT_FOUND));
//        showSchedule.setMovie(movie);

        return showScheduleMapper.toShowScheduleResponse(showScheduleRepository.save(showSchedule));
    }
}