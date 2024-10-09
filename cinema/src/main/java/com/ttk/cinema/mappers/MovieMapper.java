package com.ttk.cinema.mappers;

import com.ttk.cinema.DTOs.request.MovieRequest;
import com.ttk.cinema.DTOs.response.MovieResponse;
import com.ttk.cinema.POJOs.Movie;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface MovieMapper {
    @Mapping(target = "genres", ignore = true)
    @Mapping(target = "tags", ignore = true)
    @Mapping(target = "showEvents", ignore = true)
    Movie toMovie(MovieRequest request);

    MovieResponse toMovieResponse(Movie movie);

    @Mapping(target = "genres", ignore = true)
    @Mapping(target = "tags", ignore = true)
    @Mapping(target = "showEvents", ignore = true)
    void updateMovie(@MappingTarget Movie movie, MovieRequest request);
}
