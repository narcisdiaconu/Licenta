package com.busticketbooking.routes.service.dto;
import javax.validation.constraints.*;
import java.io.Serializable;
import java.util.Objects;

/**
 * A DTO for the Route entity.
 */
public class RouteDTO implements Serializable {

    private Long id;

    @NotNull
    private String title;

    @NotNull
    private Long startStation;

    @NotNull
    private Long endStation;


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Long getStartStation() {
        return startStation;
    }

    public void setStartStation(Long startStation) {
        this.startStation = startStation;
    }

    public Long getEndStation() {
        return endStation;
    }

    public void setEndStation(Long endStation) {
        this.endStation = endStation;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        RouteDTO routeDTO = (RouteDTO) o;
        if (routeDTO.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), routeDTO.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "RouteDTO{" +
            "id=" + getId() +
            ", title='" + getTitle() + "'" +
            ", startStation=" + getStartStation() +
            ", endStation=" + getEndStation() +
            "}";
    }
}
