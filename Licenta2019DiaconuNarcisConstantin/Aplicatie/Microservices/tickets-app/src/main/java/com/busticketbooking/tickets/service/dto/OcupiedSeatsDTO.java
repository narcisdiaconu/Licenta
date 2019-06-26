package com.busticketbooking.tickets.service.dto;
import java.time.LocalDate;
import java.io.Serializable;
import java.util.List;
import java.util.Objects;

import javax.validation.constraints.NotNull;

public class OcupiedSeatsDTO implements Serializable {
    @NotNull
    private Long bus;

    @NotNull
    private List<Long> stops;

    @NotNull
    private Long startStation;

    @NotNull
    private Long endStation;

    @NotNull
    private LocalDate date;

    public Long getBus() {
        return bus;
    }

    public void setBus(Long bus) {
        this.bus = bus;
    }

    public List<Long> getStops() {
        return stops;
    }

    public void setStops(List<Long> stops) {
        this.stops = stops;
    }

    public Long getStartStation() {
        return startStation;
    }

    public void setStartStation(Long station) {
        this.startStation = station;
    }

    public Long getEndStation() {
        return endStation;
    }

    public void setEndStation(Long station) {
        this.endStation = station;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        OcupiedSeatsDTO ticketDTO = (OcupiedSeatsDTO) o;
        return Objects.equals(getBus(), ticketDTO.getBus());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getBus());
    }

    @Override
    public String toString() {
        return "TicketDTO{" +
            "bus=" + getBus() +
            ", date='" + getDate() + "'" +
            ", places=" + getStops() +
            ", startStation=" + getStartStation() +
            ", endStation=" + getEndStation() +
            "}";
    }
}
