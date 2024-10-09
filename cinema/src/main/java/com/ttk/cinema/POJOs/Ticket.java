package com.ttk.cinema.POJOs;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
public class Ticket {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    float ticketPrice;
    LocalDate createdDate;
    String status; // PENDING, PAID, CANCELLED
    String bookingType; // PRE-BOOKED, WALK-IN

    @ManyToOne
    ShowEvent showEvent;

    @ManyToOne
    Bill bill;

    @ManyToOne
    Seat seat;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    User customer;

    @ManyToOne
    @JoinColumn(name = "staff_id")
    User staff;

    @ManyToOne
    Movie movie;

    @PrePersist
    public void prePersist() {
        if (createdDate == null) {
            createdDate = LocalDate.now();
        }
    }
}
