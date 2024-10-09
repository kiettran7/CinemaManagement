package com.ttk.cinema.services;

import com.ttk.cinema.DTOs.request.GenreRequest;
import com.ttk.cinema.DTOs.response.GenreResponse;
import com.ttk.cinema.POJOs.Genre;
import com.ttk.cinema.exceptions.AppException;
import com.ttk.cinema.exceptions.ErrorCode;
import com.ttk.cinema.mappers.GenreMapper;
import com.ttk.cinema.repositories.GenreRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class GenreService {
    GenreRepository genreRepository;
    GenreMapper genreMapper;

    @PreAuthorize("hasRole('ADMIN')")
    public GenreResponse createGenre(GenreRequest request) {
        Genre genre = genreMapper.toGenre(request);
        return genreMapper.toGenreResponse(genreRepository.save(genre));
    }

    public GenreResponse getGenre(String genreId) {
        Genre genre = genreRepository.findById(genreId)
                .orElseThrow(() -> new AppException(ErrorCode.GENRE_NOT_FOUND));
        return genreMapper.toGenreResponse(genre);
    }

    public List<GenreResponse> getAllGenres() {
        return genreRepository.findAll().stream()
                .map(genreMapper::toGenreResponse)
                .toList();
    }

    @PreAuthorize("hasRole('ADMIN')")
    public void deleteGenre(String genreId) {
        Genre genre = genreRepository.findById(genreId)
                .orElseThrow(() -> new AppException(ErrorCode.GENRE_NOT_FOUND));

        genreRepository.deleteMovieGenresByGenreId(genre.getId());

        genreRepository.deleteById(genre.getId());
    }

    @PreAuthorize("hasRole('ADMIN')")
    public GenreResponse updateGenre(String genreId, GenreRequest request) {
        Genre genre = genreRepository.findById(genreId)
                .orElseThrow(() -> new AppException(ErrorCode.GENRE_NOT_FOUND));
        genreMapper.updateGenre(genre, request);
        return genreMapper.toGenreResponse(genreRepository.save(genre));
    }
}