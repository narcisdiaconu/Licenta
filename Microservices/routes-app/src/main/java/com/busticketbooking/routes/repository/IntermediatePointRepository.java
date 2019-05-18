package com.busticketbooking.routes.repository;

import com.busticketbooking.routes.domain.IntermediatePoint;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the IntermediatePoint entity.
 */
@SuppressWarnings("unused")
@Repository
public interface IntermediatePointRepository extends JpaRepository<IntermediatePoint, Long> {

}
