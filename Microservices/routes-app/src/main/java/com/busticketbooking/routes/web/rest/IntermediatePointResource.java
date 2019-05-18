package com.busticketbooking.routes.web.rest;
import com.busticketbooking.routes.service.IntermediatePointService;
import com.busticketbooking.routes.web.rest.errors.BadRequestAlertException;
import com.busticketbooking.routes.web.rest.util.HeaderUtil;
import com.busticketbooking.routes.web.rest.util.PaginationUtil;
import com.busticketbooking.routes.service.dto.IntermediatePointDTO;
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
 * REST controller for managing IntermediatePoint.
 */
@RestController
@RequestMapping("/api")
public class IntermediatePointResource {

    private final Logger log = LoggerFactory.getLogger(IntermediatePointResource.class);

    private static final String ENTITY_NAME = "routesIntermediatePoint";

    private final IntermediatePointService intermediatePointService;

    public IntermediatePointResource(IntermediatePointService intermediatePointService) {
        this.intermediatePointService = intermediatePointService;
    }

    /**
     * POST  /intermediate-points : Create a new intermediatePoint.
     *
     * @param intermediatePointDTO the intermediatePointDTO to create
     * @return the ResponseEntity with status 201 (Created) and with body the new intermediatePointDTO, or with status 400 (Bad Request) if the intermediatePoint has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/intermediate-points")
    public ResponseEntity<IntermediatePointDTO> createIntermediatePoint(@Valid @RequestBody IntermediatePointDTO intermediatePointDTO) throws URISyntaxException {
        log.debug("REST request to save IntermediatePoint : {}", intermediatePointDTO);
        if (intermediatePointDTO.getId() != null) {
            throw new BadRequestAlertException("A new intermediatePoint cannot already have an ID", ENTITY_NAME, "idexists");
        }
        IntermediatePointDTO result = intermediatePointService.save(intermediatePointDTO);
        return ResponseEntity.created(new URI("/api/intermediate-points/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /intermediate-points : Updates an existing intermediatePoint.
     *
     * @param intermediatePointDTO the intermediatePointDTO to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated intermediatePointDTO,
     * or with status 400 (Bad Request) if the intermediatePointDTO is not valid,
     * or with status 500 (Internal Server Error) if the intermediatePointDTO couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/intermediate-points")
    public ResponseEntity<IntermediatePointDTO> updateIntermediatePoint(@Valid @RequestBody IntermediatePointDTO intermediatePointDTO) throws URISyntaxException {
        log.debug("REST request to update IntermediatePoint : {}", intermediatePointDTO);
        if (intermediatePointDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        IntermediatePointDTO result = intermediatePointService.save(intermediatePointDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, intermediatePointDTO.getId().toString()))
            .body(result);
    }

    /**
     * GET  /intermediate-points : get all the intermediatePoints.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of intermediatePoints in body
     */
    @GetMapping("/intermediate-points")
    public ResponseEntity<List<IntermediatePointDTO>> getAllIntermediatePoints(Pageable pageable) {
        log.debug("REST request to get a page of IntermediatePoints");
        Page<IntermediatePointDTO> page = intermediatePointService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/intermediate-points");
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * GET  /intermediate-points/:id : get the "id" intermediatePoint.
     *
     * @param id the id of the intermediatePointDTO to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the intermediatePointDTO, or with status 404 (Not Found)
     */
    @GetMapping("/intermediate-points/{id}")
    public ResponseEntity<IntermediatePointDTO> getIntermediatePoint(@PathVariable Long id) {
        log.debug("REST request to get IntermediatePoint : {}", id);
        Optional<IntermediatePointDTO> intermediatePointDTO = intermediatePointService.findOne(id);
        return ResponseUtil.wrapOrNotFound(intermediatePointDTO);
    }

    /**
     * DELETE  /intermediate-points/:id : delete the "id" intermediatePoint.
     *
     * @param id the id of the intermediatePointDTO to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/intermediate-points/{id}")
    public ResponseEntity<Void> deleteIntermediatePoint(@PathVariable Long id) {
        log.debug("REST request to delete IntermediatePoint : {}", id);
        intermediatePointService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
