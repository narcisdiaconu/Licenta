package com.busticketbooking.users.service;

import com.busticketbooking.users.domain.Userdetails;
import com.busticketbooking.users.service.dto.UserdetailsDTO;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

/**
 * Service Interface for managing Userdetails.
 */
public interface UserdetailsService {

    /**
     * Save a userdetails.
     *
     * @param userdetailsDTO the entity to save
     * @return the persisted entity
     */
    UserdetailsDTO save(UserdetailsDTO userdetailsDTO);

    /**
     * Get all the userdetails.
     *
     * @param pageable the pagination information
     * @return the list of entities
     */
    Page<UserdetailsDTO> findAll(Pageable pageable);


    /**
     * Get the "id" userdetails.
     *
     * @param id the id of the entity
     * @return the entity
     */
    Optional<UserdetailsDTO> findOne(Long id);

    /**
     * Delete the "id" userdetails.
     *
     * @param id the id of the entity
     */
    void delete(Long id);

    Optional<UserdetailsDTO> findByAccountId(Integer accountId);
    Optional<UserdetailsDTO> findByEmail(String email);
}
