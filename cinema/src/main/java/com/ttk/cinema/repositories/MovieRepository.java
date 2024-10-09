package com.ttk.cinema.repositories;

import com.ttk.cinema.POJOs.Genre;
import com.ttk.cinema.POJOs.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.Set;

@Repository
public interface MovieRepository extends JpaRepository<Movie, String> {
    Optional<Movie> findByMovieName(String movieName);

    // Xóa các bản ghi trong bảng trung gian movie_genres liên quan đến Movie
    @Modifying
    @Transactional
    @Query(value = "DELETE FROM movie_genres WHERE movie_id = :movieId", nativeQuery = true)
    void deleteMovieGenresByMovieId(String movieId);

    // Xóa các bản ghi trong bảng trung gian movie_tags liên quan đến Movie
    @Modifying
    @Transactional
    @Query(value = "DELETE FROM movie_tags WHERE movie_id = :movieId", nativeQuery = true)
    void deleteMovieTagsByMovieId(String movieId);

    // Xóa các bản ghi trong bảng trung gian movie_show_events liên quan đến Movie
    @Modifying
    @Transactional
    @Query(value = "DELETE FROM movie_show_events WHERE movie_id = :movieId", nativeQuery = true)
    void deleteMovieShowEventsByMovieId(String movieId);
}
