package com.busticketbooking.stations.web.rest;
import com.busticketbooking.stations.service.StationService;
import com.busticketbooking.stations.web.rest.errors.BadRequestAlertException;
import com.busticketbooking.stations.web.rest.util.HeaderUtil;
import com.busticketbooking.stations.web.rest.util.PaginationUtil;
import com.busticketbooking.stations.service.dto.StationDTO;
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
 * REST controller for managing Station.
 */
@RestController
@RequestMapping("/api")
public class StationResource {

    private final Logger log = LoggerFactory.getLogger(StationResource.class);

    private static final String ENTITY_NAME = "stationsStation";

    private final StationService stationService;

    public StationResource(StationService stationService) {
        this.stationService = stationService;
    }

    /**
     * POST  /stations : Create a new station.
     *
     * @param stationDTO the stationDTO to create
     * @return the ResponseEntity with status 201 (Created) and with body the new stationDTO, or with status 400 (Bad Request) if the station has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/stations")
    public ResponseEntity<StationDTO> createStation(@Valid @RequestBody StationDTO stationDTO) throws URISyntaxException {
        log.debug("REST request to save Station : {}", stationDTO);
        if (stationDTO.getId() != null) {
            throw new BadRequestAlertException("A new station cannot already have an ID", ENTITY_NAME, "idexists");
        }
        StationDTO result = stationService.save(stationDTO);
        return ResponseEntity.created(new URI("/api/stations/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /stations : Updates an existing station.
     *
     * @param stationDTO the stationDTO to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated stationDTO,
     * or with status 400 (Bad Request) if the stationDTO is not valid,
     * or with status 500 (Internal Server Error) if the stationDTO couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/stations")
    public ResponseEntity<StationDTO> updateStation(@Valid @RequestBody StationDTO stationDTO) throws URISyntaxException {
        log.debug("REST request to update Station : {}", stationDTO);
        if (stationDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        StationDTO result = stationService.save(stationDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, stationDTO.getId().toString()))
            .body(result);
    }

    /**
     * GET  /stations : get all the stations.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of stations in body
     */
    @GetMapping("/stations")
    public ResponseEntity<List<StationDTO>> getAllStations(Pageable pageable) {
        log.debug("REST request to get a page of Stations");
        Page<StationDTO> page = stationService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/stations");
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * GET  /stations/:id : get the "id" station.
     *
     * @param id the id of the stationDTO to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the stationDTO, or with status 404 (Not Found)
     */
    @GetMapping("/stations/{id}")
    public ResponseEntity<StationDTO> getStation(@PathVariable Long id) {
        log.debug("REST request to get Station : {}", id);
        Optional<StationDTO> stationDTO = stationService.findOne(id);
        return ResponseUtil.wrapOrNotFound(stationDTO);
    }

    /**
     * DELETE  /stations/:id : delete the "id" station.
     *
     * @param id the id of the stationDTO to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/stations/{id}")
    public ResponseEntity<Void> deleteStation(@PathVariable Long id) {
        log.debug("REST request to delete Station : {}", id);
        stationService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
