package com.busticketbooking.routes.service.impl;

import com.busticketbooking.routes.service.RouteService;
import com.busticketbooking.routes.domain.IntermediatePoint;
import com.busticketbooking.routes.domain.Route;
import com.busticketbooking.routes.repository.IntermediatePointRepository;
import com.busticketbooking.routes.repository.RouteRepository;
import com.busticketbooking.routes.service.dto.RouteDTO;
import com.busticketbooking.routes.service.mapper.RouteMapper;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * Service Implementation for managing Route.
 */
@Service
@Transactional
public class RouteServiceImpl implements RouteService {

    private final Logger log = LoggerFactory.getLogger(RouteServiceImpl.class);

    private final RouteRepository routeRepository;

    private final RouteMapper routeMapper;

    private final IntermediatePointRepository ipRepository;

    public RouteServiceImpl(RouteRepository routeRepository, RouteMapper routeMapper, IntermediatePointRepository ipRepository) {
        this.routeRepository = routeRepository;
        this.routeMapper = routeMapper;
        this.ipRepository = ipRepository;
    }

    /**
     * Save a route.
     *
     * @param routeDTO the entity to save
     * @return the persisted entity
     */
    @Override
    public RouteDTO save(RouteDTO routeDTO) {
        log.debug("Request to save Route : {}", routeDTO);
        Route route = routeMapper.toEntity(routeDTO);
        route = routeRepository.save(route);
        return routeMapper.toDto(route);
    }

    /**
     * Get all the routes.
     *
     * @param pageable the pagination information
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public Page<RouteDTO> findAll(Pageable pageable) {
        log.debug("Request to get all Routes");
        return routeRepository.findAll(pageable)
            .map(routeMapper::toDto);
    }


    /**
     * Get one route by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<RouteDTO> findOne(Long id) {
        log.debug("Request to get Route : {}", id);
        return routeRepository.findById(id)
            .map(routeMapper::toDto);
    }

    /**
     * Delete the route by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete Route : {}", id);
        for (IntermediatePoint ip : ipRepository.findByRoute(routeRepository.findById(id).get())) {
            ipRepository.delete(ip);
        }
        routeRepository.deleteById(id);
    }

    @Override
    public Page<RouteDTO> findByStartAndEnd(Pageable pageable,Long start, Long end) {
        Page<Route> routes = this.routeRepository.findAll(pageable);
        List<Route> result = new ArrayList<>();
        for (Route route : routes.getContent()) {
            boolean containsStart = false;
            boolean containsEnd = false;
            IntermediatePoint startPoint = null, endPoint = null;

            if (route.getStartStation().equals(start)) {
                containsStart = true;
            }
            if (route.getEndStation().equals(end)) {
                containsEnd = true;
            }
            if (containsStart && containsEnd) {
                result.add(route);
                continue;
            }

            for(IntermediatePoint ip : route.getIntermediatePoints()) {
                if (containsStart) {
                    if (ip.getStation().equals(end)) {
                        result.add(route);
                        break;
                    }
                }
                if (containsEnd) {
                    if (ip.getStation().equals(start)) {
                        result.add(route);
                        break;
                    }
                }
                if (!containsEnd && !containsStart) {
                    if (ip.getStation().equals(start)) {
                        if (endPoint != null) {
                            break;
                        }
                        startPoint = ip;
                    }
                    else if (ip.getStation().equals(end)) {
                        if (startPoint == null) {
                            break;
                        }
                        endPoint = ip;
                    }
                }
            }
            if (startPoint != null && endPoint != null) {
                result.add(route);
            }
        }

        return new PageImpl<>(result).map(routeMapper::toDto);
    }
}
