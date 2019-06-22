package com.busticketbooking.tickets.web.rest;
import com.busticketbooking.tickets.service.TicketService;
import com.busticketbooking.tickets.web.rest.errors.BadRequestAlertException;
import com.busticketbooking.tickets.web.rest.util.HeaderUtil;
import com.busticketbooking.tickets.web.rest.util.PaginationUtil;
import com.busticketbooking.tickets.service.dto.OcupiedSeatsDTO;
import com.busticketbooking.tickets.service.dto.TicketDTO;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.format.annotation.DateTimeFormat.ISO;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing Ticket.
 */
@RestController
@RequestMapping("/api")
public class TicketResource {

    private final Logger log = LoggerFactory.getLogger(TicketResource.class);

    private static final String ENTITY_NAME = "ticketsTicket";

    private final TicketService ticketService;

    public TicketResource(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    /**
     * POST  /tickets : Create a new ticket.
     *
     * @param ticketDTO the ticketDTO to create
     * @return the ResponseEntity with status 201 (Created) and with body the new ticketDTO, or with status 400 (Bad Request) if the ticket has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/tickets")
    public ResponseEntity<TicketDTO> createTicket(@Valid @RequestBody TicketDTO ticketDTO) throws URISyntaxException {
        log.debug("REST request to save Ticket : {}", ticketDTO);
        if (ticketDTO.getId() != null) {
            throw new BadRequestAlertException("A new ticket cannot already have an ID", ENTITY_NAME, "idexists");
        }
        TicketDTO result = ticketService.save(ticketDTO);
        return ResponseEntity.created(new URI("/api/tickets/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /tickets : Updates an existing ticket.
     *
     * @param ticketDTO the ticketDTO to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated ticketDTO,
     * or with status 400 (Bad Request) if the ticketDTO is not valid,
     * or with status 500 (Internal Server Error) if the ticketDTO couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/tickets")
    public ResponseEntity<TicketDTO> updateTicket(@Valid @RequestBody TicketDTO ticketDTO) throws URISyntaxException {
        log.debug("REST request to update Ticket : {}", ticketDTO);
        if (ticketDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        TicketDTO result = ticketService.save(ticketDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, ticketDTO.getId().toString()))
            .body(result);
    }

    /**
     * GET  /tickets : get all the tickets.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of tickets in body
     */
    @GetMapping("/tickets")
    public ResponseEntity<List<TicketDTO>> getAllTickets(Pageable pageable) {
        log.debug("REST request to get a page of Tickets");
        Page<TicketDTO> page = ticketService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/tickets");
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * GET  /tickets/:id : get the "id" ticket.
     *
     * @param id the id of the ticketDTO to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the ticketDTO, or with status 404 (Not Found)
     */
    @GetMapping("/tickets/{id}")
    public ResponseEntity<TicketDTO> getTicket(@PathVariable Long id) {
        log.debug("REST request to get Ticket : {}", id);
        Optional<TicketDTO> ticketDTO = ticketService.findOne(id);
        return ResponseUtil.wrapOrNotFound(ticketDTO);
    }

    /**
     * DELETE  /tickets/:id : delete the "id" ticket.
     *
     * @param id the id of the ticketDTO to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/tickets/{id}")
    public ResponseEntity<Void> deleteTicket(@PathVariable Long id) {
        log.debug("REST request to delete Ticket : {}", id);
        ticketService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    @PostMapping("/tickets/ocupied-seats")
    public ResponseEntity<Long> getOcupiedSeats(@Valid @RequestBody OcupiedSeatsDTO ocupiedSeatsDTO) {
        log.debug("REST request to get ocupied seats for bus : {}", ocupiedSeatsDTO.getBus());
        Long result = ticketService.getOcupiedSeats(ocupiedSeatsDTO);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/tickets/user/{id}")
    public ResponseEntity<List<TicketDTO>> getTicketForUser(@PathVariable Long id) {
        List<TicketDTO> tickets = ticketService.getTicketsForUser(id);
        return ResponseEntity.ok().body(tickets);
    }

    @GetMapping("/tickets/bus/{id}")
    public ResponseEntity<List<TicketDTO>> getTicketsByBusAndDate(@PathVariable Long id, @RequestParam(name = "date") String date) {
        LocalDate localDate = LocalDate.parse(date, DateTimeFormatter.ofPattern("M/d/y"));
        return ResponseEntity.ok().body(ticketService.getByBusAndDate(id, localDate));
    }
}
