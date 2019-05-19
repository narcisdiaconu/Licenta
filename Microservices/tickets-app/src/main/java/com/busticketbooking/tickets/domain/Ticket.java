package com.busticketbooking.tickets.domain;



import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.Objects;

/**
 * A Ticket.
 */
@Entity
@Table(name = "ticket")
public class Ticket implements Serializable {

    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "jhi_user", nullable = false)
    private Long user;

    @NotNull
    @Column(name = "bus", nullable = false)
    private Long bus;

    @NotNull
    @Column(name = "jhi_date", nullable = false)
    private LocalDate date;

    @NotNull
    @Column(name = "places", nullable = false)
    private Integer places;

    @NotNull
    @Column(name = "price", nullable = false)
    private Double price;

    @Column(name = "paid")
    private Boolean paid;

    @NotNull
    @Column(name = "start_station", nullable = false)
    private Long startStation;

    @NotNull
    @Column(name = "end_station", nullable = false)
    private Long endStation;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUser() {
        return user;
    }

    public Ticket user(Long user) {
        this.user = user;
        return this;
    }

    public void setUser(Long user) {
        this.user = user;
    }

    public Long getBus() {
        return bus;
    }

    public Ticket bus(Long bus) {
        this.bus = bus;
        return this;
    }

    public void setBus(Long bus) {
        this.bus = bus;
    }

    public LocalDate getDate() {
        return date;
    }

    public Ticket date(LocalDate date) {
        this.date = date;
        return this;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public Integer getPlaces() {
        return places;
    }

    public Ticket places(Integer places) {
        this.places = places;
        return this;
    }

    public void setPlaces(Integer places) {
        this.places = places;
    }

    public Double getPrice() {
        return price;
    }

    public Ticket price(Double price) {
        this.price = price;
        return this;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Boolean isPaid() {
        return paid;
    }

    public Ticket paid(Boolean paid) {
        this.paid = paid;
        return this;
    }

    public void setPaid(Boolean paid) {
        this.paid = paid;
    }

    public Long getStartStation() {
        return startStation;
    }

    public Ticket startStation(Long startStation) {
        this.startStation = startStation;
        return this;
    }

    public void setStartStation(Long startStation) {
        this.startStation = startStation;
    }

    public Long getEndStation() {
        return endStation;
    }

    public Ticket endStation(Long endStation) {
        this.endStation = endStation;
        return this;
    }

    public void setEndStation(Long endStation) {
        this.endStation = endStation;
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
        Ticket ticket = (Ticket) o;
        if (ticket.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), ticket.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Ticket{" +
            "id=" + getId() +
            ", user=" + getUser() +
            ", bus=" + getBus() +
            ", date='" + getDate() + "'" +
            ", places=" + getPlaces() +
            ", price=" + getPrice() +
            ", paid='" + isPaid() + "'" +
            ", startStation=" + getStartStation() +
            ", endStation=" + getEndStation() +
            "}";
    }
}
