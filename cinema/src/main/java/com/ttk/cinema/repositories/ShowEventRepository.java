package com.ttk.cinema.repositories;

import com.ttk.cinema.POJOs.ShowEvent;
import com.ttk.cinema.POJOs.ShowRoom;
import com.ttk.cinema.POJOs.ShowSchedule;
import com.ttk.cinema.POJOs.Showtime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Repository
public interface ShowEventRepository extends JpaRepository<ShowEvent, String> {
    Optional<ShowEvent> findByShowtime(Showtime showtime);
    Optional<ShowEvent> findByShowRoom(ShowRoom showRoom);
    Optional<ShowEvent> findByShowSchedule(ShowSchedule showSchedule);
    Optional<ShowEvent> findByShowtimeAndShowRoom(Showtime showtime, ShowRoom showRoom);
    Optional<ShowEvent> findByShowScheduleAndShowtime(ShowSchedule showSchedule, Showtime showtime);
    Optional<ShowEvent> findByShowScheduleAndShowRoomAndShowtime(ShowSchedule showSchedule, ShowRoom showRoom, Showtime showtime);

    // Xóa các bản ghi trong bảng trung gian movie_show_events liên quan đến ShowEvent
    @Modifying
    @Transactional
    @Query(value = "DELETE FROM movie_show_events WHERE show_events_id = :showEventId", nativeQuery = true)
    void deleteMovieShowEventsByShowEventId(String showEventId);
}
