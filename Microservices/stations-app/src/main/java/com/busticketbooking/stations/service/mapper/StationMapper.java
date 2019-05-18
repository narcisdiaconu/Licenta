package com.busticketbooking.stations.service.mapper;

import com.busticketbooking.stations.domain.*;
import com.busticketbooking.stations.service.dto.StationDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity Station and its DTO StationDTO.
 */
@Mapper(componentModel = "spring", uses = {CityMapper.class})
public interface StationMapper extends EntityMapper<StationDTO, Station> {

    @Mapping(source = "city.id", target = "cityId")
    StationDTO toDto(Station station);

    @Mapping(source = "cityId", target = "city")
    Station toEntity(StationDTO stationDTO);

    default Station fromId(Long id) {
        if (id == null) {
            return null;
        }
        Station station = new Station();
        station.setId(id);
        return station;
    }
}
