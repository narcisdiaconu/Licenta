package com.busticketbooking.routes.repository;

import java.util.List;

import com.busticketbooking.routes.domain.IntermediatePoint;
import com.busticketbooking.routes.domain.Route;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the IntermediatePoint entity.
 */
@SuppressWarnings("unused")
@Repository
public interface IntermediatePointRepository extends JpaRepository<IntermediatePoint, Long> {
    List<IntermediatePoint> findByRoute(Route route);
}
