package com.busticketbooking.buses.service.mapper;

import com.busticketbooking.buses.domain.*;
import com.busticketbooking.buses.service.dto.BusDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity Bus and its DTO BusDTO.
 */
@Mapper(componentModel = "spring", uses = {})
public interface BusMapper extends EntityMapper<BusDTO, Bus> {


    @Mapping(target = "busStops", ignore = true)
    Bus toEntity(BusDTO busDTO);

    default Bus fromId(Long id) {
        if (id == null) {
            return null;
        }
        Bus bus = new Bus();
        bus.setId(id);
        return bus;
    }
}
