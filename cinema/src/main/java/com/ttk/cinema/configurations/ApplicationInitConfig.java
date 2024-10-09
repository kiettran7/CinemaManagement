package com.ttk.cinema.configurations;

import com.ttk.cinema.POJOs.*;
import com.ttk.cinema.repositories.*;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.dao.DataAccessException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Configuration
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ApplicationInitConfig {
    PasswordEncoder passwordEncoder;

    UserRepository userRepository;
    ShowEventRepository showEventRepository;
    ShowtimeRepository showtimeRepository;
    ShowScheduleRepository showScheduleRepository;
    MovieRepository movieRepository;
    RoleRepository roleRepository;
    GenreRepository genreRepository;
    TagRepository tagRepository;
    ShowRoomRepository showRoomRepository;
    SeatRepository seatRepository;
    PromotionRepository promotionRepository;
    ItemRepository itemRepository;
    CommentRepository commentRepository;

    @Bean
    ApplicationRunner applicationRunner() {
        return args -> {
            if (!databaseExists()) {
                
                initializeRoles();
                initializeUsers();
                initializeGenres();
                initializeTags();
                initializeShowSchedules();
                initializeShowtimes();
                initializeShowRooms();
                initializeShowEvents_Seats();
                initializePromotions_Items_Movies_Comments();

                log.warn("Admin user has been created with information:admin-12345678, please change it!");
            } else {
                log.info("Database already exists, initialization skipped.");
            }
        };
    }

    private boolean databaseExists() {
        try {
            // Kiểm tra xem có ít nhất một Role trong cơ sở dữ liệu hay không
            return roleRepository.count() > 0;
        } catch (DataAccessException e) {
            log.error("Database not found, initializing...", e);
            return false; // Nếu không tìm thấy, trả về false
        }
    }

    private void initializeRoles() {
        Role adminRole = Role.builder().name("ADMIN").description("admin role").build();
        Role staffRole = Role.builder().name("STAFF").description("staff role").build();
        Role customerRole = Role.builder().name("CUSTOMER").description("customer role").build();
        roleRepository.saveAll(List.of(adminRole, staffRole, customerRole));
    }

    private void initializeUsers() {
        Role adminRole = roleRepository.findByName("ADMIN").orElseThrow();
        Role staffRole = roleRepository.findByName("STAFF").orElseThrow();
        Role customerRole = roleRepository.findByName("CUSTOMER").orElseThrow();

        List<User> users = new ArrayList<>();

        users.add(createUser("staff_hoang", "hoang@example.com", "0912345678", "Nguyễn Hoàng", LocalDate.of(1988, 7, 15), Set.of(staffRole)));
        users.add(createUser("staff_hanh", "hanh@example.com", "0912345679", "Trần Hạnh", LocalDate.of(1990, 2, 20), Set.of(staffRole)));
        users.add(createUser("customer_tuan", "tuan@example.com", "0912345680", "Lê Tuấn", LocalDate.of(1995, 1, 25), Set.of(customerRole)));
        users.add(createUser("customer_thao", "thao@example.com", "0912345681", "Phạm Thảo", LocalDate.of(1997, 3, 30), Set.of(customerRole)));
        users.add(createUser("customer_anh", "anh@example.com", "0912345682", "Trương Anh", LocalDate.of(1999, 4, 10), Set.of(customerRole)));
        users.add(createUser("customer_hai", "hai@example.com", "0912345683", "Nguyễn Hải", LocalDate.of(1998, 5, 18), Set.of(customerRole)));
        users.add(createUser("customer_linh", "linh@example.com", "0912345684", "Nguyễn Linh", LocalDate.of(1996, 8, 14), Set.of(customerRole)));
        users.add(createUser("customer_khoa", "khoa@example.com", "0912345685", "Nguyễn Khóa", LocalDate.of(1994, 11, 29), Set.of(customerRole)));
        users.add(createUser("customer_minh", "minh@example.com", "0912345686", "Nguyễn Minh", LocalDate.of(1993, 12, 5), Set.of(customerRole)));
        users.add(createUser("customer_phuong", "phuong@example.com", "0912345687", "Nguyễn Phương", LocalDate.of(1995, 7, 20), Set.of(customerRole)));
        users.add(createUser("admin", "kiet@example.com", "0912383020", "Kiet", LocalDate.of(1995, 7, 20), Set.of(adminRole)));

        userRepository.saveAll(users);
    }

    private void initializeGenres() {
        Genre action = Genre.builder().genreName("Hành động").build();
        Genre sciFi = Genre.builder().genreName("Khoa học viễn tưởng").build();
        Genre comedy = Genre.builder().genreName("Hài hước").build();
        Genre psychology = Genre.builder().genreName("Tâm lý").build();
        Genre horror = Genre.builder().genreName("Kinh dị").build();
        Genre mythology = Genre.builder().genreName("Thần thoại").build();
        Genre comedyGenre = Genre.builder().genreName("Hài").build();

        List<Genre> genres = List.of(action, sciFi, comedy, psychology, horror, mythology, comedyGenre);
        genreRepository.saveAll(genres);
    }

    private void initializeTags() {
        Tag interesting = Tag.builder().tagName("Thú vị").build();
        Tag outstanding = Tag.builder().tagName("Nổi bật").build();
        Tag mustSee = Tag.builder().tagName("Đáng xem").build();
        Tag goodMovie = Tag.builder().tagName("Phim hay").build();
        Tag entertainment = Tag.builder().tagName("Giải trí").build();

        List<Tag> tags = List.of(interesting, outstanding, mustSee, goodMovie, entertainment);
        tagRepository.saveAll(tags);
    }

    private void initializeShowRooms() {
        ShowRoom roomA = ShowRoom.builder().showRoomName("Phòng A").build();
        ShowRoom roomB = ShowRoom.builder().showRoomName("Phòng B").build();
        ShowRoom roomC = ShowRoom.builder().showRoomName("Phòng C").build();
        ShowRoom roomD = ShowRoom.builder().showRoomName("Phòng D").build();

        List<ShowRoom> showRooms = List.of(roomA, roomB, roomC, roomD);
        showRoomRepository.saveAll(showRooms);
    }

    private void initializePromotions_Items_Movies_Comments() {
        // Initialize Promotion
        Promotion promotion1 = Promotion.builder().promotionName("Giảm 10%").discountValue(0.1f).build();
        Promotion promotion2 = Promotion.builder().promotionName("Giảm 20%").discountValue(0.2f).build();
        Promotion promotion3 = Promotion.builder().promotionName("Giảm 30%").discountValue(0.3f).build();

        List<Promotion> promotions = List.of(promotion1, promotion2, promotion3);
        promotionRepository.saveAll(promotions);

        // Initialize Item
        Item drink = Item.builder().itemName("Nước ngọt").itemType("DRINK").itemPrice(20000).build();
        Item popcorn = Item.builder().itemName("Bỏng ngô").itemType("FOOD").itemPrice(30000).build();
        Item candy = Item.builder().itemName("Kẹo").itemType("FOOD").itemPrice(15000).build();

        List<Item> items = List.of(drink, popcorn, candy);
        itemRepository.saveAll(items);

        // Lưu tất cả các ShowEvent vào cơ sở dữ liệu trước đó
        List<ShowEvent> savedShowEvents = showEventRepository.findAll();

        // Initialize Movies
        Movie movie1 = Movie.builder()
                .movieImage("https://res.cloudinary.com/dwxbe1pau/image/upload/v1727254811/je7c9prwccfnhf8l20hp.jpg")
                .moviePrice(100000f)
                .movieName("Avengers: Endgame")
                .duration(181)
                .status("UPCOMING")
                .tags(new HashSet<>(tagRepository.findByTagNameIn(List.of("Nổi bật", "Thú vị"))))
                .genres(new HashSet<>(genreRepository.findByGenreNameIn(List.of("Hành động", "Khoa học viễn tưởng"))))
                .showEvents(new HashSet<>(List.of(
                        savedShowEvents.get(0), // ShowEvent 1
                        savedShowEvents.get(1), // ShowEvent 2
                        savedShowEvents.get(2)  // ShowEvent 3
                )))
                .build();

        Movie movie2 = Movie.builder()
                .movieImage("https://res.cloudinary.com/dwxbe1pau/image/upload/v1727254868/fxaxhk92xsesztnejqst.jpg")
                .moviePrice(120000f)
                .movieName("Inception")
                .duration(148)
                .status("NOW_SHOWING")
                .tags(new HashSet<>(tagRepository.findByTagNameIn(List.of("Đáng xem", "Thú vị"))))
                .genres(new HashSet<>(genreRepository.findByGenreNameIn(List.of("Khoa học viễn tưởng", "Tâm lý"))))
                .showEvents(new HashSet<>(List.of(
                        savedShowEvents.get(3), // ShowEvent 4
                        savedShowEvents.get(4), // ShowEvent 5
                        savedShowEvents.get(5)  // ShowEvent 6
                )))
                .build();

        Movie movie3 = Movie.builder()
                .movieImage("https://res.cloudinary.com/dwxbe1pau/image/upload/v1727254900/tjgvnenlfkolkeoqejwd.jpg")
                .moviePrice(150000f)
                .movieName("Parasite")
                .duration(132)
                .status("UPCOMING")
                .tags(new HashSet<>(tagRepository.findByTagNameIn(List.of("Nổi bật", "Phim hay"))))
                .genres(new HashSet<>(genreRepository.findByGenreNameIn(List.of("Tâm lý", "Kinh dị"))))
                .showEvents(new HashSet<>(List.of(
                        savedShowEvents.get(6) // ShowEvent 7
                )))
                .build();

        Movie movie4 = Movie.builder()
                .movieImage("https://res.cloudinary.com/dwxbe1pau/image/upload/v1728428087/tumblr_m7v0cvipfq1qzo15n_mxnqjj.jpg")
                .moviePrice(110000f)
                .movieName("The Dark Knight Rises")
                .duration(164)
                .status("NOW_SHOWING")
                .tags(new HashSet<>(tagRepository.findByTagNameIn(List.of("Nổi bật", "Hành động"))))
                .genres(new HashSet<>(genreRepository.findByGenreNameIn(List.of("Hành động", "Tâm lý"))))
                .showEvents(new HashSet<>(List.of(
                        savedShowEvents.get(7), // ShowEvent 8
                        savedShowEvents.get(8)  // ShowEvent 9
                )))
                .build();

        Movie movie5 = Movie.builder()
                .movieImage("https://res.cloudinary.com/dwxbe1pau/image/upload/v1727254928/syp4zotgb2hkyst8kilt.jpg")
                .moviePrice(130000f)
                .movieName("Interstellar")
                .duration(169)
                .status("UPCOMING")
                .tags(new HashSet<>(tagRepository.findByTagNameIn(List.of("Đáng xem", "Khoa học viễn tưởng"))))
                .genres(new HashSet<>(genreRepository.findByGenreNameIn(List.of("Khoa học viễn tưởng", "Hành động"))))
                .showEvents(new HashSet<>(List.of(
                        savedShowEvents.get(9),  // ShowEvent 10
                        savedShowEvents.get(10) // ShowEvent 11
                )))
                .build();

        Movie movie6 = Movie.builder()
                .movieImage("https://res.cloudinary.com/dwxbe1pau/image/upload/v1728429103/avatar__the_way_of_water__2022__poster_textess__2_by_mintmovi3_dfh03vs-pre.jpg_oetrnp.jpg")
                .moviePrice(140000f)
                .movieName("Avatar: The Way of Water")
                .duration(192)
                .status("NOW_SHOWING")
                .tags(new HashSet<>(tagRepository.findByTagNameIn(List.of("Nổi bật", "Hành động"))))
                .genres(new HashSet<>(genreRepository.findByGenreNameIn(List.of("Khoa học viễn tưởng", "Hành động"))))
                .showEvents(new HashSet<>(List.of(
                        savedShowEvents.get(11), // ShowEvent 12
                        savedShowEvents.get(12)  // ShowEvent 13
                )))
                .build();

        Movie movie7 = Movie.builder()
                .movieImage("https://res.cloudinary.com/dwxbe1pau/image/upload/v1728429186/MV5BZTMyZTA0ZTItYjY3Yi00ODNjLWExYTgtYzgxZTk0NTg0Y2FlXkEyXkFqcGc_._V1__ruiowl.jpg")
                .moviePrice(120000f)
                .movieName("Black Widow")
                .duration(134)
                .status("NOW_SHOWING")
                .tags(new HashSet<>(tagRepository.findByTagNameIn(List.of("Nổi bật", "Hành động"))))
                .genres(new HashSet<>(genreRepository.findByGenreNameIn(List.of("Hành động", "Khoa học viễn tưởng"))))
                .showEvents(new HashSet<>(List.of(
                        savedShowEvents.get(13) // ShowEvent 14
                )))
                .build();

        Movie movie8 = Movie.builder()
                .movieImage("https://res.cloudinary.com/dwxbe1pau/image/upload/v1728428256/KHagyirtj9vkyR3blrdw-TFADcSFYh4pBJQHQTz2YbT_vSGwweA4SIh7jZWvHB7jj2W16lOVow-yUer0qTI_recdjx.jpg")
                .moviePrice(110000f)
                .movieName("No Time to Die")
                .duration(163)
                .status("NOW_SHOWING")
                .tags(new HashSet<>(tagRepository.findByTagNameIn(List.of("Nổi bật", "Hành động"))))
                .genres(new HashSet<>(genreRepository.findByGenreNameIn(List.of("Hành động", "Phiêu lưu"))))
                .showEvents(new HashSet<>(List.of(
                        savedShowEvents.get(14), // ShowEvent 15
                        savedShowEvents.get(15) // ShowEvent 16
                )))
                .build();

        Movie movie9 = Movie.builder()
                .movieImage("https://res.cloudinary.com/dwxbe1pau/image/upload/v1727255027/l8eh7qffmo8r6ojctn6d.jpg")
                .moviePrice(150000f)
                .movieName("Spider-Man: No Way Home")
                .duration(148)
                .status("NOW_SHOWING")
                .tags(new HashSet<>(tagRepository.findByTagNameIn(List.of("Nổi bật", "Hành động"))))
                .genres(new HashSet<>(genreRepository.findByGenreNameIn(List.of("Hành động", "Khoa học viễn tưởng"))))
                .showEvents(new HashSet<>(List.of(
                        savedShowEvents.get(16), // ShowEvent 17
                        savedShowEvents.get(17)  // ShowEvent 18
                )))
                .build();

        Movie movie10 = Movie.builder()
                .movieImage("https://res.cloudinary.com/dwxbe1pau/image/upload/v1728428355/jcW6qz6j4QnYQbyPiNcP8GGL8TKG-o3YBwCfSsOfBrz5JFEkYEShG7cwWFsDFO0YTk-H8OLSHSjxOhZ0rSk_ep5bkz.jpg")
                .moviePrice(100000f)
                .movieName("Minions: The Rise of Gru")
                .duration(87)
                .status("NOW_SHOWING")
                .tags(new HashSet<>(tagRepository.findByTagNameIn(List.of("Nổi bật", "Hài"))))
                .genres(new HashSet<>(genreRepository.findByGenreNameIn(List.of("Hoạt hình", "Hài"))))
                .showEvents(new HashSet<>(List.of(
                        savedShowEvents.get(18) // ShowEvent 19
                )))
                .build();

        Movie movie11 = Movie.builder()
                .movieImage("https://res.cloudinary.com/dwxbe1pau/image/upload/v1728428424/MV5BZDM3ZWY3MDItOGY0Yy00NDRlLWFmNmUtNDI3YWE0OGNiZDE2XkEyXkFqcGc_._V1__d0hbin.jpg")
                .moviePrice(120000f)
                .movieName("Lightyear")
                .duration(100)
                .status("UPCOMING")
                .tags(new HashSet<>(tagRepository.findByTagNameIn(List.of("Nổi bật", "Hoạt hình"))))
                .genres(new HashSet<>(genreRepository.findByGenreNameIn(List.of("Hoạt hình", "Phiêu lưu"))))
                .showEvents(new HashSet<>(List.of(
                        savedShowEvents.get(19) // ShowEvent 20
                )))
                .build();

        Movie movie12 = Movie.builder()
                .movieImage("https://res.cloudinary.com/dwxbe1pau/image/upload/v1728428927/productimg_bgh1db.jpg")
                .moviePrice(130000f)
                .movieName("The Suicide Squad")
                .duration(132)
                .status("NOW_SHOWING")
                .tags(new HashSet<>(tagRepository.findByTagNameIn(List.of("Nổi bật", "Hài"))))
                .genres(new HashSet<>(genreRepository.findByGenreNameIn(List.of("Hành động", "Hài"))))
                .showEvents(new HashSet<>(List.of(
                        savedShowEvents.get(1), // ShowEvent 2
                        savedShowEvents.get(3) // ShowEvent 4
                )))
                .build();

        Movie movie13 = Movie.builder()
                .movieImage("https://res.cloudinary.com/dwxbe1pau/image/upload/v1728428828/anh-1-15804865039901008603986_myfz5j.jpg")
                .moviePrice(140000f)
                .movieName("Fast & Furious 9")
                .duration(143)
                .status("NOW_SHOWING")
                .tags(new HashSet<>(tagRepository.findByTagNameIn(List.of("Nổi bật", "Hành động"))))
                .genres(new HashSet<>(genreRepository.findByGenreNameIn(List.of("Hành động", "Phiêu lưu"))))
                .showEvents(new HashSet<>(List.of(
                        savedShowEvents.get(0), // ShowEvent 1
                        savedShowEvents.get(6) // ShowEvent 7
                )))
                .build();

        Movie movie14 = Movie.builder()
                .movieImage("https://res.cloudinary.com/dwxbe1pau/image/upload/v1728428998/FPqeT1KUYAIEh6i_fszzdt.jpg")
                .moviePrice(130000f)
                .movieName("Doctor Strange in the Multiverse of Madness")
                .duration(126)
                .status("UPCOMING")
                .tags(new HashSet<>(tagRepository.findByTagNameIn(List.of("Nổi bật", "Khoa học viễn tưởng"))))
                .genres(new HashSet<>(genreRepository.findByGenreNameIn(List.of("Khoa học viễn tưởng", "Hành động"))))
                .showEvents(new HashSet<>(List.of(
                        savedShowEvents.get(7), // ShowEvent 8
                        savedShowEvents.get(14) // ShowEvent 15
                )))
                .build();

        Movie movie15 = Movie.builder()
                .movieImage("https://res.cloudinary.com/dwxbe1pau/image/upload/v1728428722/MV5BZjRiMDhiZjQtNjk5Yi00ZDcwLTkyYTEtMDc1NjdmNjFhNGIzXkEyXkFqcGc_._V1__mn0jkv.jpg")
                .moviePrice(120000f)
                .movieName("Thor: Love and Thunder")
                .duration(119)
                .status("NOW_SHOWING")
                .tags(new HashSet<>(tagRepository.findByTagNameIn(List.of("Nổi bật", "Hành động"))))
                .genres(new HashSet<>(genreRepository.findByGenreNameIn(List.of("Hành động", "Khoa học viễn tưởng"))))
                .showEvents(new HashSet<>(List.of(
                        savedShowEvents.get(9), // ShowEvent 10
                        savedShowEvents.get(1)  // ShowEvent 2
                )))
                .build();

        // Lưu tất cả các bộ phim vào cơ sở dữ liệu
        movieRepository.saveAll(List.of(
                movie1, movie2, movie3, movie4, movie5,
                movie6, movie7, movie8, movie9, movie10,
                movie11, movie12, movie13, movie14, movie15
        ));
    }

    private void initializeShowSchedules() {
        LocalDate currentDate = LocalDate.now(); // Ngày hiện tại
        LocalDate showDate1 = currentDate; // Ngày hiện tại
        LocalDate showDate2 = currentDate.plusDays(1); // Ngày tiếp theo
        LocalDate showDate3 = currentDate.plusDays(2); // Ngày tiếp theo
        LocalDate showDate4 = currentDate.plusDays(3); // Ngày tiếp theo
        LocalDate showDate5 = currentDate.plusDays(4); // Ngày tiếp theo

        // Tạo danh sách lịch chiếu
        List<ShowSchedule> showSchedules = List.of(
                ShowSchedule.builder().showDate(showDate1).build(),
                ShowSchedule.builder().showDate(showDate2).build(),
                ShowSchedule.builder().showDate(showDate3).build(),
                ShowSchedule.builder().showDate(showDate4).build(),
                ShowSchedule.builder().showDate(showDate5).build()
        );

        // Lưu tất cả lịch chiếu vào cơ sở dữ liệu
        showScheduleRepository.saveAll(showSchedules);
    }

    private void initializeShowtimes() {
        List<Showtime> showtimes = List.of(
                Showtime.builder().startTime("10:00").endTime("12:30").build(),
                Showtime.builder().startTime("13:00").endTime("15:30").build(),
                Showtime.builder().startTime("16:00").endTime("18:30").build(),
                Showtime.builder().startTime("19:00").endTime("21:30").build(),
                Showtime.builder().startTime("20:30").endTime("23:00").build()
        );
        showtimeRepository.saveAll(showtimes);
    }

    private void initializeShowEvents_Seats() {
        // Tìm kiếm các showtime
        Showtime showtime1 = showtimeRepository.findByStartTime("10:00").orElseThrow();
        Showtime showtime2 = showtimeRepository.findByStartTime("13:00").orElseThrow();
        Showtime showtime3 = showtimeRepository.findByStartTime("16:00").orElseThrow();
        Showtime showtime4 = showtimeRepository.findByStartTime("19:00").orElseThrow();
        Showtime showtime5 = showtimeRepository.findByStartTime("20:30").orElseThrow();

        // Tìm kiếm các phòng chiếu
        ShowRoom showRoomA = showRoomRepository.findByShowRoomName("Phòng A").orElseThrow();
        ShowRoom showRoomB = showRoomRepository.findByShowRoomName("Phòng B").orElseThrow();
        ShowRoom showRoomC = showRoomRepository.findByShowRoomName("Phòng C").orElseThrow();
        ShowRoom showRoomD = showRoomRepository.findByShowRoomName("Phòng D").orElseThrow();

        List<Seat> seats = new ArrayList<>();

        // Ghế trong các phòng
        for (ShowRoom room : List.of(showRoomA, showRoomB, showRoomC, showRoomD)) {
            for (int i = 1; i <= 20; i++) {
                seats.add(Seat.builder()
                        .seatName(String.valueOf(room.getShowRoomName().charAt(room.getShowRoomName().length() - 1)).concat(String.valueOf(i)))
                        .showRoom(room).build());
            }
        }

        seatRepository.saveAll(seats);

        // Tìm kiếm các ngày chiếu
        LocalDate currentDate = LocalDate.now(); // Ngày hiện tại
        ShowSchedule showSchedule1 = showScheduleRepository
                .findByShowDate(currentDate).orElseThrow();
        ShowSchedule showSchedule2 = showScheduleRepository
                .findByShowDate(currentDate.plusDays(1)).orElseThrow();
        ShowSchedule showSchedule3 = showScheduleRepository
                .findByShowDate(currentDate.plusDays(2)).orElseThrow();
        ShowSchedule showSchedule4 = showScheduleRepository
                .findByShowDate(currentDate.plusDays(3)).orElseThrow();
        ShowSchedule showSchedule5 = showScheduleRepository
                .findByShowDate(currentDate.plusDays(4)).orElseThrow();

        // Tạo danh sách sự kiện chiếu
        List<ShowEvent> showEvents = List.of(
                // Lịch chiếu ngày 25/9/2024
                ShowEvent.builder().showSchedule(showSchedule1).showRoom(showRoomA).showtime(showtime1).build(),
                ShowEvent.builder().showSchedule(showSchedule1).showRoom(showRoomB).showtime(showtime2).build(),
                ShowEvent.builder().showSchedule(showSchedule1).showRoom(showRoomC).showtime(showtime3).build(),
                ShowEvent.builder().showSchedule(showSchedule1).showRoom(showRoomD).showtime(showtime4).build(),

                // Lịch chiếu ngày 26/9/2024
                ShowEvent.builder().showSchedule(showSchedule2).showRoom(showRoomA).showtime(showtime5).build(),
                ShowEvent.builder().showSchedule(showSchedule2).showRoom(showRoomB).showtime(showtime2).build(),
                ShowEvent.builder().showSchedule(showSchedule2).showRoom(showRoomC).showtime(showtime1).build(),
                ShowEvent.builder().showSchedule(showSchedule2).showRoom(showRoomD).showtime(showtime2).build(),

                // Lịch chiếu ngày 27/9/2024
                ShowEvent.builder().showSchedule(showSchedule3).showRoom(showRoomA).showtime(showtime3).build(),
                ShowEvent.builder().showSchedule(showSchedule3).showRoom(showRoomB).showtime(showtime4).build(),
                ShowEvent.builder().showSchedule(showSchedule3).showRoom(showRoomC).showtime(showtime5).build(),
                ShowEvent.builder().showSchedule(showSchedule3).showRoom(showRoomD).showtime(showtime1).build(),

                // Lịch chiếu ngày 28/9/2024
                ShowEvent.builder().showSchedule(showSchedule4).showRoom(showRoomA).showtime(showtime1).build(),
                ShowEvent.builder().showSchedule(showSchedule4).showRoom(showRoomB).showtime(showtime2).build(),
                ShowEvent.builder().showSchedule(showSchedule4).showRoom(showRoomC).showtime(showtime3).build(),
                ShowEvent.builder().showSchedule(showSchedule4).showRoom(showRoomD).showtime(showtime4).build(),

                // Lịch chiếu ngày 29/9/2024
                ShowEvent.builder().showSchedule(showSchedule5).showRoom(showRoomA).showtime(showtime5).build(),
                ShowEvent.builder().showSchedule(showSchedule5).showRoom(showRoomB).showtime(showtime3).build(),
                ShowEvent.builder().showSchedule(showSchedule5).showRoom(showRoomC).showtime(showtime1).build(),
                ShowEvent.builder().showSchedule(showSchedule5).showRoom(showRoomD).showtime(showtime2).build()
        );

        // Lưu tất cả sự kiện chiếu vào cơ sở dữ liệu
        showEventRepository.saveAll(showEvents);
    }

    private User createUser(String username, String email, String phone, String fullName, LocalDate birthday, Set<Role> roles) {
        return User.builder()
                .username(username)
                .avatar("https://w7.pngwing.com/pngs/340/946/png-transparent-avatar-user-computer-icons-software-developer-avatar-child-face-heroes-thumbnail.png")
                .password(passwordEncoder.encode("12345678")) // Mã hóa mật khẩu
                .email(email)
                .phone(phone)
                .fullName(fullName)
                .birthday(birthday)
                .joinedDate(LocalDate.now())
                .roles(roles)
                .build();
    }

}