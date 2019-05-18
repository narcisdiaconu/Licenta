package com.busticketbooking.routes.web.rest;

import com.busticketbooking.routes.RoutesApp;

import com.busticketbooking.routes.domain.IntermediatePoint;
import com.busticketbooking.routes.repository.IntermediatePointRepository;
import com.busticketbooking.routes.service.IntermediatePointService;
import com.busticketbooking.routes.service.dto.IntermediatePointDTO;
import com.busticketbooking.routes.service.mapper.IntermediatePointMapper;
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
 * Test class for the IntermediatePointResource REST controller.
 *
 * @see IntermediatePointResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = RoutesApp.class)
public class IntermediatePointResourceIntTest {

    private static final Integer DEFAULT_INDEX = 1;
    private static final Integer UPDATED_INDEX = 2;

    private static final Long DEFAULT_STATION = 1L;
    private static final Long UPDATED_STATION = 2L;

    @Autowired
    private IntermediatePointRepository intermediatePointRepository;

    @Autowired
    private IntermediatePointMapper intermediatePointMapper;

    @Autowired
    private IntermediatePointService intermediatePointService;

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

    private MockMvc restIntermediatePointMockMvc;

    private IntermediatePoint intermediatePoint;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final IntermediatePointResource intermediatePointResource = new IntermediatePointResource(intermediatePointService);
        this.restIntermediatePointMockMvc = MockMvcBuilders.standaloneSetup(intermediatePointResource)
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
    public static IntermediatePoint createEntity(EntityManager em) {
        IntermediatePoint intermediatePoint = new IntermediatePoint()
            .index(DEFAULT_INDEX)
            .station(DEFAULT_STATION);
        return intermediatePoint;
    }

    @Before
    public void initTest() {
        intermediatePoint = createEntity(em);
    }

    @Test
    @Transactional
    public void createIntermediatePoint() throws Exception {
        int databaseSizeBeforeCreate = intermediatePointRepository.findAll().size();

        // Create the IntermediatePoint
        IntermediatePointDTO intermediatePointDTO = intermediatePointMapper.toDto(intermediatePoint);
        restIntermediatePointMockMvc.perform(post("/api/intermediate-points")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(intermediatePointDTO)))
            .andExpect(status().isCreated());

        // Validate the IntermediatePoint in the database
        List<IntermediatePoint> intermediatePointList = intermediatePointRepository.findAll();
        assertThat(intermediatePointList).hasSize(databaseSizeBeforeCreate + 1);
        IntermediatePoint testIntermediatePoint = intermediatePointList.get(intermediatePointList.size() - 1);
        assertThat(testIntermediatePoint.getIndex()).isEqualTo(DEFAULT_INDEX);
        assertThat(testIntermediatePoint.getStation()).isEqualTo(DEFAULT_STATION);
    }

    @Test
    @Transactional
    public void createIntermediatePointWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = intermediatePointRepository.findAll().size();

        // Create the IntermediatePoint with an existing ID
        intermediatePoint.setId(1L);
        IntermediatePointDTO intermediatePointDTO = intermediatePointMapper.toDto(intermediatePoint);

        // An entity with an existing ID cannot be created, so this API call must fail
        restIntermediatePointMockMvc.perform(post("/api/intermediate-points")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(intermediatePointDTO)))
            .andExpect(status().isBadRequest());

        // Validate the IntermediatePoint in the database
        List<IntermediatePoint> intermediatePointList = intermediatePointRepository.findAll();
        assertThat(intermediatePointList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkIndexIsRequired() throws Exception {
        int databaseSizeBeforeTest = intermediatePointRepository.findAll().size();
        // set the field null
        intermediatePoint.setIndex(null);

        // Create the IntermediatePoint, which fails.
        IntermediatePointDTO intermediatePointDTO = intermediatePointMapper.toDto(intermediatePoint);

        restIntermediatePointMockMvc.perform(post("/api/intermediate-points")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(intermediatePointDTO)))
            .andExpect(status().isBadRequest());

        List<IntermediatePoint> intermediatePointList = intermediatePointRepository.findAll();
        assertThat(intermediatePointList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkStationIsRequired() throws Exception {
        int databaseSizeBeforeTest = intermediatePointRepository.findAll().size();
        // set the field null
        intermediatePoint.setStation(null);

        // Create the IntermediatePoint, which fails.
        IntermediatePointDTO intermediatePointDTO = intermediatePointMapper.toDto(intermediatePoint);

        restIntermediatePointMockMvc.perform(post("/api/intermediate-points")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(intermediatePointDTO)))
            .andExpect(status().isBadRequest());

        List<IntermediatePoint> intermediatePointList = intermediatePointRepository.findAll();
        assertThat(intermediatePointList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllIntermediatePoints() throws Exception {
        // Initialize the database
        intermediatePointRepository.saveAndFlush(intermediatePoint);

        // Get all the intermediatePointList
        restIntermediatePointMockMvc.perform(get("/api/intermediate-points?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(intermediatePoint.getId().intValue())))
            .andExpect(jsonPath("$.[*].index").value(hasItem(DEFAULT_INDEX)))
            .andExpect(jsonPath("$.[*].station").value(hasItem(DEFAULT_STATION.intValue())));
    }
    
    @Test
    @Transactional
    public void getIntermediatePoint() throws Exception {
        // Initialize the database
        intermediatePointRepository.saveAndFlush(intermediatePoint);

        // Get the intermediatePoint
        restIntermediatePointMockMvc.perform(get("/api/intermediate-points/{id}", intermediatePoint.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(intermediatePoint.getId().intValue()))
            .andExpect(jsonPath("$.index").value(DEFAULT_INDEX))
            .andExpect(jsonPath("$.station").value(DEFAULT_STATION.intValue()));
    }

    @Test
    @Transactional
    public void getNonExistingIntermediatePoint() throws Exception {
        // Get the intermediatePoint
        restIntermediatePointMockMvc.perform(get("/api/intermediate-points/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateIntermediatePoint() throws Exception {
        // Initialize the database
        intermediatePointRepository.saveAndFlush(intermediatePoint);

        int databaseSizeBeforeUpdate = intermediatePointRepository.findAll().size();

        // Update the intermediatePoint
        IntermediatePoint updatedIntermediatePoint = intermediatePointRepository.findById(intermediatePoint.getId()).get();
        // Disconnect from session so that the updates on updatedIntermediatePoint are not directly saved in db
        em.detach(updatedIntermediatePoint);
        updatedIntermediatePoint
            .index(UPDATED_INDEX)
            .station(UPDATED_STATION);
        IntermediatePointDTO intermediatePointDTO = intermediatePointMapper.toDto(updatedIntermediatePoint);

        restIntermediatePointMockMvc.perform(put("/api/intermediate-points")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(intermediatePointDTO)))
            .andExpect(status().isOk());

        // Validate the IntermediatePoint in the database
        List<IntermediatePoint> intermediatePointList = intermediatePointRepository.findAll();
        assertThat(intermediatePointList).hasSize(databaseSizeBeforeUpdate);
        IntermediatePoint testIntermediatePoint = intermediatePointList.get(intermediatePointList.size() - 1);
        assertThat(testIntermediatePoint.getIndex()).isEqualTo(UPDATED_INDEX);
        assertThat(testIntermediatePoint.getStation()).isEqualTo(UPDATED_STATION);
    }

    @Test
    @Transactional
    public void updateNonExistingIntermediatePoint() throws Exception {
        int databaseSizeBeforeUpdate = intermediatePointRepository.findAll().size();

        // Create the IntermediatePoint
        IntermediatePointDTO intermediatePointDTO = intermediatePointMapper.toDto(intermediatePoint);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restIntermediatePointMockMvc.perform(put("/api/intermediate-points")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(intermediatePointDTO)))
            .andExpect(status().isBadRequest());

        // Validate the IntermediatePoint in the database
        List<IntermediatePoint> intermediatePointList = intermediatePointRepository.findAll();
        assertThat(intermediatePointList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteIntermediatePoint() throws Exception {
        // Initialize the database
        intermediatePointRepository.saveAndFlush(intermediatePoint);

        int databaseSizeBeforeDelete = intermediatePointRepository.findAll().size();

        // Delete the intermediatePoint
        restIntermediatePointMockMvc.perform(delete("/api/intermediate-points/{id}", intermediatePoint.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<IntermediatePoint> intermediatePointList = intermediatePointRepository.findAll();
        assertThat(intermediatePointList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(IntermediatePoint.class);
        IntermediatePoint intermediatePoint1 = new IntermediatePoint();
        intermediatePoint1.setId(1L);
        IntermediatePoint intermediatePoint2 = new IntermediatePoint();
        intermediatePoint2.setId(intermediatePoint1.getId());
        assertThat(intermediatePoint1).isEqualTo(intermediatePoint2);
        intermediatePoint2.setId(2L);
        assertThat(intermediatePoint1).isNotEqualTo(intermediatePoint2);
        intermediatePoint1.setId(null);
        assertThat(intermediatePoint1).isNotEqualTo(intermediatePoint2);
    }

    @Test
    @Transactional
    public void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(IntermediatePointDTO.class);
        IntermediatePointDTO intermediatePointDTO1 = new IntermediatePointDTO();
        intermediatePointDTO1.setId(1L);
        IntermediatePointDTO intermediatePointDTO2 = new IntermediatePointDTO();
        assertThat(intermediatePointDTO1).isNotEqualTo(intermediatePointDTO2);
        intermediatePointDTO2.setId(intermediatePointDTO1.getId());
        assertThat(intermediatePointDTO1).isEqualTo(intermediatePointDTO2);
        intermediatePointDTO2.setId(2L);
        assertThat(intermediatePointDTO1).isNotEqualTo(intermediatePointDTO2);
        intermediatePointDTO1.setId(null);
        assertThat(intermediatePointDTO1).isNotEqualTo(intermediatePointDTO2);
    }

    @Test
    @Transactional
    public void testEntityFromId() {
        assertThat(intermediatePointMapper.fromId(42L).getId()).isEqualTo(42);
        assertThat(intermediatePointMapper.fromId(null)).isNull();
    }
}
