package com.busticketbooking.users.web.rest;
import com.busticketbooking.users.service.UserdetailsService;
import com.busticketbooking.users.web.rest.errors.BadRequestAlertException;
import com.busticketbooking.users.web.rest.errors.EmailAlreadyUsedException;
import com.busticketbooking.users.web.rest.util.HeaderUtil;
import com.busticketbooking.users.web.rest.util.PaginationUtil;
import com.busticketbooking.users.service.dto.UserdetailsDTO;
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
 * REST controller for managing Userdetails.
 */
@RestController
@RequestMapping("/api")
public class UserdetailsResource {

    private final Logger log = LoggerFactory.getLogger(UserdetailsResource.class);

    private static final String ENTITY_NAME = "usersUserdetails";

    private final UserdetailsService userdetailsService;

    public UserdetailsResource(UserdetailsService userdetailsService) {
        this.userdetailsService = userdetailsService;
    }

    /**
     * POST  /userdetails : Create a new userdetails.
     *
     * @param userdetailsDTO the userdetailsDTO to create
     * @return the ResponseEntity with status 201 (Created) and with body the new userdetailsDTO, or with status 400 (Bad Request) if the userdetails has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/userdetails")
    public ResponseEntity<UserdetailsDTO> createUserdetails(@Valid @RequestBody UserdetailsDTO userdetailsDTO) throws URISyntaxException {
        log.debug("REST request to save Userdetails : {}", userdetailsDTO);
        if (userdetailsDTO.getId() != null) {
            throw new BadRequestAlertException("A new userdetails cannot already have an ID", ENTITY_NAME, "idexists");
        }
        UserdetailsDTO result = userdetailsService.save(userdetailsDTO);
        return ResponseEntity.created(new URI("/api/userdetails/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /userdetails : Updates an existing userdetails.
     *
     * @param userdetailsDTO the userdetailsDTO to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated userdetailsDTO,
     * or with status 400 (Bad Request) if the userdetailsDTO is not valid,
     * or with status 500 (Internal Server Error) if the userdetailsDTO couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/userdetails")
    public ResponseEntity<UserdetailsDTO> updateUserdetails(@Valid @RequestBody UserdetailsDTO userdetailsDTO) throws URISyntaxException {
        log.debug("REST request to update Userdetails : {}", userdetailsDTO);
        if (userdetailsDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (userdetailsService.findByEmail(userdetailsDTO.getEmail()).isPresent()) {
            throw new EmailAlreadyUsedException();
        }
        UserdetailsDTO result = userdetailsService.save(userdetailsDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, userdetailsDTO.getId().toString()))
            .body(result);
    }

    /**
     * GET  /userdetails : get all the userdetails.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of userdetails in body
     */
    @GetMapping("/userdetails")
    public ResponseEntity<List<UserdetailsDTO>> getAllUserdetails(Pageable pageable) {
        log.debug("REST request to get a page of Userdetails");
        Page<UserdetailsDTO> page = userdetailsService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/userdetails");
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * GET  /userdetails/:id : get the "id" userdetails.
     *
     * @param id the id of the userdetailsDTO to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the userdetailsDTO, or with status 404 (Not Found)
     */
    @GetMapping("/userdetails/{id}")
    public ResponseEntity<UserdetailsDTO> getUserdetails(@PathVariable Long id) {
        log.debug("REST request to get Userdetails : {}", id);
        Optional<UserdetailsDTO> userdetailsDTO = userdetailsService.findOne(id);
        return ResponseUtil.wrapOrNotFound(userdetailsDTO);
    }

    /**
     * DELETE  /userdetails/:id : delete the "id" userdetails.
     *
     * @param id the id of the userdetailsDTO to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/userdetails/{id}")
    public ResponseEntity<Void> deleteUserdetails(@PathVariable Long id) {
        log.debug("REST request to delete Userdetails : {}", id);
        userdetailsService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    @GetMapping("/userdetails/account/{accountId}")
    public ResponseEntity<UserdetailsDTO> getUserdetailsByAccount(@PathVariable Integer accountId) {
        log.debug("REST request to get Userdetails by accountId : {}", accountId);
        Optional<UserdetailsDTO> userdetailsDTO = userdetailsService.findByAccountId(accountId);
        return ResponseUtil.wrapOrNotFound(userdetailsDTO);
    }
}
