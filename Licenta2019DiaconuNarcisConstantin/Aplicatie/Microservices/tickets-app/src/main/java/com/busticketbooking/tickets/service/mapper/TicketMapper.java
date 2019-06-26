package com.busticketbooking.tickets.service.mapper;

import com.busticketbooking.tickets.domain.*;
import com.busticketbooking.tickets.service.dto.TicketDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity Ticket and its DTO TicketDTO.
 */
@Mapper(componentModel = "spring", uses = {})
public interface TicketMapper extends EntityMapper<TicketDTO, Ticket> {



    default Ticket fromId(Long id) {
        if (id == null) {
            return null;
        }
        Ticket ticket = new Ticket();
        ticket.setId(id);
        return ticket;
    }
}
