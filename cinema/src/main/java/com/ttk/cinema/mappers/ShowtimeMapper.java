package com.ttk.cinema.mappers;

import com.ttk.cinema.DTOs.request.ShowtimeRequest;
import com.ttk.cinema.DTOs.response.ShowtimeResponse;
import com.ttk.cinema.POJOs.Showtime;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ShowtimeMapper {
    Showtime toShowtime(ShowtimeRequest request);
    ShowtimeResponse toShowtimeResponse(Showtime showtime);

    void updateShowtime(@MappingTarget Showtime showtime, ShowtimeRequest request);
}
