package com.busticketbooking.tickets.service.impl;

import com.busticketbooking.tickets.service.TicketService;
import com.busticketbooking.tickets.domain.Ticket;
import com.busticketbooking.tickets.repository.TicketRepository;
import com.busticketbooking.tickets.service.dto.OcupiedSeatsDTO;
import com.busticketbooking.tickets.service.dto.TicketDTO;
import com.busticketbooking.tickets.service.mapper.TicketMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Service Implementation for managing Ticket.
 */
@Service
@Transactional
public class TicketServiceImpl implements TicketService {

    private final Logger log = LoggerFactory.getLogger(TicketServiceImpl.class);

    private final TicketRepository ticketRepository;

    private final TicketMapper ticketMapper;

    public TicketServiceImpl(TicketRepository ticketRepository, TicketMapper ticketMapper) {
        this.ticketRepository = ticketRepository;
        this.ticketMapper = ticketMapper;
    }

    /**
     * Save a ticket.
     *
     * @param ticketDTO the entity to save
     * @return the persisted entity
     */
    @Override
    public TicketDTO save(TicketDTO ticketDTO) {
        log.debug("Request to save Ticket : {}", ticketDTO);
        Ticket ticket = ticketMapper.toEntity(ticketDTO);
        ticket = ticketRepository.save(ticket);
        return ticketMapper.toDto(ticket);
    }

    /**
     * Get all the tickets.
     *
     * @param pageable the pagination information
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public Page<TicketDTO> findAll(Pageable pageable) {
        log.debug("Request to get all Tickets");
        return ticketRepository.findAll(pageable)
            .map(ticketMapper::toDto);
    }


    /**
     * Get one ticket by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<TicketDTO> findOne(Long id) {
        log.debug("Request to get Ticket : {}", id);
        return ticketRepository.findById(id)
            .map(ticketMapper::toDto);
    }

    /**
     * Delete the ticket by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete Ticket : {}", id);
        ticketRepository.deleteById(id);
    }

    @Override
    public Long getOcupiedSeats(OcupiedSeatsDTO ocupiedSeatsDTO) {
        int startPosition = ocupiedSeatsDTO.getStops().indexOf(ocupiedSeatsDTO.getStartStation());
        int endPosition = ocupiedSeatsDTO.getStops().indexOf(ocupiedSeatsDTO.getEndStation());

        Long result = new Long(0);
        for(int i=0; i < ocupiedSeatsDTO.getStops().size(); i++) {
            if (i < endPosition) {
                result += getOcupiedSeatsInLocation(ocupiedSeatsDTO, i);
            }
            if (i <= startPosition) {
                result -= getEliberatedSeats(ocupiedSeatsDTO, i);
            }
        }
        return result;
    }

    private int getOcupiedSeatsInLocation(OcupiedSeatsDTO ocupiedSeatsDTO, int index) {
        int result = 0;
        List<Ticket> tickets = this.ticketRepository.findByBusAndDate(ocupiedSeatsDTO.getBus(), ocupiedSeatsDTO.getDate());
        Long location = ocupiedSeatsDTO.getStops().get(index);
        for (Ticket ticket : tickets) {
            if (ticket.getStartStation().equals(location)) {
                result += ticket.getPlaces();
            }
        }

        return result;
    }

    private int getEliberatedSeats(OcupiedSeatsDTO ocupiedSeatsDTO, int index) {
        int result = 0;
        List<Ticket> tickets = this.ticketRepository.findByBusAndDate(ocupiedSeatsDTO.getBus(), ocupiedSeatsDTO.getDate());
        Long location = ocupiedSeatsDTO.getStops().get(index);
        for (Ticket ticket : tickets) {
            if (ticket.getEndStation().equals(location)) {
                result += ticket.getPlaces();
            }
        }

        return result;
    }
}
