package com.ttk.cinema.repositories;

import com.ttk.cinema.POJOs.Showtime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ShowtimeRepository extends JpaRepository<Showtime, String> {
    Optional<Showtime> findByStartTime(String startTime);
    Optional<Showtime> findByEndTime(String endTime);
}
