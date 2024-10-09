package com.ttk.cinema.mappers;

import com.ttk.cinema.DTOs.request.GenreRequest;
import com.ttk.cinema.DTOs.response.GenreResponse;
import com.ttk.cinema.POJOs.Genre;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface GenreMapper {
    Genre toGenre(GenreRequest request);
    GenreResponse toGenreResponse(Genre genre);

    void updateGenre(@MappingTarget Genre genre, GenreRequest request);
}
