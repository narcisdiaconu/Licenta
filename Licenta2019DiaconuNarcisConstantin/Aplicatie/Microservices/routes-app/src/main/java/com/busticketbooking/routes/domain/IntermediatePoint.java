package com.busticketbooking.routes.domain;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.util.Objects;

/**
 * A IntermediatePoint.
 */
@Entity
@Table(name = "intermediate_point")
public class IntermediatePoint implements Serializable {

    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Min(value = 1)
    @Column(name = "jhi_index", nullable = false)
    private Integer index;

    @NotNull
    @Column(name = "station", nullable = false)
    private Long station;

    @ManyToOne
    @JsonIgnoreProperties("intermediatePoints")
    private Route route;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getIndex() {
        return index;
    }

    public IntermediatePoint index(Integer index) {
        this.index = index;
        return this;
    }

    public void setIndex(Integer index) {
        this.index = index;
    }

    public Long getStation() {
        return station;
    }

    public IntermediatePoint station(Long station) {
        this.station = station;
        return this;
    }

    public void setStation(Long station) {
        this.station = station;
    }

    public Route getRoute() {
        return route;
    }

    public IntermediatePoint route(Route route) {
        this.route = route;
        return this;
    }

    public void setRoute(Route route) {
        this.route = route;
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
        IntermediatePoint intermediatePoint = (IntermediatePoint) o;
        if (intermediatePoint.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), intermediatePoint.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "IntermediatePoint{" +
            "id=" + getId() +
            ", index=" + getIndex() +
            ", station=" + getStation() +
            "}";
    }
}
