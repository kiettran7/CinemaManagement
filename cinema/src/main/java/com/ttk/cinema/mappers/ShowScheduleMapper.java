package com.ttk.cinema.mappers;

import com.ttk.cinema.DTOs.request.ShowScheduleRequest;
import com.ttk.cinema.DTOs.response.ShowScheduleResponse;
import com.ttk.cinema.POJOs.ShowSchedule;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ShowScheduleMapper {
//    @Mapping(target = "movie", ignore = true)
    ShowSchedule toShowSchedule(ShowScheduleRequest request);

    //    @Mapping(source = "movie.movieId", target = "movie.movieId")
//    @Mapping(source = "movie.movieImage", target = "movie.movieImage")
//    @Mapping(source = "movie.movieName", target = "movie.movieName")
//    @Mapping(source = "movie.moviePrice", target = "movie.moviePrice")
//    @Mapping(source = "movie.duration", target = "movie.duration")
//    @Mapping(source = "movie.status", target = "movie.status")
//    @Mapping(source = "movie", target = "movie")
    ShowScheduleResponse toShowScheduleResponse(ShowSchedule showSchedule);

//    @Mapping(target = "movie", ignore = true)
    void updateShowSchedule(@MappingTarget ShowSchedule showSchedule, ShowScheduleRequest request);
}
