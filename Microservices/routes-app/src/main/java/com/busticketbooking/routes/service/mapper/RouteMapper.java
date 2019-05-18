package com.busticketbooking.routes.service.mapper;

import com.busticketbooking.routes.domain.*;
import com.busticketbooking.routes.service.dto.RouteDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity Route and its DTO RouteDTO.
 */
@Mapper(componentModel = "spring", uses = {})
public interface RouteMapper extends EntityMapper<RouteDTO, Route> {


    @Mapping(target = "intermediatePoints", ignore = true)
    Route toEntity(RouteDTO routeDTO);

    default Route fromId(Long id) {
        if (id == null) {
            return null;
        }
        Route route = new Route();
        route.setId(id);
        return route;
    }
}
