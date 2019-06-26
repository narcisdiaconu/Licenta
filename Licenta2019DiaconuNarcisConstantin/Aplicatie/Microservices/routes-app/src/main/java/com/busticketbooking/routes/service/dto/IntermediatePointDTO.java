package com.busticketbooking.routes.service.dto;
import javax.validation.constraints.*;
import java.io.Serializable;
import java.util.Objects;

/**
 * A DTO for the IntermediatePoint entity.
 */
public class IntermediatePointDTO implements Serializable {

    private Long id;

    @NotNull
    @Min(value = 1)
    private Integer index;

    @NotNull
    private Long station;


    private Long routeId;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getIndex() {
        return index;
    }

    public void setIndex(Integer index) {
        this.index = index;
    }

    public Long getStation() {
        return station;
    }

    public void setStation(Long station) {
        this.station = station;
    }

    public Long getRouteId() {
        return routeId;
    }

    public void setRouteId(Long routeId) {
        this.routeId = routeId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        IntermediatePointDTO intermediatePointDTO = (IntermediatePointDTO) o;
        if (intermediatePointDTO.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), intermediatePointDTO.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "IntermediatePointDTO{" +
            "id=" + getId() +
            ", index=" + getIndex() +
            ", station=" + getStation() +
            ", route=" + getRouteId() +
            "}";
    }
}
