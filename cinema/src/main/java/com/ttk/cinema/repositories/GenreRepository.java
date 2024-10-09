package com.ttk.cinema.repositories;

import com.ttk.cinema.POJOs.Genre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface GenreRepository extends JpaRepository<Genre, String> {
    Set<Genre> findByGenreName(String genreName);
    Set<Genre> findByGenreNameIn(List<String> genreNames);

    // Xóa các bản ghi trong bảng trung gian movie_genres liên quan đến Genre
    @Modifying
    @Transactional
    @Query(value = "DELETE FROM movie_genres WHERE genres_id = :genreId", nativeQuery = true)
    void deleteMovieGenresByGenreId(String genreId);
}
