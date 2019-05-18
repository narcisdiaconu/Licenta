package com.busticketbooking.buses.repository;

import com.busticketbooking.buses.domain.Bus;
import com.busticketbooking.buses.domain.BusStop;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;

/**
 * Spring Data  repository for the BusStop entity.
 */
@SuppressWarnings("unused")
@Repository
public interface BusStopRepository extends JpaRepository<BusStop, Long> {
    Page<BusStop> findByBus(Pageable page, Bus bus);
}
