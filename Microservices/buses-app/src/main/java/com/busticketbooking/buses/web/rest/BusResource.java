package com.busticketbooking.buses.web.rest;
import com.busticketbooking.buses.service.BusService;
import com.busticketbooking.buses.web.rest.errors.BadRequestAlertException;
import com.busticketbooking.buses.web.rest.util.HeaderUtil;
import com.busticketbooking.buses.web.rest.util.PaginationUtil;
import com.busticketbooking.buses.service.dto.BusDTO;
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
 * REST controller for managing Bus.
 */
@RestController
@RequestMapping("/api")
public class BusResource {

    private final Logger log = LoggerFactory.getLogger(BusResource.class);

    private static final String ENTITY_NAME = "busesBus";

    private final BusService busService;

    public BusResource(BusService busService) {
        this.busService = busService;
    }

    /**
     * POST  /buses : Create a new bus.
     *
     * @param busDTO the busDTO to create
     * @return the ResponseEntity with status 201 (Created) and with body the new busDTO, or with status 400 (Bad Request) if the bus has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/buses")
    public ResponseEntity<BusDTO> createBus(@Valid @RequestBody BusDTO busDTO) throws URISyntaxException {
        log.debug("REST request to save Bus : {}", busDTO);
        if (busDTO.getId() != null) {
            throw new BadRequestAlertException("A new bus cannot already have an ID", ENTITY_NAME, "idexists");
        }
        BusDTO result = busService.save(busDTO);
        return ResponseEntity.created(new URI("/api/buses/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /buses : Updates an existing bus.
     *
     * @param busDTO the busDTO to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated busDTO,
     * or with status 400 (Bad Request) if the busDTO is not valid,
     * or with status 500 (Internal Server Error) if the busDTO couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/buses")
    public ResponseEntity<BusDTO> updateBus(@Valid @RequestBody BusDTO busDTO) throws URISyntaxException {
        log.debug("REST request to update Bus : {}", busDTO);
        if (busDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        BusDTO result = busService.save(busDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, busDTO.getId().toString()))
            .body(result);
    }

    /**
     * GET  /buses : get all the buses.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of buses in body
     */
    @GetMapping("/buses")
    public ResponseEntity<List<BusDTO>> getAllBuses(Pageable pageable) {
        log.debug("REST request to get a page of Buses");
        Page<BusDTO> page = busService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/buses");
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * GET  /buses/:id : get the "id" bus.
     *
     * @param id the id of the busDTO to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the busDTO, or with status 404 (Not Found)
     */
    @GetMapping("/buses/{id}")
    public ResponseEntity<BusDTO> getBus(@PathVariable Long id) {
        log.debug("REST request to get Bus : {}", id);
        Optional<BusDTO> busDTO = busService.findOne(id);
        return ResponseUtil.wrapOrNotFound(busDTO);
    }

    /**
     * DELETE  /buses/:id : delete the "id" bus.
     *
     * @param id the id of the busDTO to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/buses/{id}")
    public ResponseEntity<Void> deleteBus(@PathVariable Long id) {
        log.debug("REST request to delete Bus : {}", id);
        busService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    @GetMapping("/buses/route/{route}")
    public ResponseEntity<List<BusDTO>> getBusesByRoute(Pageable pageable, @PathVariable Long route) {
        Page<BusDTO> page = busService.findByRoute(pageable, route);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/buses");
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }
}
