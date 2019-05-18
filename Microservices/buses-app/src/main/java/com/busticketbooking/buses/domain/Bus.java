package com.busticketbooking.buses.domain;


import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

/**
 * A Bus.
 */
@Entity
@Table(name = "bus")
public class Bus implements Serializable {

    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "route", nullable = false)
    private Long route;

    @NotNull
    @DecimalMin(value = "0")
    @Column(name = "price", nullable = false)
    private Double price;

    @NotNull
    @Min(value = 0L)
    @Column(name = "total_places", nullable = false)
    private Long totalPlaces;

    @NotNull
    @Pattern(regexp = "^([01][0-9]|2[0-3]):[0-5][0-9]$")
    @Column(name = "departure_time", nullable = false)
    private String departureTime;

    @NotNull
    @Pattern(regexp = "^([01][0-9]|2[0-3]):[0-5][0-9]$")
    @Column(name = "arrival_time", nullable = false)
    private String arrivalTime;

    @NotNull
    @Pattern(regexp = "^[01]{7}$")
    @Column(name = "days", nullable = false)
    private String days;

    @OneToMany(mappedBy = "bus")
    private Set<BusStop> busStops = new HashSet<>();
    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getRoute() {
        return route;
    }

    public Bus route(Long route) {
        this.route = route;
        return this;
    }

    public void setRoute(Long route) {
        this.route = route;
    }

    public Double getPrice() {
        return price;
    }

    public Bus price(Double price) {
        this.price = price;
        return this;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Long getTotalPlaces() {
        return totalPlaces;
    }

    public Bus totalPlaces(Long totalPlaces) {
        this.totalPlaces = totalPlaces;
        return this;
    }

    public void setTotalPlaces(Long totalPlaces) {
        this.totalPlaces = totalPlaces;
    }

    public String getDepartureTime() {
        return departureTime;
    }

    public Bus departureTime(String departureTime) {
        this.departureTime = departureTime;
        return this;
    }

    public void setDepartureTime(String departureTime) {
        this.departureTime = departureTime;
    }

    public String getArrivalTime() {
        return arrivalTime;
    }

    public Bus arrivalTime(String arrivalTime) {
        this.arrivalTime = arrivalTime;
        return this;
    }

    public void setArrivalTime(String arrivalTime) {
        this.arrivalTime = arrivalTime;
    }

    public String getDays() {
        return days;
    }

    public Bus days(String days) {
        this.days = days;
        return this;
    }

    public void setDays(String days) {
        this.days = days;
    }

    public Set<BusStop> getBusStops() {
        return busStops;
    }

    public Bus busStops(Set<BusStop> busStops) {
        this.busStops = busStops;
        return this;
    }

    public Bus addBusStop(BusStop busStop) {
        this.busStops.add(busStop);
        busStop.setBus(this);
        return this;
    }

    public Bus removeBusStop(BusStop busStop) {
        this.busStops.remove(busStop);
        busStop.setBus(null);
        return this;
    }

    public void setBusStops(Set<BusStop> busStops) {
        this.busStops = busStops;
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
        Bus bus = (Bus) o;
        if (bus.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), bus.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Bus{" +
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
