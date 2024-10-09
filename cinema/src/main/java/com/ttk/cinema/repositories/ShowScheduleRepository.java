package com.ttk.cinema.repositories;

import com.ttk.cinema.POJOs.ShowSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ShowScheduleRepository extends JpaRepository<ShowSchedule, String> {
    //    Optional<ShowSchedule> findByMovie_MovieName(String movieName);
    Optional<ShowSchedule> findByShowDate(LocalDate showDate);
}

