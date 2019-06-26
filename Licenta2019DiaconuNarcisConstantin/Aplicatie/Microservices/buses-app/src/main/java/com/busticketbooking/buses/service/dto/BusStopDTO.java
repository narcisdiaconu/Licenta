package com.busticketbooking.buses.service.dto;
import javax.validation.constraints.*;
import java.io.Serializable;
import java.util.Objects;

/**
 * A DTO for the BusStop entity.
 */
public class BusStopDTO implements Serializable {

    private Long id;

    @NotNull
    private Long station;

    @NotNull
    @Pattern(regexp = "^([01][0-9]|2[0-3]):[0-5][0-9]$")
    private String arrivalTime;

    @NotNull
    @Pattern(regexp = "^([01][0-9]|2[0-3]):[0-5][0-9]$")
    private String departureTime;

    @NotNull
    private Double price;


    private Long busId;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getStation() {
        return station;
    }

    public void setStation(Long station) {
        this.station = station;
    }

    public String getArrivalTime() {
        return arrivalTime;
    }

    public void setArrivalTime(String arrivalTime) {
        this.arrivalTime = arrivalTime;
    }

    public String getDepartureTime() {
        return departureTime;
    }

    public void setDepartureTime(String departureTime) {
        this.departureTime = departureTime;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Long getBusId() {
        return busId;
    }

    public void setBusId(Long busId) {
        this.busId = busId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        BusStopDTO busStopDTO = (BusStopDTO) o;
        if (busStopDTO.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), busStopDTO.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "BusStopDTO{" +
            "id=" + getId() +
            ", station=" + getStation() +
            ", arrivalTime='" + getArrivalTime() + "'" +
            ", departureTime='" + getDepartureTime() + "'" +
            ", price=" + getPrice() +
            ", bus=" + getBusId() +
            "}";
    }
}
