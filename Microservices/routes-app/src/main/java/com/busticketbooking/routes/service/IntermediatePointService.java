package com.busticketbooking.routes.service;

import com.busticketbooking.routes.service.dto.IntermediatePointDTO;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

/**
 * Service Interface for managing IntermediatePoint.
 */
public interface IntermediatePointService {

    /**
     * Save a intermediatePoint.
     *
     * @param intermediatePointDTO the entity to save
     * @return the persisted entity
     */
    IntermediatePointDTO save(IntermediatePointDTO intermediatePointDTO);

    /**
     * Get all the intermediatePoints.
     *
     * @param pageable the pagination information
     * @return the list of entities
     */
    Page<IntermediatePointDTO> findAll(Pageable pageable);


    /**
     * Get the "id" intermediatePoint.
     *
     * @param id the id of the entity
     * @return the entity
     */
    Optional<IntermediatePointDTO> findOne(Long id);

    /**
     * Delete the "id" intermediatePoint.
     *
     * @param id the id of the entity
     */
    void delete(Long id);
}
