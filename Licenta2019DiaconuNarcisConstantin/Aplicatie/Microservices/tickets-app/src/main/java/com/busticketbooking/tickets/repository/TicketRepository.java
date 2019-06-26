package com.busticketbooking.tickets.repository;

import java.time.LocalDate;
import java.util.List;

import com.busticketbooking.tickets.domain.Ticket;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the Ticket entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {
    List<Ticket> findByBusAndDate(Long bus, LocalDate date);
    List<Ticket> findByUser(Long user);
}
