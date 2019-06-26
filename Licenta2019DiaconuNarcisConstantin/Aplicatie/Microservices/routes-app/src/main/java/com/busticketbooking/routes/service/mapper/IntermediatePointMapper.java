package com.busticketbooking.routes.service.mapper;

import com.busticketbooking.routes.domain.*;
import com.busticketbooking.routes.service.dto.IntermediatePointDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity IntermediatePoint and its DTO IntermediatePointDTO.
 */
@Mapper(componentModel = "spring", uses = {RouteMapper.class})
public interface IntermediatePointMapper extends EntityMapper<IntermediatePointDTO, IntermediatePoint> {

    @Mapping(source = "route.id", target = "routeId")
    IntermediatePointDTO toDto(IntermediatePoint intermediatePoint);

    @Mapping(source = "routeId", target = "route")
    IntermediatePoint toEntity(IntermediatePointDTO intermediatePointDTO);

    default IntermediatePoint fromId(Long id) {
        if (id == null) {
            return null;
        }
        IntermediatePoint intermediatePoint = new IntermediatePoint();
        intermediatePoint.setId(id);
        return intermediatePoint;
    }
}
