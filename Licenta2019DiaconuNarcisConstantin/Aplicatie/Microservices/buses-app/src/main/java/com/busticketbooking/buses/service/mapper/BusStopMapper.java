package com.busticketbooking.buses.service.mapper;

import com.busticketbooking.buses.domain.*;
import com.busticketbooking.buses.service.dto.BusStopDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity BusStop and its DTO BusStopDTO.
 */
@Mapper(componentModel = "spring", uses = {BusMapper.class})
public interface BusStopMapper extends EntityMapper<BusStopDTO, BusStop> {

    @Mapping(source = "bus.id", target = "busId")
    BusStopDTO toDto(BusStop busStop);

    @Mapping(source = "busId", target = "bus")
    BusStop toEntity(BusStopDTO busStopDTO);

    default BusStop fromId(Long id) {
        if (id == null) {
            return null;
        }
        BusStop busStop = new BusStop();
        busStop.setId(id);
        return busStop;
    }
}
