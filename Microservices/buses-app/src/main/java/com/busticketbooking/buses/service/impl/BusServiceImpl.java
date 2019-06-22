package com.busticketbooking.buses.service.impl;

import com.busticketbooking.buses.service.BusService;
import com.busticketbooking.buses.domain.Bus;
import com.busticketbooking.buses.domain.BusStop;
import com.busticketbooking.buses.repository.BusRepository;
import com.busticketbooking.buses.repository.BusStopRepository;
import com.busticketbooking.buses.service.dto.BusDTO;
import com.busticketbooking.buses.service.mapper.BusMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * Service Implementation for managing Bus.
 */
@Service
@Transactional
public class BusServiceImpl implements BusService {

    private final Logger log = LoggerFactory.getLogger(BusServiceImpl.class);

    private final BusRepository busRepository;

    private final BusMapper busMapper;

    private final BusStopRepository busStopRepository;

    public BusServiceImpl(BusRepository busRepository, BusMapper busMapper, BusStopRepository busStopRepository){
        this.busRepository = busRepository;
        this.busMapper = busMapper;
        this.busStopRepository = busStopRepository;
    }

    /**
     * Save a bus.
     *
     * @param busDTO the entity to save
     * @return the persisted entity
     */
    @Override
    public BusDTO save(BusDTO busDTO) {
        log.debug("Request to save Bus : {}", busDTO);
        Bus bus = busMapper.toEntity(busDTO);
        bus = busRepository.save(bus);
        return busMapper.toDto(bus);
    }

    /**
     * Get all the buses.
     *
     * @param pageable the pagination information
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public Page<BusDTO> findAll(Pageable pageable) {
        log.debug("Request to get all Buses");
        return busRepository.findAll(pageable)
            .map(busMapper::toDto);
    }


    /**
     * Get one bus by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<BusDTO> findOne(Long id) {
        log.debug("Request to get Bus : {}", id);
        return busRepository.findById(id)
            .map(busMapper::toDto);
    }

    /**
     * Delete the bus by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete Bus : {}", id);
        Bus bus = busRepository.findById(id).get();
        for (BusStop stop : busStopRepository.findByBus(bus)) {
            busStopRepository.delete(stop);
        }
        busRepository.deleteById(id);
    }

    public Page<BusDTO> findByRoute(Pageable page, Long route) {
        return busRepository.findByRoute(page, route)
            .map(busMapper::toDto);
    }
}
