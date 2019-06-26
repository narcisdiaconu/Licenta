package com.busticketbooking.routes.web.rest;

import com.busticketbooking.routes.RoutesApp;

import com.busticketbooking.routes.domain.Route;
import com.busticketbooking.routes.repository.RouteRepository;
import com.busticketbooking.routes.service.RouteService;
import com.busticketbooking.routes.service.dto.RouteDTO;
import com.busticketbooking.routes.service.mapper.RouteMapper;
import com.busticketbooking.routes.web.rest.errors.ExceptionTranslator;

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


import static com.busticketbooking.routes.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the RouteResource REST controller.
 *
 * @see RouteResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = RoutesApp.class)
public class RouteResourceIntTest {

    private static final String DEFAULT_TITLE = "AAAAAAAAAA";
    private static final String UPDATED_TITLE = "BBBBBBBBBB";

    private static final Long DEFAULT_START_STATION = 1L;
    private static final Long UPDATED_START_STATION = 2L;

    private static final Long DEFAULT_END_STATION = 1L;
    private static final Long UPDATED_END_STATION = 2L;

    @Autowired
    private RouteRepository routeRepository;

    @Autowired
    private RouteMapper routeMapper;

    @Autowired
    private RouteService routeService;

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

    private MockMvc restRouteMockMvc;

    private Route route;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final RouteResource routeResource = new RouteResource(routeService);
        this.restRouteMockMvc = MockMvcBuilders.standaloneSetup(routeResource)
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
    public static Route createEntity(EntityManager em) {
        Route route = new Route()
            .title(DEFAULT_TITLE)
            .startStation(DEFAULT_START_STATION)
            .endStation(DEFAULT_END_STATION);
        return route;
    }

    @Before
    public void initTest() {
        route = createEntity(em);
    }

    @Test
    @Transactional
    public void createRoute() throws Exception {
        int databaseSizeBeforeCreate = routeRepository.findAll().size();

        // Create the Route
        RouteDTO routeDTO = routeMapper.toDto(route);
        restRouteMockMvc.perform(post("/api/routes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(routeDTO)))
            .andExpect(status().isCreated());

        // Validate the Route in the database
        List<Route> routeList = routeRepository.findAll();
        assertThat(routeList).hasSize(databaseSizeBeforeCreate + 1);
        Route testRoute = routeList.get(routeList.size() - 1);
        assertThat(testRoute.getTitle()).isEqualTo(DEFAULT_TITLE);
        assertThat(testRoute.getStartStation()).isEqualTo(DEFAULT_START_STATION);
        assertThat(testRoute.getEndStation()).isEqualTo(DEFAULT_END_STATION);
    }

    @Test
    @Transactional
    public void createRouteWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = routeRepository.findAll().size();

        // Create the Route with an existing ID
        route.setId(1L);
        RouteDTO routeDTO = routeMapper.toDto(route);

        // An entity with an existing ID cannot be created, so this API call must fail
        restRouteMockMvc.perform(post("/api/routes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(routeDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Route in the database
        List<Route> routeList = routeRepository.findAll();
        assertThat(routeList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkTitleIsRequired() throws Exception {
        int databaseSizeBeforeTest = routeRepository.findAll().size();
        // set the field null
        route.setTitle(null);

        // Create the Route, which fails.
        RouteDTO routeDTO = routeMapper.toDto(route);

        restRouteMockMvc.perform(post("/api/routes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(routeDTO)))
            .andExpect(status().isBadRequest());

        List<Route> routeList = routeRepository.findAll();
        assertThat(routeList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkStartStationIsRequired() throws Exception {
        int databaseSizeBeforeTest = routeRepository.findAll().size();
        // set the field null
        route.setStartStation(null);

        // Create the Route, which fails.
        RouteDTO routeDTO = routeMapper.toDto(route);

        restRouteMockMvc.perform(post("/api/routes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(routeDTO)))
            .andExpect(status().isBadRequest());

        List<Route> routeList = routeRepository.findAll();
        assertThat(routeList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkEndStationIsRequired() throws Exception {
        int databaseSizeBeforeTest = routeRepository.findAll().size();
        // set the field null
        route.setEndStation(null);

        // Create the Route, which fails.
        RouteDTO routeDTO = routeMapper.toDto(route);

        restRouteMockMvc.perform(post("/api/routes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(routeDTO)))
            .andExpect(status().isBadRequest());

        List<Route> routeList = routeRepository.findAll();
        assertThat(routeList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllRoutes() throws Exception {
        // Initialize the database
        routeRepository.saveAndFlush(route);

        // Get all the routeList
        restRouteMockMvc.perform(get("/api/routes?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(route.getId().intValue())))
            .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE.toString())))
            .andExpect(jsonPath("$.[*].startStation").value(hasItem(DEFAULT_START_STATION.intValue())))
            .andExpect(jsonPath("$.[*].endStation").value(hasItem(DEFAULT_END_STATION.intValue())));
    }
    
    @Test
    @Transactional
    public void getRoute() throws Exception {
        // Initialize the database
        routeRepository.saveAndFlush(route);

        // Get the route
        restRouteMockMvc.perform(get("/api/routes/{id}", route.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(route.getId().intValue()))
            .andExpect(jsonPath("$.title").value(DEFAULT_TITLE.toString()))
            .andExpect(jsonPath("$.startStation").value(DEFAULT_START_STATION.intValue()))
            .andExpect(jsonPath("$.endStation").value(DEFAULT_END_STATION.intValue()));
    }

    @Test
    @Transactional
    public void getNonExistingRoute() throws Exception {
        // Get the route
        restRouteMockMvc.perform(get("/api/routes/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateRoute() throws Exception {
        // Initialize the database
        routeRepository.saveAndFlush(route);

        int databaseSizeBeforeUpdate = routeRepository.findAll().size();

        // Update the route
        Route updatedRoute = routeRepository.findById(route.getId()).get();
        // Disconnect from session so that the updates on updatedRoute are not directly saved in db
        em.detach(updatedRoute);
        updatedRoute
            .title(UPDATED_TITLE)
            .startStation(UPDATED_START_STATION)
            .endStation(UPDATED_END_STATION);
        RouteDTO routeDTO = routeMapper.toDto(updatedRoute);

        restRouteMockMvc.perform(put("/api/routes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(routeDTO)))
            .andExpect(status().isOk());

        // Validate the Route in the database
        List<Route> routeList = routeRepository.findAll();
        assertThat(routeList).hasSize(databaseSizeBeforeUpdate);
        Route testRoute = routeList.get(routeList.size() - 1);
        assertThat(testRoute.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testRoute.getStartStation()).isEqualTo(UPDATED_START_STATION);
        assertThat(testRoute.getEndStation()).isEqualTo(UPDATED_END_STATION);
    }

    @Test
    @Transactional
    public void updateNonExistingRoute() throws Exception {
        int databaseSizeBeforeUpdate = routeRepository.findAll().size();

        // Create the Route
        RouteDTO routeDTO = routeMapper.toDto(route);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRouteMockMvc.perform(put("/api/routes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(routeDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Route in the database
        List<Route> routeList = routeRepository.findAll();
        assertThat(routeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteRoute() throws Exception {
        // Initialize the database
        routeRepository.saveAndFlush(route);

        int databaseSizeBeforeDelete = routeRepository.findAll().size();

        // Delete the route
        restRouteMockMvc.perform(delete("/api/routes/{id}", route.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Route> routeList = routeRepository.findAll();
        assertThat(routeList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Route.class);
        Route route1 = new Route();
        route1.setId(1L);
        Route route2 = new Route();
        route2.setId(route1.getId());
        assertThat(route1).isEqualTo(route2);
        route2.setId(2L);
        assertThat(route1).isNotEqualTo(route2);
        route1.setId(null);
        assertThat(route1).isNotEqualTo(route2);
    }

    @Test
    @Transactional
    public void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(RouteDTO.class);
        RouteDTO routeDTO1 = new RouteDTO();
        routeDTO1.setId(1L);
        RouteDTO routeDTO2 = new RouteDTO();
        assertThat(routeDTO1).isNotEqualTo(routeDTO2);
        routeDTO2.setId(routeDTO1.getId());
        assertThat(routeDTO1).isEqualTo(routeDTO2);
        routeDTO2.setId(2L);
        assertThat(routeDTO1).isNotEqualTo(routeDTO2);
        routeDTO1.setId(null);
        assertThat(routeDTO1).isNotEqualTo(routeDTO2);
    }

    @Test
    @Transactional
    public void testEntityFromId() {
        assertThat(routeMapper.fromId(42L).getId()).isEqualTo(42);
        assertThat(routeMapper.fromId(null)).isNull();
    }
}
