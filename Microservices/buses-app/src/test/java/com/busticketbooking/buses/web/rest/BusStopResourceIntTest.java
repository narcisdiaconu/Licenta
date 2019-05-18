package com.busticketbooking.buses.web.rest;

import com.busticketbooking.buses.BusesApp;

import com.busticketbooking.buses.domain.BusStop;
import com.busticketbooking.buses.repository.BusStopRepository;
import com.busticketbooking.buses.service.BusStopService;
import com.busticketbooking.buses.service.dto.BusStopDTO;
import com.busticketbooking.buses.service.mapper.BusStopMapper;
import com.busticketbooking.buses.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.Validator;

import javax.persistence.EntityManager;
import java.util.List;


import static com.busticketbooking.buses.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the BusStopResource REST controller.
 *
 * @see BusStopResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = BusesApp.class)
public class BusStopResourceIntTest {

    private static final Long DEFAULT_STATION = 1L;
    private static final Long UPDATED_STATION = 2L;

    private static final String DEFAULT_ARRIVAL_TIME = "20:14";
    private static final String UPDATED_ARRIVAL_TIME = "03:44";

    private static final String DEFAULT_DEPARTURE_TIME = "21:11";
    private static final String UPDATED_DEPARTURE_TIME = "21:02";

    private static final Double DEFAULT_PRICE = 1D;
    private static final Double UPDATED_PRICE = 2D;

    @Autowired
    private BusStopRepository busStopRepository;

    @Autowired
    private BusStopMapper busStopMapper;

    @Autowired
    private BusStopService busStopService;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    @Autowired
    private Validator validator;

    private MockMvc restBusStopMockMvc;

    private BusStop busStop;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final BusStopResource busStopResource = new BusStopResource(busStopService);
        this.restBusStopMockMvc = MockMvcBuilders.standaloneSetup(busStopResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter)
            .setValidator(validator).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static BusStop createEntity(EntityManager em) {
        BusStop busStop = new BusStop()
            .station(DEFAULT_STATION)
            .arrivalTime(DEFAULT_ARRIVAL_TIME)
            .departureTime(DEFAULT_DEPARTURE_TIME)
            .price(DEFAULT_PRICE);
        return busStop;
    }

    @Before
    public void initTest() {
        busStop = createEntity(em);
    }

    @Test
    @Transactional
    public void createBusStop() throws Exception {
        int databaseSizeBeforeCreate = busStopRepository.findAll().size();

        // Create the BusStop
        BusStopDTO busStopDTO = busStopMapper.toDto(busStop);
        restBusStopMockMvc.perform(post("/api/bus-stops")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(busStopDTO)))
            .andExpect(status().isCreated());

        // Validate the BusStop in the database
        List<BusStop> busStopList = busStopRepository.findAll();
        assertThat(busStopList).hasSize(databaseSizeBeforeCreate + 1);
        BusStop testBusStop = busStopList.get(busStopList.size() - 1);
        assertThat(testBusStop.getStation()).isEqualTo(DEFAULT_STATION);
        assertThat(testBusStop.getArrivalTime()).isEqualTo(DEFAULT_ARRIVAL_TIME);
        assertThat(testBusStop.getDepartureTime()).isEqualTo(DEFAULT_DEPARTURE_TIME);
        assertThat(testBusStop.getPrice()).isEqualTo(DEFAULT_PRICE);
    }

    @Test
    @Transactional
    public void createBusStopWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = busStopRepository.findAll().size();

        // Create the BusStop with an existing ID
        busStop.setId(1L);
        BusStopDTO busStopDTO = busStopMapper.toDto(busStop);

        // An entity with an existing ID cannot be created, so this API call must fail
        restBusStopMockMvc.perform(post("/api/bus-stops")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(busStopDTO)))
            .andExpect(status().isBadRequest());

        // Validate the BusStop in the database
        List<BusStop> busStopList = busStopRepository.findAll();
        assertThat(busStopList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkStationIsRequired() throws Exception {
        int databaseSizeBeforeTest = busStopRepository.findAll().size();
        // set the field null
        busStop.setStation(null);

        // Create the BusStop, which fails.
        BusStopDTO busStopDTO = busStopMapper.toDto(busStop);

        restBusStopMockMvc.perform(post("/api/bus-stops")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(busStopDTO)))
            .andExpect(status().isBadRequest());

        List<BusStop> busStopList = busStopRepository.findAll();
        assertThat(busStopList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkArrivalTimeIsRequired() throws Exception {
        int databaseSizeBeforeTest = busStopRepository.findAll().size();
        // set the field null
        busStop.setArrivalTime(null);

        // Create the BusStop, which fails.
        BusStopDTO busStopDTO = busStopMapper.toDto(busStop);

        restBusStopMockMvc.perform(post("/api/bus-stops")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(busStopDTO)))
            .andExpect(status().isBadRequest());

        List<BusStop> busStopList = busStopRepository.findAll();
        assertThat(busStopList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkDepartureTimeIsRequired() throws Exception {
        int databaseSizeBeforeTest = busStopRepository.findAll().size();
        // set the field null
        busStop.setDepartureTime(null);

        // Create the BusStop, which fails.
        BusStopDTO busStopDTO = busStopMapper.toDto(busStop);

        restBusStopMockMvc.perform(post("/api/bus-stops")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(busStopDTO)))
            .andExpect(status().isBadRequest());

        List<BusStop> busStopList = busStopRepository.findAll();
        assertThat(busStopList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkPriceIsRequired() throws Exception {
        int databaseSizeBeforeTest = busStopRepository.findAll().size();
        // set the field null
        busStop.setPrice(null);

        // Create the BusStop, which fails.
        BusStopDTO busStopDTO = busStopMapper.toDto(busStop);

        restBusStopMockMvc.perform(post("/api/bus-stops")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(busStopDTO)))
            .andExpect(status().isBadRequest());

        List<BusStop> busStopList = busStopRepository.findAll();
        assertThat(busStopList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllBusStops() throws Exception {
        // Initialize the database
        busStopRepository.saveAndFlush(busStop);

        // Get all the busStopList
        restBusStopMockMvc.perform(get("/api/bus-stops?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(busStop.getId().intValue())))
            .andExpect(jsonPath("$.[*].station").value(hasItem(DEFAULT_STATION.intValue())))
            .andExpect(jsonPath("$.[*].arrivalTime").value(hasItem(DEFAULT_ARRIVAL_TIME.toString())))
            .andExpect(jsonPath("$.[*].departureTime").value(hasItem(DEFAULT_DEPARTURE_TIME.toString())))
            .andExpect(jsonPath("$.[*].price").value(hasItem(DEFAULT_PRICE.doubleValue())));
    }
    
    @Test
    @Transactional
    public void getBusStop() throws Exception {
        // Initialize the database
        busStopRepository.saveAndFlush(busStop);

        // Get the busStop
        restBusStopMockMvc.perform(get("/api/bus-stops/{id}", busStop.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(busStop.getId().intValue()))
            .andExpect(jsonPath("$.station").value(DEFAULT_STATION.intValue()))
            .andExpect(jsonPath("$.arrivalTime").value(DEFAULT_ARRIVAL_TIME.toString()))
            .andExpect(jsonPath("$.departureTime").value(DEFAULT_DEPARTURE_TIME.toString()))
            .andExpect(jsonPath("$.price").value(DEFAULT_PRICE.doubleValue()));
    }

    @Test
    @Transactional
    public void getNonExistingBusStop() throws Exception {
        // Get the busStop
        restBusStopMockMvc.perform(get("/api/bus-stops/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateBusStop() throws Exception {
        // Initialize the database
        busStopRepository.saveAndFlush(busStop);

        int databaseSizeBeforeUpdate = busStopRepository.findAll().size();

        // Update the busStop
        BusStop updatedBusStop = busStopRepository.findById(busStop.getId()).get();
        // Disconnect from session so that the updates on updatedBusStop are not directly saved in db
        em.detach(updatedBusStop);
        updatedBusStop
            .station(UPDATED_STATION)
            .arrivalTime(UPDATED_ARRIVAL_TIME)
            .departureTime(UPDATED_DEPARTURE_TIME)
            .price(UPDATED_PRICE);
        BusStopDTO busStopDTO = busStopMapper.toDto(updatedBusStop);

        restBusStopMockMvc.perform(put("/api/bus-stops")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(busStopDTO)))
            .andExpect(status().isOk());

        // Validate the BusStop in the database
        List<BusStop> busStopList = busStopRepository.findAll();
        assertThat(busStopList).hasSize(databaseSizeBeforeUpdate);
        BusStop testBusStop = busStopList.get(busStopList.size() - 1);
        assertThat(testBusStop.getStation()).isEqualTo(UPDATED_STATION);
        assertThat(testBusStop.getArrivalTime()).isEqualTo(UPDATED_ARRIVAL_TIME);
        assertThat(testBusStop.getDepartureTime()).isEqualTo(UPDATED_DEPARTURE_TIME);
        assertThat(testBusStop.getPrice()).isEqualTo(UPDATED_PRICE);
    }

    @Test
    @Transactional
    public void updateNonExistingBusStop() throws Exception {
        int databaseSizeBeforeUpdate = busStopRepository.findAll().size();

        // Create the BusStop
        BusStopDTO busStopDTO = busStopMapper.toDto(busStop);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBusStopMockMvc.perform(put("/api/bus-stops")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(busStopDTO)))
            .andExpect(status().isBadRequest());

        // Validate the BusStop in the database
        List<BusStop> busStopList = busStopRepository.findAll();
        assertThat(busStopList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteBusStop() throws Exception {
        // Initialize the database
        busStopRepository.saveAndFlush(busStop);

        int databaseSizeBeforeDelete = busStopRepository.findAll().size();

        // Delete the busStop
        restBusStopMockMvc.perform(delete("/api/bus-stops/{id}", busStop.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<BusStop> busStopList = busStopRepository.findAll();
        assertThat(busStopList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(BusStop.class);
        BusStop busStop1 = new BusStop();
        busStop1.setId(1L);
        BusStop busStop2 = new BusStop();
        busStop2.setId(busStop1.getId());
        assertThat(busStop1).isEqualTo(busStop2);
        busStop2.setId(2L);
        assertThat(busStop1).isNotEqualTo(busStop2);
        busStop1.setId(null);
        assertThat(busStop1).isNotEqualTo(busStop2);
    }

    @Test
    @Transactional
    public void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(BusStopDTO.class);
        BusStopDTO busStopDTO1 = new BusStopDTO();
        busStopDTO1.setId(1L);
        BusStopDTO busStopDTO2 = new BusStopDTO();
        assertThat(busStopDTO1).isNotEqualTo(busStopDTO2);
        busStopDTO2.setId(busStopDTO1.getId());
        assertThat(busStopDTO1).isEqualTo(busStopDTO2);
        busStopDTO2.setId(2L);
        assertThat(busStopDTO1).isNotEqualTo(busStopDTO2);
        busStopDTO1.setId(null);
        assertThat(busStopDTO1).isNotEqualTo(busStopDTO2);
    }

    @Test
    @Transactional
    public void testEntityFromId() {
        assertThat(busStopMapper.fromId(42L).getId()).isEqualTo(42);
        assertThat(busStopMapper.fromId(null)).isNull();
    }
}
