package com.busticketbooking.tickets.service;

import com.busticketbooking.tickets.service.dto.TicketDTO;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

/**
 * Service Interface for managing Ticket.
 */
public interface TicketService {

    /**
     * Save a ticket.
     *
     * @param ticketDTO the entity to save
     * @return the persisted entity
     */
    TicketDTO save(TicketDTO ticketDTO);

    /**
     * Get all the tickets.
     *
     * @param pageable the pagination information
     * @return the list of entities
     */
    Page<TicketDTO> findAll(Pageable pageable);


    /**
     * Get the "id" ticket.
     *
     * @param id the id of the entity
     * @return the entity
     */
    Optional<TicketDTO> findOne(Long id);

    /**
     * Delete the "id" ticket.
     *
     * @param id the id of the entity
     */
    void delete(Long id);
}
