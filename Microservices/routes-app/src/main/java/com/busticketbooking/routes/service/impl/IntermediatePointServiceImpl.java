package com.busticketbooking.routes.service.impl;

import com.busticketbooking.routes.service.IntermediatePointService;
import com.busticketbooking.routes.domain.IntermediatePoint;
import com.busticketbooking.routes.repository.IntermediatePointRepository;
import com.busticketbooking.routes.service.dto.IntermediatePointDTO;
import com.busticketbooking.routes.service.mapper.IntermediatePointMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * Service Implementation for managing IntermediatePoint.
 */
@Service
@Transactional
public class IntermediatePointServiceImpl implements IntermediatePointService {

    private final Logger log = LoggerFactory.getLogger(IntermediatePointServiceImpl.class);

    private final IntermediatePointRepository intermediatePointRepository;

    private final IntermediatePointMapper intermediatePointMapper;

    public IntermediatePointServiceImpl(IntermediatePointRepository intermediatePointRepository, IntermediatePointMapper intermediatePointMapper) {
        this.intermediatePointRepository = intermediatePointRepository;
        this.intermediatePointMapper = intermediatePointMapper;
    }

    /**
     * Save a intermediatePoint.
     *
     * @param intermediatePointDTO the entity to save
     * @return the persisted entity
     */
    @Override
    public IntermediatePointDTO save(IntermediatePointDTO intermediatePointDTO) {
        log.debug("Request to save IntermediatePoint : {}", intermediatePointDTO);
        IntermediatePoint intermediatePoint = intermediatePointMapper.toEntity(intermediatePointDTO);
        intermediatePoint = intermediatePointRepository.save(intermediatePoint);
        return intermediatePointMapper.toDto(intermediatePoint);
    }

    /**
     * Get all the intermediatePoints.
     *
     * @param pageable the pagination information
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public Page<IntermediatePointDTO> findAll(Pageable pageable) {
        log.debug("Request to get all IntermediatePoints");
        return intermediatePointRepository.findAll(pageable)
            .map(intermediatePointMapper::toDto);
    }


    /**
     * Get one intermediatePoint by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<IntermediatePointDTO> findOne(Long id) {
        log.debug("Request to get IntermediatePoint : {}", id);
        return intermediatePointRepository.findById(id)
            .map(intermediatePointMapper::toDto);
    }

    /**
     * Delete the intermediatePoint by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete IntermediatePoint : {}", id);
        intermediatePointRepository.deleteById(id);
    }
}
