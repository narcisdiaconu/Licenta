package com.busticketbooking.users.web.rest;

import com.busticketbooking.users.UsersApp;

import com.busticketbooking.users.domain.Userdetails;
import com.busticketbooking.users.repository.UserdetailsRepository;
import com.busticketbooking.users.service.UserdetailsService;
import com.busticketbooking.users.service.dto.UserdetailsDTO;
import com.busticketbooking.users.service.mapper.UserdetailsMapper;
import com.busticketbooking.users.web.rest.errors.ExceptionTranslator;

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


import static com.busticketbooking.users.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the UserdetailsResource REST controller.
 *
 * @see UserdetailsResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = UsersApp.class)
public class UserdetailsResourceIntTest {

    private static final String DEFAULT_FIRST_NAME = "AAAAAAAAAA";
    private static final String UPDATED_FIRST_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_LAST_NAME = "AAAAAAAAAA";
    private static final String UPDATED_LAST_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_ADDRESS = "AAAAAAAAAA";
    private static final String UPDATED_ADDRESS = "BBBBBBBBBB";

    private static final String DEFAULT_PHONE_NUMBER = "";
    private static final String UPDATED_PHONE_NUMBER = "B";

    private static final String DEFAULT_EMAIL = "AAAAAAAAAA";
    private static final String UPDATED_EMAIL = "BBBBBBBBBB";

    private static final Integer DEFAULT_ACCOUNT_ID = 1;
    private static final Integer UPDATED_ACCOUNT_ID = 2;

    @Autowired
    private UserdetailsRepository userdetailsRepository;

    @Autowired
    private UserdetailsMapper userdetailsMapper;

    @Autowired
    private UserdetailsService userdetailsService;

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

    private MockMvc restUserdetailsMockMvc;

    private Userdetails userdetails;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final UserdetailsResource userdetailsResource = new UserdetailsResource(userdetailsService);
        this.restUserdetailsMockMvc = MockMvcBuilders.standaloneSetup(userdetailsResource)
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
    public static Userdetails createEntity(EntityManager em) {
        Userdetails userdetails = new Userdetails()
            .firstName(DEFAULT_FIRST_NAME)
            .lastName(DEFAULT_LAST_NAME)
            .address(DEFAULT_ADDRESS)
            .phoneNumber(DEFAULT_PHONE_NUMBER)
            .email(DEFAULT_EMAIL)
            .accountId(DEFAULT_ACCOUNT_ID);
        return userdetails;
    }

    @Before
    public void initTest() {
        userdetails = createEntity(em);
    }

    @Test
    @Transactional
    public void createUserdetails() throws Exception {
        int databaseSizeBeforeCreate = userdetailsRepository.findAll().size();

        // Create the Userdetails
        UserdetailsDTO userdetailsDTO = userdetailsMapper.toDto(userdetails);
        restUserdetailsMockMvc.perform(post("/api/userdetails")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(userdetailsDTO)))
            .andExpect(status().isCreated());

        // Validate the Userdetails in the database
        List<Userdetails> userdetailsList = userdetailsRepository.findAll();
        assertThat(userdetailsList).hasSize(databaseSizeBeforeCreate + 1);
        Userdetails testUserdetails = userdetailsList.get(userdetailsList.size() - 1);
        assertThat(testUserdetails.getFirstName()).isEqualTo(DEFAULT_FIRST_NAME);
        assertThat(testUserdetails.getLastName()).isEqualTo(DEFAULT_LAST_NAME);
        assertThat(testUserdetails.getAddress()).isEqualTo(DEFAULT_ADDRESS);
        assertThat(testUserdetails.getPhoneNumber()).isEqualTo(DEFAULT_PHONE_NUMBER);
        assertThat(testUserdetails.getEmail()).isEqualTo(DEFAULT_EMAIL);
        assertThat(testUserdetails.getAccountId()).isEqualTo(DEFAULT_ACCOUNT_ID);
    }

    @Test
    @Transactional
    public void createUserdetailsWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = userdetailsRepository.findAll().size();

        // Create the Userdetails with an existing ID
        userdetails.setId(1L);
        UserdetailsDTO userdetailsDTO = userdetailsMapper.toDto(userdetails);

        // An entity with an existing ID cannot be created, so this API call must fail
        restUserdetailsMockMvc.perform(post("/api/userdetails")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(userdetailsDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Userdetails in the database
        List<Userdetails> userdetailsList = userdetailsRepository.findAll();
        assertThat(userdetailsList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkFirstNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = userdetailsRepository.findAll().size();
        // set the field null
        userdetails.setFirstName(null);

        // Create the Userdetails, which fails.
        UserdetailsDTO userdetailsDTO = userdetailsMapper.toDto(userdetails);

        restUserdetailsMockMvc.perform(post("/api/userdetails")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(userdetailsDTO)))
            .andExpect(status().isBadRequest());

        List<Userdetails> userdetailsList = userdetailsRepository.findAll();
        assertThat(userdetailsList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkLastNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = userdetailsRepository.findAll().size();
        // set the field null
        userdetails.setLastName(null);

        // Create the Userdetails, which fails.
        UserdetailsDTO userdetailsDTO = userdetailsMapper.toDto(userdetails);

        restUserdetailsMockMvc.perform(post("/api/userdetails")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(userdetailsDTO)))
            .andExpect(status().isBadRequest());

        List<Userdetails> userdetailsList = userdetailsRepository.findAll();
        assertThat(userdetailsList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkAddressIsRequired() throws Exception {
        int databaseSizeBeforeTest = userdetailsRepository.findAll().size();
        // set the field null
        userdetails.setAddress(null);

        // Create the Userdetails, which fails.
        UserdetailsDTO userdetailsDTO = userdetailsMapper.toDto(userdetails);

        restUserdetailsMockMvc.perform(post("/api/userdetails")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(userdetailsDTO)))
            .andExpect(status().isBadRequest());

        List<Userdetails> userdetailsList = userdetailsRepository.findAll();
        assertThat(userdetailsList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkPhoneNumberIsRequired() throws Exception {
        int databaseSizeBeforeTest = userdetailsRepository.findAll().size();
        // set the field null
        userdetails.setPhoneNumber(null);

        // Create the Userdetails, which fails.
        UserdetailsDTO userdetailsDTO = userdetailsMapper.toDto(userdetails);

        restUserdetailsMockMvc.perform(post("/api/userdetails")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(userdetailsDTO)))
            .andExpect(status().isBadRequest());

        List<Userdetails> userdetailsList = userdetailsRepository.findAll();
        assertThat(userdetailsList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkEmailIsRequired() throws Exception {
        int databaseSizeBeforeTest = userdetailsRepository.findAll().size();
        // set the field null
        userdetails.setEmail(null);

        // Create the Userdetails, which fails.
        UserdetailsDTO userdetailsDTO = userdetailsMapper.toDto(userdetails);

        restUserdetailsMockMvc.perform(post("/api/userdetails")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(userdetailsDTO)))
            .andExpect(status().isBadRequest());

        List<Userdetails> userdetailsList = userdetailsRepository.findAll();
        assertThat(userdetailsList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkAccountIdIsRequired() throws Exception {
        int databaseSizeBeforeTest = userdetailsRepository.findAll().size();
        // set the field null
        userdetails.setAccountId(null);

        // Create the Userdetails, which fails.
        UserdetailsDTO userdetailsDTO = userdetailsMapper.toDto(userdetails);

        restUserdetailsMockMvc.perform(post("/api/userdetails")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(userdetailsDTO)))
            .andExpect(status().isBadRequest());

        List<Userdetails> userdetailsList = userdetailsRepository.findAll();
        assertThat(userdetailsList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllUserdetails() throws Exception {
        // Initialize the database
        userdetailsRepository.saveAndFlush(userdetails);

        // Get all the userdetailsList
        restUserdetailsMockMvc.perform(get("/api/userdetails?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(userdetails.getId().intValue())))
            .andExpect(jsonPath("$.[*].firstName").value(hasItem(DEFAULT_FIRST_NAME.toString())))
            .andExpect(jsonPath("$.[*].lastName").value(hasItem(DEFAULT_LAST_NAME.toString())))
            .andExpect(jsonPath("$.[*].address").value(hasItem(DEFAULT_ADDRESS.toString())))
            .andExpect(jsonPath("$.[*].phoneNumber").value(hasItem(DEFAULT_PHONE_NUMBER.toString())))
            .andExpect(jsonPath("$.[*].email").value(hasItem(DEFAULT_EMAIL.toString())))
            .andExpect(jsonPath("$.[*].accountId").value(hasItem(DEFAULT_ACCOUNT_ID)));
    }
    
    @Test
    @Transactional
    public void getUserdetails() throws Exception {
        // Initialize the database
        userdetailsRepository.saveAndFlush(userdetails);

        // Get the userdetails
        restUserdetailsMockMvc.perform(get("/api/userdetails/{id}", userdetails.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(userdetails.getId().intValue()))
            .andExpect(jsonPath("$.firstName").value(DEFAULT_FIRST_NAME.toString()))
            .andExpect(jsonPath("$.lastName").value(DEFAULT_LAST_NAME.toString()))
            .andExpect(jsonPath("$.address").value(DEFAULT_ADDRESS.toString()))
            .andExpect(jsonPath("$.phoneNumber").value(DEFAULT_PHONE_NUMBER.toString()))
            .andExpect(jsonPath("$.email").value(DEFAULT_EMAIL.toString()))
            .andExpect(jsonPath("$.accountId").value(DEFAULT_ACCOUNT_ID));
    }

    @Test
    @Transactional
    public void getNonExistingUserdetails() throws Exception {
        // Get the userdetails
        restUserdetailsMockMvc.perform(get("/api/userdetails/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateUserdetails() throws Exception {
        // Initialize the database
        userdetailsRepository.saveAndFlush(userdetails);

        int databaseSizeBeforeUpdate = userdetailsRepository.findAll().size();

        // Update the userdetails
        Userdetails updatedUserdetails = userdetailsRepository.findById(userdetails.getId()).get();
        // Disconnect from session so that the updates on updatedUserdetails are not directly saved in db
        em.detach(updatedUserdetails);
        updatedUserdetails
            .firstName(UPDATED_FIRST_NAME)
            .lastName(UPDATED_LAST_NAME)
            .address(UPDATED_ADDRESS)
            .phoneNumber(UPDATED_PHONE_NUMBER)
            .email(UPDATED_EMAIL)
            .accountId(UPDATED_ACCOUNT_ID);
        UserdetailsDTO userdetailsDTO = userdetailsMapper.toDto(updatedUserdetails);

        restUserdetailsMockMvc.perform(put("/api/userdetails")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(userdetailsDTO)))
            .andExpect(status().isOk());

        // Validate the Userdetails in the database
        List<Userdetails> userdetailsList = userdetailsRepository.findAll();
        assertThat(userdetailsList).hasSize(databaseSizeBeforeUpdate);
        Userdetails testUserdetails = userdetailsList.get(userdetailsList.size() - 1);
        assertThat(testUserdetails.getFirstName()).isEqualTo(UPDATED_FIRST_NAME);
        assertThat(testUserdetails.getLastName()).isEqualTo(UPDATED_LAST_NAME);
        assertThat(testUserdetails.getAddress()).isEqualTo(UPDATED_ADDRESS);
        assertThat(testUserdetails.getPhoneNumber()).isEqualTo(UPDATED_PHONE_NUMBER);
        assertThat(testUserdetails.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testUserdetails.getAccountId()).isEqualTo(UPDATED_ACCOUNT_ID);
    }

    @Test
    @Transactional
    public void updateNonExistingUserdetails() throws Exception {
        int databaseSizeBeforeUpdate = userdetailsRepository.findAll().size();

        // Create the Userdetails
        UserdetailsDTO userdetailsDTO = userdetailsMapper.toDto(userdetails);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUserdetailsMockMvc.perform(put("/api/userdetails")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(userdetailsDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Userdetails in the database
        List<Userdetails> userdetailsList = userdetailsRepository.findAll();
        assertThat(userdetailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteUserdetails() throws Exception {
        // Initialize the database
        userdetailsRepository.saveAndFlush(userdetails);

        int databaseSizeBeforeDelete = userdetailsRepository.findAll().size();

        // Delete the userdetails
        restUserdetailsMockMvc.perform(delete("/api/userdetails/{id}", userdetails.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Userdetails> userdetailsList = userdetailsRepository.findAll();
        assertThat(userdetailsList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Userdetails.class);
        Userdetails userdetails1 = new Userdetails();
        userdetails1.setId(1L);
        Userdetails userdetails2 = new Userdetails();
        userdetails2.setId(userdetails1.getId());
        assertThat(userdetails1).isEqualTo(userdetails2);
        userdetails2.setId(2L);
        assertThat(userdetails1).isNotEqualTo(userdetails2);
        userdetails1.setId(null);
        assertThat(userdetails1).isNotEqualTo(userdetails2);
    }

    @Test
    @Transactional
    public void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(UserdetailsDTO.class);
        UserdetailsDTO userdetailsDTO1 = new UserdetailsDTO();
        userdetailsDTO1.setId(1L);
        UserdetailsDTO userdetailsDTO2 = new UserdetailsDTO();
        assertThat(userdetailsDTO1).isNotEqualTo(userdetailsDTO2);
        userdetailsDTO2.setId(userdetailsDTO1.getId());
        assertThat(userdetailsDTO1).isEqualTo(userdetailsDTO2);
        userdetailsDTO2.setId(2L);
        assertThat(userdetailsDTO1).isNotEqualTo(userdetailsDTO2);
        userdetailsDTO1.setId(null);
        assertThat(userdetailsDTO1).isNotEqualTo(userdetailsDTO2);
    }

    @Test
    @Transactional
    public void testEntityFromId() {
        assertThat(userdetailsMapper.fromId(42L).getId()).isEqualTo(42);
        assertThat(userdetailsMapper.fromId(null)).isNull();
    }
}
