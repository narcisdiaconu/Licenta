package com.busticketbooking.buses.repository;

import com.busticketbooking.buses.domain.Bus;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the Bus entity.
 */
@SuppressWarnings("unused")
@Repository
public interface BusRepository extends JpaRepository<Bus, Long> {
    Page<Bus> findByRoute(Pageable page, Long route);
}
