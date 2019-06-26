package com.busticketbooking.buses.service.dto;
import javax.validation.constraints.*;
import java.io.Serializable;
import java.util.Objects;

/**
 * A DTO for the Bus entity.
 */
public class BusDTO implements Serializable {

    private Long id;

    @NotNull
    private Long route;

    @NotNull
    @DecimalMin(value = "0")
    private Double price;

    @NotNull
    @Min(value = 0L)
    private Long totalPlaces;

    @NotNull
    @Pattern(regexp = "^([01][0-9]|2[0-3]):[0-5][0-9]$")
    private String departureTime;

    @NotNull
    @Pattern(regexp = "^([01][0-9]|2[0-3]):[0-5][0-9]$")
    private String arrivalTime;

    @NotNull
    @Pattern(regexp = "^[01]{7}$")
    private String days;


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getRoute() {
        return route;
    }

    public void setRoute(Long route) {
        this.route = route;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Long getTotalPlaces() {
        return totalPlaces;
    }

    public void setTotalPlaces(Long totalPlaces) {
        this.totalPlaces = totalPlaces;
    }

    public String getDepartureTime() {
        return departureTime;
    }

    public void setDepartureTime(String departureTime) {
        this.departureTime = departureTime;
    }

    public String getArrivalTime() {
        return arrivalTime;
    }

    public void setArrivalTime(String arrivalTime) {
        this.arrivalTime = arrivalTime;
    }

    public String getDays() {
        return days;
    }

    public void setDays(String days) {
        this.days = days;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        BusDTO busDTO = (BusDTO) o;
        if (busDTO.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), busDTO.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "BusDTO{" +
            "id=" + getId() +
            ", route=" + getRoute() +
            ", price=" + getPrice() +
            ", totalPlaces=" + getTotalPlaces() +
            ", departureTime='" + getDepartureTime() + "'" +
            ", arrivalTime='" + getArrivalTime() + "'" +
            ", days='" + getDays() + "'" +
            "}";
    }
}
