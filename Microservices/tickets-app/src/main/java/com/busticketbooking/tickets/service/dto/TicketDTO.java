package com.busticketbooking.tickets.service.dto;
import java.time.LocalDate;
import javax.validation.constraints.*;
import java.io.Serializable;
import java.util.Objects;

/**
 * A DTO for the Ticket entity.
 */
public class TicketDTO implements Serializable {

    private Long id;

    @NotNull
    private Long user;

    @NotNull
    private Long bus;

    @NotNull
    private LocalDate date;

    @NotNull
    private Integer places;

    @NotNull
    private Double price;

    private Boolean paid;

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

    public Long getUser() {
        return user;
    }

    public void setUser(Long user) {
        this.user = user;
    }

    public Long getBus() {
        return bus;
    }

    public void setBus(Long bus) {
        this.bus = bus;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public Integer getPlaces() {
        return places;
    }

    public void setPlaces(Integer places) {
        this.places = places;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Boolean isPaid() {
        return paid;
    }

    public void setPaid(Boolean paid) {
        this.paid = paid;
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

        TicketDTO ticketDTO = (TicketDTO) o;
        if (ticketDTO.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), ticketDTO.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "TicketDTO{" +
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
