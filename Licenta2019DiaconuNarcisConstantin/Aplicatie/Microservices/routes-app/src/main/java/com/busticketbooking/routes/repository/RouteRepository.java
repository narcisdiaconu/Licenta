package com.busticketbooking.routes.repository;

import java.util.List;
import java.util.Optional;

import com.busticketbooking.routes.domain.Route;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the Route entity.
 */
@SuppressWarnings("unused")
@Repository
public interface RouteRepository extends JpaRepository<Route, Long> {
    List<Route> findByStartStationAndEndStation(Long startStation, Long endStation);
}
