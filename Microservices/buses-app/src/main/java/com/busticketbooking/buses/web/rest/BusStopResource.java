package com.busticketbooking.buses.web.rest;
import com.busticketbooking.buses.service.BusStopService;
import com.busticketbooking.buses.web.rest.errors.BadRequestAlertException;
import com.busticketbooking.buses.web.rest.util.HeaderUtil;
import com.busticketbooking.buses.web.rest.util.PaginationUtil;
import com.busticketbooking.buses.service.dto.BusStopDTO;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing BusStop.
 */
@RestController
@RequestMapping("/api")
public class BusStopResource {

    private final Logger log = LoggerFactory.getLogger(BusStopResource.class);

    private static final String ENTITY_NAME = "busesBusStop";

    private final BusStopService busStopService;

    public BusStopResource(BusStopService busStopService) {
        this.busStopService = busStopService;
    }

    /**
     * POST  /bus-stops : Create a new busStop.
     *
     * @param busStopDTO the busStopDTO to create
     * @return the ResponseEntity with status 201 (Created) and with body the new busStopDTO, or with status 400 (Bad Request) if the busStop has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/bus-stops")
    public ResponseEntity<BusStopDTO> createBusStop(@Valid @RequestBody BusStopDTO busStopDTO) throws URISyntaxException {
        log.debug("REST request to save BusStop : {}", busStopDTO);
        if (busStopDTO.getId() != null) {
            throw new BadRequestAlertException("A new busStop cannot already have an ID", ENTITY_NAME, "idexists");
        }
        BusStopDTO result = busStopService.save(busStopDTO);
        return ResponseEntity.created(new URI("/api/bus-stops/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /bus-stops : Updates an existing busStop.
     *
     * @param busStopDTO the busStopDTO to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated busStopDTO,
     * or with status 400 (Bad Request) if the busStopDTO is not valid,
     * or with status 500 (Internal Server Error) if the busStopDTO couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/bus-stops")
    public ResponseEntity<BusStopDTO> updateBusStop(@Valid @RequestBody BusStopDTO busStopDTO) throws URISyntaxException {
        log.debug("REST request to update BusStop : {}", busStopDTO);
        if (busStopDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        BusStopDTO result = busStopService.save(busStopDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, busStopDTO.getId().toString()))
            .body(result);
    }

    /**
     * GET  /bus-stops : get all the busStops.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of busStops in body
     */
    @GetMapping("/bus-stops")
    public ResponseEntity<List<BusStopDTO>> getAllBusStops(Pageable pageable) {
        log.debug("REST request to get a page of BusStops");
        Page<BusStopDTO> page = busStopService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/bus-stops");
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * GET  /bus-stops/:id : get the "id" busStop.
     *
     * @param id the id of the busStopDTO to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the busStopDTO, or with status 404 (Not Found)
     */
    @GetMapping("/bus-stops/{id}")
    public ResponseEntity<BusStopDTO> getBusStop(@PathVariable Long id) {
        log.debug("REST request to get BusStop : {}", id);
        Optional<BusStopDTO> busStopDTO = busStopService.findOne(id);
        return ResponseUtil.wrapOrNotFound(busStopDTO);
    }

    /**
     * DELETE  /bus-stops/:id : delete the "id" busStop.
     *
     * @param id the id of the busStopDTO to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/bus-stops/{id}")
    public ResponseEntity<Void> deleteBusStop(@PathVariable Long id) {
        log.debug("REST request to delete BusStop : {}", id);
        busStopService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    @GetMapping("/bus-stops/bus/{busId}")
    public ResponseEntity<List<BusStopDTO>> getBusStopsByBus(Pageable pageable, @PathVariable Long busId) {
        log.debug("REST request to get a page of BusStops");
        Page<BusStopDTO> page = busStopService.findByBus(pageable, busId);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/bus-stops");
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }
}
