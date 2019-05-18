package com.busticketbooking.buses.domain;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.util.Objects;

/**
 * A BusStop.
 */
@Entity
@Table(name = "bus_stop")
public class BusStop implements Serializable {

    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "station", nullable = false)
    private Long station;

    @NotNull
    @Pattern(regexp = "^([01][0-9]|2[0-3]):[0-5][0-9]$")
    @Column(name = "arrival_time", nullable = false)
    private String arrivalTime;

    @NotNull
    @Pattern(regexp = "^([01][0-9]|2[0-3]):[0-5][0-9]$")
    @Column(name = "departure_time", nullable = false)
    private String departureTime;

    @NotNull
    @Column(name = "price", nullable = false)
    private Double price;

    @ManyToOne
    @JsonIgnoreProperties("busStops")
    private Bus bus;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getStation() {
        return station;
    }

    public BusStop station(Long station) {
        this.station = station;
        return this;
    }

    public void setStation(Long station) {
        this.station = station;
    }

    public String getArrivalTime() {
        return arrivalTime;
    }

    public BusStop arrivalTime(String arrivalTime) {
        this.arrivalTime = arrivalTime;
        return this;
    }

    public void setArrivalTime(String arrivalTime) {
        this.arrivalTime = arrivalTime;
    }

    public String getDepartureTime() {
        return departureTime;
    }

    public BusStop departureTime(String departureTime) {
        this.departureTime = departureTime;
        return this;
    }

    public void setDepartureTime(String departureTime) {
        this.departureTime = departureTime;
    }

    public Double getPrice() {
        return price;
    }

    public BusStop price(Double price) {
        this.price = price;
        return this;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Bus getBus() {
        return bus;
    }

    public BusStop bus(Bus bus) {
        this.bus = bus;
        return this;
    }

    public void setBus(Bus bus) {
        this.bus = bus;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        BusStop busStop = (BusStop) o;
        if (busStop.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), busStop.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "BusStop{" +
            "id=" + getId() +
            ", station=" + getStation() +
            ", arrivalTime='" + getArrivalTime() + "'" +
            ", departureTime='" + getDepartureTime() + "'" +
            ", price=" + getPrice() +
            "}";
    }
}
