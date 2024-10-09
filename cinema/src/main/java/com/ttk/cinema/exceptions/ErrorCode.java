package com.ttk.cinema.exceptions;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(9999, "Untegorized error", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_KEY(1001, "Invalid message key", HttpStatus.BAD_REQUEST),
    USER_EXISTED(1002, "User existed", HttpStatus.BAD_REQUEST),
    USERNAME_INVALID(1003, "Username must be at least 3 characters", HttpStatus.BAD_REQUEST),
    INVALID_PASSWORD(1004, "Password must be at least 8 characters", HttpStatus.BAD_REQUEST),
    USER_NOT_EXISTED(1005, "User not existed", HttpStatus.NOT_FOUND),
    UNAUTHENTICATED(1006, "Unauthenticated", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(1007, "You do not have permission", HttpStatus.FORBIDDEN),
    INVALID_DOB(1008, "Your age must be at least {min}", HttpStatus.BAD_REQUEST),
    GENRE_NOT_FOUND(1009, "Genre not found", HttpStatus.NOT_FOUND),
    TAG_NOT_FOUND(1010, "Tag not found", HttpStatus.NOT_FOUND),
    MOVIE_NOT_FOUND(1011, "Movie not found", HttpStatus.NOT_FOUND),
    SHOW_SCHEDULE_NOT_FOUND(1013, "Show schedule not found", HttpStatus.NOT_FOUND),
    SHOWTIME_NOT_FOUND(1014, "Showtime not found", HttpStatus.NOT_FOUND),
    SHOW_ROOM_NOT_FOUND(1015, "Show room not found", HttpStatus.NOT_FOUND),
    SHOW_EVENT_NOT_FOUND(1016, "Show event not found", HttpStatus.NOT_FOUND),
    SEAT_NOT_FOUND(1017, "Seat not found", HttpStatus.NOT_FOUND),
    SEAT_RESERVATION_NOT_FOUND(1018, "Seat reservation not found", HttpStatus.NOT_FOUND),
    TICKET_NOT_FOUND(1019, "Ticket not found", HttpStatus.NOT_FOUND),
    PROMOTION_NOT_FOUND(1020, "Promotion not found", HttpStatus.NOT_FOUND),
    BILL_NOT_FOUND(1021, "Bill not found", HttpStatus.NOT_FOUND),
    BILL_ITEM_NOT_FOUND(1022, "Bill item not found", HttpStatus.NOT_FOUND),
    ITEM_NOT_FOUND(1023, "Item not found", HttpStatus.NOT_FOUND),
    ROLE_NOT_FOUND(1024, "Role not found", HttpStatus.NOT_FOUND),
    COMMENT_NOT_FOUND(1024, "Role not found", HttpStatus.NOT_FOUND)
    ;

    private int code;
    private String message;
    private HttpStatusCode statusCode;

    ErrorCode(int code, String message, HttpStatusCode statusCode) {
        this.code = code;
        this.message = message;
        this.statusCode = statusCode;
    }

}
