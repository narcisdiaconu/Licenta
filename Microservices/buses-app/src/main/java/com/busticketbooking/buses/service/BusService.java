package com.busticketbooking.buses.service;

import com.busticketbooking.buses.service.dto.BusDTO;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

/**
 * Service Interface for managing Bus.
 */
public interface BusService {

    /**
     * Save a bus.
     *
     * @param busDTO the entity to save
     * @return the persisted entity
     */
    BusDTO save(BusDTO busDTO);

    /**
     * Get all the buses.
     *
     * @param pageable the pagination information
     * @return the list of entities
     */
    Page<BusDTO> findAll(Pageable pageable);


    /**
     * Get the "id" bus.
     *
     * @param id the id of the entity
     * @return the entity
     */
    Optional<BusDTO> findOne(Long id);

    /**
     * Delete the "id" bus.
     *
     * @param id the id of the entity
     */
    void delete(Long id);

    Page<BusDTO> findByRoute(Pageable pageable, Long route);
}
