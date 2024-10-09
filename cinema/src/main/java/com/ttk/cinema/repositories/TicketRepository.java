package com.ttk.cinema.repositories;

import com.ttk.cinema.POJOs.Bill;
import com.ttk.cinema.POJOs.Ticket;
import com.ttk.cinema.POJOs.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, String> {
        List<Ticket> findAllByCustomer(User customer);
        List<Ticket> findAllByStaff(User staff);
        List<Ticket> findByBill(Bill bill);
}
