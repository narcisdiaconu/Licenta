package com.busticketbooking.users.service.impl;

import com.busticketbooking.users.service.UserdetailsService;
import com.busticketbooking.users.domain.Userdetails;
import com.busticketbooking.users.repository.UserdetailsRepository;
import com.busticketbooking.users.service.dto.UserdetailsDTO;
import com.busticketbooking.users.service.mapper.UserdetailsMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * Service Implementation for managing Userdetails.
 */
@Service
@Transactional
public class UserdetailsServiceImpl implements UserdetailsService {

    private final Logger log = LoggerFactory.getLogger(UserdetailsServiceImpl.class);

    private final UserdetailsRepository userdetailsRepository;

    private final UserdetailsMapper userdetailsMapper;

    public UserdetailsServiceImpl(UserdetailsRepository userdetailsRepository, UserdetailsMapper userdetailsMapper) {
        this.userdetailsRepository = userdetailsRepository;
        this.userdetailsMapper = userdetailsMapper;
    }

    /**
     * Save a userdetails.
     *
     * @param userdetailsDTO the entity to save
     * @return the persisted entity
     */
    @Override
    public UserdetailsDTO save(UserdetailsDTO userdetailsDTO) {
        log.debug("Request to save Userdetails : {}", userdetailsDTO);
        Userdetails userdetails = userdetailsMapper.toEntity(userdetailsDTO);
        userdetails = userdetailsRepository.save(userdetails);
        return userdetailsMapper.toDto(userdetails);
    }

    /**
     * Get all the userdetails.
     *
     * @param pageable the pagination information
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public Page<UserdetailsDTO> findAll(Pageable pageable) {
        log.debug("Request to get all Userdetails");
        return userdetailsRepository.findAll(pageable)
            .map(userdetailsMapper::toDto);
    }


    /**
     * Get one userdetails by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<UserdetailsDTO> findOne(Long id) {
        log.debug("Request to get Userdetails : {}", id);
        return userdetailsRepository.findById(id)
            .map(userdetailsMapper::toDto);
    }

    /**
     * Delete the userdetails by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete Userdetails : {}", id);
        userdetailsRepository.deleteById(id);
    }

    public Optional<UserdetailsDTO> findByAccountId(Integer accountId) {
        log.debug("Request to get Userdetails by accountId : {}", accountId);
        return userdetailsRepository.findByAccountId(accountId)
            .map(userdetailsMapper::toDto);
    }

    public Optional<UserdetailsDTO> findByEmail(String email) {
        return userdetailsRepository.findByEmail(email)
            .map(userdetailsMapper::toDto);
    }
}
