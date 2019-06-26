package com.busticketbooking.routes.domain;


import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

/**
 * A Route.
 */
@Entity
@Table(name = "route")
public class Route implements Serializable {

    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "title", nullable = false)
    private String title;

    @NotNull
    @Column(name = "start_station", nullable = false)
    private Long startStation;

    @NotNull
    @Column(name = "end_station", nullable = false)
    private Long endStation;

    @OneToMany(mappedBy = "route")
    private Set<IntermediatePoint> intermediatePoints = new HashSet<>();
    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public Route title(String title) {
        this.title = title;
        return this;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Long getStartStation() {
        return startStation;
    }

    public Route startStation(Long startStation) {
        this.startStation = startStation;
        return this;
    }

    public void setStartStation(Long startStation) {
        this.startStation = startStation;
    }

    public Long getEndStation() {
        return endStation;
    }

    public Route endStation(Long endStation) {
        this.endStation = endStation;
        return this;
    }

    public void setEndStation(Long endStation) {
        this.endStation = endStation;
    }

    public Set<IntermediatePoint> getIntermediatePoints() {
        return intermediatePoints;
    }

    public Route intermediatePoints(Set<IntermediatePoint> intermediatePoints) {
        this.intermediatePoints = intermediatePoints;
        return this;
    }

    public Route addIntermediatePoint(IntermediatePoint intermediatePoint) {
        this.intermediatePoints.add(intermediatePoint);
        intermediatePoint.setRoute(this);
        return this;
    }

    public Route removeIntermediatePoint(IntermediatePoint intermediatePoint) {
        this.intermediatePoints.remove(intermediatePoint);
        intermediatePoint.setRoute(null);
        return this;
    }

    public void setIntermediatePoints(Set<IntermediatePoint> intermediatePoints) {
        this.intermediatePoints = intermediatePoints;
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
        Route route = (Route) o;
        if (route.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), route.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Route{" +
            "id=" + getId() +
            ", title='" + getTitle() + "'" +
            ", startStation=" + getStartStation() +
            ", endStation=" + getEndStation() +
            "}";
    }
}
