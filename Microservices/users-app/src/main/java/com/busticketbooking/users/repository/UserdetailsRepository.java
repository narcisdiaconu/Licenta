package com.busticketbooking.users.repository;

import java.util.Optional;

import com.busticketbooking.users.domain.Userdetails;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the Userdetails entity.
 */
@SuppressWarnings("unused")
@Repository
public interface UserdetailsRepository extends JpaRepository<Userdetails, Long> {
    public Optional<Userdetails> findByAccountId(Integer accountId);
    public Optional<Userdetails> findByEmail(String email);
}
