package com.ttk.cinema.services;

import com.ttk.cinema.DTOs.request.MovieRequest;
import com.ttk.cinema.DTOs.response.MovieResponse;
import com.ttk.cinema.POJOs.Genre;
import com.ttk.cinema.POJOs.Movie;
import com.ttk.cinema.POJOs.Tag;
import com.ttk.cinema.exceptions.AppException;
import com.ttk.cinema.exceptions.ErrorCode;
import com.ttk.cinema.mappers.MovieMapper;
import com.ttk.cinema.repositories.*;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MovieService {
    MovieRepository movieRepository;
    MovieMapper movieMapper;
    CloudinaryService cloudinaryService;
    GenreRepository genreRepository;
    TagRepository tagRepository;
    ShowEventRepository showEventRepository;
    CommentRepository commentRepository;

    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'CUSTOMER')")
    public MovieResponse createMovie(MovieRequest request) throws IOException {
        Movie movie = movieMapper.toMovie(request);

        if (request.getFile() != null && !request.getFile().isEmpty()) {
            movie.setMovieImage(cloudinaryService.uploadFile(request.getFile()));
        }

        var genres = genreRepository.findAllById(request.getGenres());
        var tags = tagRepository.findAllById(request.getTags());
        var showEvents = showEventRepository.findAllById(request.getShowEvents());

        movie.setGenres(new HashSet<>(genres));
        movie.setTags(new HashSet<>(tags));
        movie.setShowEvents(new HashSet<>(showEvents));

        movie = movieRepository.save(movie);

        return movieMapper.toMovieResponse(movie);
    }


    public MovieResponse getMovie(String movieId) {
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new AppException(ErrorCode.MOVIE_NOT_FOUND));
        return movieMapper.toMovieResponse(movie);
    }

    public List<MovieResponse> getAllMovies() {
        return movieRepository.findAll().stream()
                .map(movieMapper::toMovieResponse)
                .toList();
    }

    @PreAuthorize("hasRole('ADMIN')")
    public void deleteMovie(String movieId) {
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new AppException(ErrorCode.MOVIE_NOT_FOUND));
        var comments = commentRepository.findAll();

        for (var comment : comments) {
            if (comment.getMovie() == movie) {
                commentRepository.delete(comment);
            }
        }

        movieRepository.deleteMovieTagsByMovieId(movie.getId());
        movieRepository.deleteMovieGenresByMovieId(movie.getId());
        movieRepository.deleteMovieShowEventsByMovieId(movie.getId());

        movieRepository.deleteById(movie.getId());
    }

    @PreAuthorize("hasRole('ADMIN')")
    public MovieResponse updateMovie(String movieId, MovieRequest request) throws IOException {
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new AppException(ErrorCode.MOVIE_NOT_FOUND));

        movieMapper.updateMovie(movie, request);

        if (request.getFile() != null && !request.getFile().isEmpty()) {
            movie.setMovieImage(cloudinaryService.uploadFile(request.getFile()));
        }

        var genres = genreRepository.findAllById(request.getGenres());
        var tags = tagRepository.findAllById(request.getTags());
        var showEvents = showEventRepository.findAllById(request.getShowEvents());

        movie.setGenres(new HashSet<>(genres));
        movie.setTags(new HashSet<>(tags));
        movie.setShowEvents(new HashSet<>(showEvents));

        return movieMapper.toMovieResponse(movieRepository.save(movie));
    }
}

