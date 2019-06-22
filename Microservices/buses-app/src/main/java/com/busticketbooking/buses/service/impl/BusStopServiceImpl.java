package com.busticketbooking.buses.service.impl;

import com.busticketbooking.buses.service.BusStopService;
import com.busticketbooking.buses.domain.Bus;
import com.busticketbooking.buses.domain.BusStop;
import com.busticketbooking.buses.repository.BusRepository;
import com.busticketbooking.buses.repository.BusStopRepository;
import com.busticketbooking.buses.service.dto.BusStopDTO;
import com.busticketbooking.buses.service.mapper.BusStopMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Service Implementation for managing BusStop.
 */
@Service
@Transactional
public class BusStopServiceImpl implements BusStopService {

    private final Logger log = LoggerFactory.getLogger(BusStopServiceImpl.class);

    private final BusStopRepository busStopRepository;

    private final BusStopMapper busStopMapper;

    private final BusRepository busRepository;

    public BusStopServiceImpl(BusStopRepository busStopRepository, BusStopMapper busStopMapper, BusRepository busRepository) {
        this.busStopRepository = busStopRepository;
        this.busStopMapper = busStopMapper;
        this.busRepository = busRepository;
    }

    /**
     * Save a busStop.
     *
     * @param busStopDTO the entity to save
     * @return the persisted entity
     */
    @Override
    public BusStopDTO save(BusStopDTO busStopDTO) {
        log.debug("Request to save BusStop : {}", busStopDTO);
        BusStop busStop = busStopMapper.toEntity(busStopDTO);
        busStop = busStopRepository.save(busStop);
        return busStopMapper.toDto(busStop);
    }

    /**
     * Get all the busStops.
     *
     * @param pageable the pagination information
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public Page<BusStopDTO> findAll(Pageable pageable) {
        log.debug("Request to get all BusStops");
        return busStopRepository.findAll(pageable)
            .map(busStopMapper::toDto);
    }


    /**
     * Get one busStop by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<BusStopDTO> findOne(Long id) {
        log.debug("Request to get BusStop : {}", id);
        return busStopRepository.findById(id)
            .map(busStopMapper::toDto);
    }

    /**
     * Delete the busStop by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete BusStop : {}", id);
        busStopRepository.deleteById(id);
    }

    public List<BusStopDTO> findByBus(Long id){
        Optional<Bus> bus = busRepository.findById(id);
        return busStopRepository.findByBus(bus.get()).stream()
            .map(busStopMapper::toDto).collect(Collectors.toList());
    }
}
