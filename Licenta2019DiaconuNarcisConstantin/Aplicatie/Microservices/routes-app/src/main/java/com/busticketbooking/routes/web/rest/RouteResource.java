package com.busticketbooking.routes.web.rest;
import com.busticketbooking.routes.service.RouteService;
import com.busticketbooking.routes.web.rest.errors.BadRequestAlertException;
import com.busticketbooking.routes.web.rest.util.HeaderUtil;
import com.busticketbooking.routes.web.rest.util.PaginationUtil;
import com.busticketbooking.routes.service.dto.RouteDTO;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing Route.
 */
@RestController
@RequestMapping("/api")
public class RouteResource {

    private final Logger log = LoggerFactory.getLogger(RouteResource.class);

    private static final String ENTITY_NAME = "routesRoute";

    private final RouteService routeService;

    public RouteResource(RouteService routeService) {
        this.routeService = routeService;
    }

    /**
     * POST  /routes : Create a new route.
     *
     * @param routeDTO the routeDTO to create
     * @return the ResponseEntity with status 201 (Created) and with body the new routeDTO, or with status 400 (Bad Request) if the route has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/routes")
    public ResponseEntity<RouteDTO> createRoute(@Valid @RequestBody RouteDTO routeDTO) throws URISyntaxException {
        log.debug("REST request to save Route : {}", routeDTO);
        if (routeDTO.getId() != null) {
            throw new BadRequestAlertException("A new route cannot already have an ID", ENTITY_NAME, "idexists");
        }
        RouteDTO result = routeService.save(routeDTO);
        return ResponseEntity.created(new URI("/api/routes/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /routes : Updates an existing route.
     *
     * @param routeDTO the routeDTO to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated routeDTO,
     * or with status 400 (Bad Request) if the routeDTO is not valid,
     * or with status 500 (Internal Server Error) if the routeDTO couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/routes")
    public ResponseEntity<RouteDTO> updateRoute(@Valid @RequestBody RouteDTO routeDTO) throws URISyntaxException {
        log.debug("REST request to update Route : {}", routeDTO);
        if (routeDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        RouteDTO result = routeService.save(routeDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, routeDTO.getId().toString()))
            .body(result);
    }

    /**
     * GET  /routes : get all the routes.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of routes in body
     */
    @GetMapping("/routes")
    public ResponseEntity<List<RouteDTO>> getAllRoutes(Pageable pageable) {
        log.debug("REST request to get a page of Routes");
        Page<RouteDTO> page = routeService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/routes");
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * GET  /routes/:id : get the "id" route.
     *
     * @param id the id of the routeDTO to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the routeDTO, or with status 404 (Not Found)
     */
    @GetMapping("/routes/{id}")
    public ResponseEntity<RouteDTO> getRoute(@PathVariable Long id) {
        log.debug("REST request to get Route : {}", id);
        Optional<RouteDTO> routeDTO = routeService.findOne(id);
        return ResponseUtil.wrapOrNotFound(routeDTO);
    }

    /**
     * DELETE  /routes/:id : delete the "id" route.
     *
     * @param id the id of the routeDTO to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/routes/{id}")
    public ResponseEntity<Void> deleteRoute(@PathVariable Long id) {
        log.debug("REST request to delete Route : {}", id);
        routeService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    @GetMapping("/routes/start/{startId}/end/{endId}")
    public ResponseEntity<List<RouteDTO>> getRouteByStartAndEnd(Pageable pageable, @PathVariable Long startId, @PathVariable long endId) {
        log.debug("REST request to get Route with start: {} and end: {}", startId, endId);
        Page<RouteDTO> page = this.routeService.findByStartAndEnd(pageable, startId, endId);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/routes");
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }
}
