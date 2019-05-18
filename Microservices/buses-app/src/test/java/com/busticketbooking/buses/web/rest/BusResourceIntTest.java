package com.busticketbooking.buses.web.rest;

import com.busticketbooking.buses.BusesApp;

import com.busticketbooking.buses.domain.Bus;
import com.busticketbooking.buses.repository.BusRepository;
import com.busticketbooking.buses.service.BusService;
import com.busticketbooking.buses.service.dto.BusDTO;
import com.busticketbooking.buses.service.mapper.BusMapper;
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
 * Test class for the BusResource REST controller.
 *
 * @see BusResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = BusesApp.class)
public class BusResourceIntTest {

    private static final Long DEFAULT_ROUTE = 1L;
    private static final Long UPDATED_ROUTE = 2L;

    private static final Double DEFAULT_PRICE = 0D;
    private static final Double UPDATED_PRICE = 1D;

    private static final Long DEFAULT_TOTAL_PLACES = 0L;
    private static final Long UPDATED_TOTAL_PLACES = 1L;

    private static final String DEFAULT_DEPARTURE_TIME = "05:26";
    private static final String UPDATED_DEPARTURE_TIME = "20:28";

    private static final String DEFAULT_ARRIVAL_TIME = "06:51";
    private static final String UPDATED_ARRIVAL_TIME = "23:47";

    private static final String DEFAULT_DAYS = "1011110";
    private static final String UPDATED_DAYS = "1001000";

    @Autowired
    private BusRepository busRepository;

    @Autowired
    private BusMapper busMapper;

    @Autowired
    private BusService busService;

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

    private MockMvc restBusMockMvc;

    private Bus bus;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final BusResource busResource = new BusResource(busService);
        this.restBusMockMvc = MockMvcBuilders.standaloneSetup(busResource)
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
    public static Bus createEntity(EntityManager em) {
        Bus bus = new Bus()
            .route(DEFAULT_ROUTE)
            .price(DEFAULT_PRICE)
            .totalPlaces(DEFAULT_TOTAL_PLACES)
            .departureTime(DEFAULT_DEPARTURE_TIME)
            .arrivalTime(DEFAULT_ARRIVAL_TIME)
            .days(DEFAULT_DAYS);
        return bus;
    }

    @Before
    public void initTest() {
        bus = createEntity(em);
    }

    @Test
    @Transactional
    public void createBus() throws Exception {
        int databaseSizeBeforeCreate = busRepository.findAll().size();

        // Create the Bus
        BusDTO busDTO = busMapper.toDto(bus);
        restBusMockMvc.perform(post("/api/buses")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(busDTO)))
            .andExpect(status().isCreated());

        // Validate the Bus in the database
        List<Bus> busList = busRepository.findAll();
        assertThat(busList).hasSize(databaseSizeBeforeCreate + 1);
        Bus testBus = busList.get(busList.size() - 1);
        assertThat(testBus.getRoute()).isEqualTo(DEFAULT_ROUTE);
        assertThat(testBus.getPrice()).isEqualTo(DEFAULT_PRICE);
        assertThat(testBus.getTotalPlaces()).isEqualTo(DEFAULT_TOTAL_PLACES);
        assertThat(testBus.getDepartureTime()).isEqualTo(DEFAULT_DEPARTURE_TIME);
        assertThat(testBus.getArrivalTime()).isEqualTo(DEFAULT_ARRIVAL_TIME);
        assertThat(testBus.getDays()).isEqualTo(DEFAULT_DAYS);
    }

    @Test
    @Transactional
    public void createBusWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = busRepository.findAll().size();

        // Create the Bus with an existing ID
        bus.setId(1L);
        BusDTO busDTO = busMapper.toDto(bus);

        // An entity with an existing ID cannot be created, so this API call must fail
        restBusMockMvc.perform(post("/api/buses")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(busDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Bus in the database
        List<Bus> busList = busRepository.findAll();
        assertThat(busList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkRouteIsRequired() throws Exception {
        int databaseSizeBeforeTest = busRepository.findAll().size();
        // set the field null
        bus.setRoute(null);

        // Create the Bus, which fails.
        BusDTO busDTO = busMapper.toDto(bus);

        restBusMockMvc.perform(post("/api/buses")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(busDTO)))
            .andExpect(status().isBadRequest());

        List<Bus> busList = busRepository.findAll();
        assertThat(busList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkPriceIsRequired() throws Exception {
        int databaseSizeBeforeTest = busRepository.findAll().size();
        // set the field null
        bus.setPrice(null);

        // Create the Bus, which fails.
        BusDTO busDTO = busMapper.toDto(bus);

        restBusMockMvc.perform(post("/api/buses")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(busDTO)))
            .andExpect(status().isBadRequest());

        List<Bus> busList = busRepository.findAll();
        assertThat(busList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkTotalPlacesIsRequired() throws Exception {
        int databaseSizeBeforeTest = busRepository.findAll().size();
        // set the field null
        bus.setTotalPlaces(null);

        // Create the Bus, which fails.
        BusDTO busDTO = busMapper.toDto(bus);

        restBusMockMvc.perform(post("/api/buses")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(busDTO)))
            .andExpect(status().isBadRequest());

        List<Bus> busList = busRepository.findAll();
        assertThat(busList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkDepartureTimeIsRequired() throws Exception {
        int databaseSizeBeforeTest = busRepository.findAll().size();
        // set the field null
        bus.setDepartureTime(null);

        // Create the Bus, which fails.
        BusDTO busDTO = busMapper.toDto(bus);

        restBusMockMvc.perform(post("/api/buses")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(busDTO)))
            .andExpect(status().isBadRequest());

        List<Bus> busList = busRepository.findAll();
        assertThat(busList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkArrivalTimeIsRequired() throws Exception {
        int databaseSizeBeforeTest = busRepository.findAll().size();
        // set the field null
        bus.setArrivalTime(null);

        // Create the Bus, which fails.
        BusDTO busDTO = busMapper.toDto(bus);

        restBusMockMvc.perform(post("/api/buses")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(busDTO)))
            .andExpect(status().isBadRequest());

        List<Bus> busList = busRepository.findAll();
        assertThat(busList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkDaysIsRequired() throws Exception {
        int databaseSizeBeforeTest = busRepository.findAll().size();
        // set the field null
        bus.setDays(null);

        // Create the Bus, which fails.
        BusDTO busDTO = busMapper.toDto(bus);

        restBusMockMvc.perform(post("/api/buses")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(busDTO)))
            .andExpect(status().isBadRequest());

        List<Bus> busList = busRepository.findAll();
        assertThat(busList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllBuses() throws Exception {
        // Initialize the database
        busRepository.saveAndFlush(bus);

        // Get all the busList
        restBusMockMvc.perform(get("/api/buses?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(bus.getId().intValue())))
            .andExpect(jsonPath("$.[*].route").value(hasItem(DEFAULT_ROUTE.intValue())))
            .andExpect(jsonPath("$.[*].price").value(hasItem(DEFAULT_PRICE.doubleValue())))
            .andExpect(jsonPath("$.[*].totalPlaces").value(hasItem(DEFAULT_TOTAL_PLACES.intValue())))
            .andExpect(jsonPath("$.[*].departureTime").value(hasItem(DEFAULT_DEPARTURE_TIME.toString())))
            .andExpect(jsonPath("$.[*].arrivalTime").value(hasItem(DEFAULT_ARRIVAL_TIME.toString())))
            .andExpect(jsonPath("$.[*].days").value(hasItem(DEFAULT_DAYS.toString())));
    }
    
    @Test
    @Transactional
    public void getBus() throws Exception {
        // Initialize the database
        busRepository.saveAndFlush(bus);

        // Get the bus
        restBusMockMvc.perform(get("/api/buses/{id}", bus.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(bus.getId().intValue()))
            .andExpect(jsonPath("$.route").value(DEFAULT_ROUTE.intValue()))
            .andExpect(jsonPath("$.price").value(DEFAULT_PRICE.doubleValue()))
            .andExpect(jsonPath("$.totalPlaces").value(DEFAULT_TOTAL_PLACES.intValue()))
            .andExpect(jsonPath("$.departureTime").value(DEFAULT_DEPARTURE_TIME.toString()))
            .andExpect(jsonPath("$.arrivalTime").value(DEFAULT_ARRIVAL_TIME.toString()))
            .andExpect(jsonPath("$.days").value(DEFAULT_DAYS.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingBus() throws Exception {
        // Get the bus
        restBusMockMvc.perform(get("/api/buses/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateBus() throws Exception {
        // Initialize the database
        busRepository.saveAndFlush(bus);

        int databaseSizeBeforeUpdate = busRepository.findAll().size();

        // Update the bus
        Bus updatedBus = busRepository.findById(bus.getId()).get();
        // Disconnect from session so that the updates on updatedBus are not directly saved in db
        em.detach(updatedBus);
        updatedBus
            .route(UPDATED_ROUTE)
            .price(UPDATED_PRICE)
            .totalPlaces(UPDATED_TOTAL_PLACES)
            .departureTime(UPDATED_DEPARTURE_TIME)
            .arrivalTime(UPDATED_ARRIVAL_TIME)
            .days(UPDATED_DAYS);
        BusDTO busDTO = busMapper.toDto(updatedBus);

        restBusMockMvc.perform(put("/api/buses")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(busDTO)))
            .andExpect(status().isOk());

        // Validate the Bus in the database
        List<Bus> busList = busRepository.findAll();
        assertThat(busList).hasSize(databaseSizeBeforeUpdate);
        Bus testBus = busList.get(busList.size() - 1);
        assertThat(testBus.getRoute()).isEqualTo(UPDATED_ROUTE);
        assertThat(testBus.getPrice()).isEqualTo(UPDATED_PRICE);
        assertThat(testBus.getTotalPlaces()).isEqualTo(UPDATED_TOTAL_PLACES);
        assertThat(testBus.getDepartureTime()).isEqualTo(UPDATED_DEPARTURE_TIME);
        assertThat(testBus.getArrivalTime()).isEqualTo(UPDATED_ARRIVAL_TIME);
        assertThat(testBus.getDays()).isEqualTo(UPDATED_DAYS);
    }

    @Test
    @Transactional
    public void updateNonExistingBus() throws Exception {
        int databaseSizeBeforeUpdate = busRepository.findAll().size();

        // Create the Bus
        BusDTO busDTO = busMapper.toDto(bus);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBusMockMvc.perform(put("/api/buses")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(busDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Bus in the database
        List<Bus> busList = busRepository.findAll();
        assertThat(busList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteBus() throws Exception {
        // Initialize the database
        busRepository.saveAndFlush(bus);

        int databaseSizeBeforeDelete = busRepository.findAll().size();

        // Delete the bus
        restBusMockMvc.perform(delete("/api/buses/{id}", bus.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Bus> busList = busRepository.findAll();
        assertThat(busList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Bus.class);
        Bus bus1 = new Bus();
        bus1.setId(1L);
        Bus bus2 = new Bus();
        bus2.setId(bus1.getId());
        assertThat(bus1).isEqualTo(bus2);
        bus2.setId(2L);
        assertThat(bus1).isNotEqualTo(bus2);
        bus1.setId(null);
        assertThat(bus1).isNotEqualTo(bus2);
    }

    @Test
    @Transactional
    public void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(BusDTO.class);
        BusDTO busDTO1 = new BusDTO();
        busDTO1.setId(1L);
        BusDTO busDTO2 = new BusDTO();
        assertThat(busDTO1).isNotEqualTo(busDTO2);
        busDTO2.setId(busDTO1.getId());
        assertThat(busDTO1).isEqualTo(busDTO2);
        busDTO2.setId(2L);
        assertThat(busDTO1).isNotEqualTo(busDTO2);
        busDTO1.setId(null);
        assertThat(busDTO1).isNotEqualTo(busDTO2);
    }

    @Test
    @Transactional
    public void testEntityFromId() {
        assertThat(busMapper.fromId(42L).getId()).isEqualTo(42);
        assertThat(busMapper.fromId(null)).isNull();
    }
}
