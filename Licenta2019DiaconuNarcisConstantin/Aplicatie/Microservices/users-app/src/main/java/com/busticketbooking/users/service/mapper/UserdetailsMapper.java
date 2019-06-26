package com.busticketbooking.users.service.mapper;

import com.busticketbooking.users.domain.*;
import com.busticketbooking.users.service.dto.UserdetailsDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity Userdetails and its DTO UserdetailsDTO.
 */
@Mapper(componentModel = "spring", uses = {})
public interface UserdetailsMapper extends EntityMapper<UserdetailsDTO, Userdetails> {



    default Userdetails fromId(Long id) {
        if (id == null) {
            return null;
        }
        Userdetails userdetails = new Userdetails();
        userdetails.setId(id);
        return userdetails;
    }
}
