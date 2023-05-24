/// <reference types="cypress" />

const {
  generateOpeningHrs, getTomorrowDate, formatDateTime
} = require('../utils/scripts');
const userOidc = require('../fixtures/oidc_user.json');
const userData = require('../fixtures/user.json');


describe('make reservations', () => {
  beforeEach(() => {
    cy.fixture('purpose.json').as('purpose');
    cy.fixture('resource_office_search.json').as('resourceSearch');
    cy.fixture('resource_office_detail.json').as('resourceDetail');
    cy.fixture('unit.json').as('unit');
  });

  // eslint-disable-next-line func-names
  it('normal reservation can be made', function () {
    cy.intercept('GET', '**/purpose/', { fixture: 'purpose.json' }).as('getPurpose');
    cy.intercept('GET', '**/unit/*', { fixture: 'unit.json' }).as('getUnit');
    cy.intercept('GET', '**/resource/*', { fixture: 'resource_office_search.json' }).as('getResource');
    cy.intercept('GET', '**/user/*', { fixture: 'user.json' }).as('getUser');

    // start in home page
    cy.visit('localhost:3000');
    cy.get('#CybotCookiebotDialogBodyButtonDecline').click();

    // force user login data
    cy.window().then((win) => {
      // eslint-disable-next-line no-param-reassign
      win.INITIAL_STATE = {
        data: {
          users: {
            '123b6480-a639-62ab-1234-111ac567j19c': userData
          }
        }
      };
    });
    cy.window().its('store').invoke('dispatch', {
      type: 'redux-oidc/USER_FOUND',
      payload: userOidc
    });

    cy.wait('@getPurpose');
    cy.get('input[type="text"]').should('be.visible').type('toimisto{enter}');

    // search page
    cy.wait('@getUnit');
    cy.wait('@getResource');
    cy.get('.app-ResourceCard__content a').should('be.visible').should('have.length', 1).should('have.text', 'Toimisto 1bKirjasto')
      .click();

    // resource page
    const updatedDetail = { ...this.resourceDetail, opening_hours: generateOpeningHrs() };
    cy.intercept('GET', `**/resource/${updatedDetail.id}/*`, updatedDetail).as('getResourceDetail');
    cy.get('h1').should('be.visible').should('have.text', updatedDetail.name.fi);
    cy.get('#reservation-panel h2').should('be.visible').should('have.text', 'Ajanvaraus');

    cy.get('#dateField').should('be.visible').clear();
    const tomorrowDate = getTomorrowDate();
    cy.get('#dateField').should('be.visible').type(`${tomorrowDate}{enter}`);

    cy.get('.app-TimeSlots--date--selected button').first().click();
    cy.get('.reservation-calendar__reserve-button').should('be.visible').should('have.text', 'Tee varaus').click();

    // reservation page
    cy.get('h1').should('be.visible').should('have.text', 'Uusi varaus');
    cy.get('.app-ReservationPage__phase-index').should('have.length', 2);
    cy.get('.app-ReservationPage__phase-title').should('have.length', 2);
    cy.get('.app-ReservationPage__phase-index').first().should('be.visible').should('have.text', '1');
    cy.get('.app-ReservationPage__phase-index').last().should('be.visible').should('have.text', '2');
    cy.get('.app-ReservationPage__phase-title').first().should('be.visible').should('have.text', 'Varauksen lisätiedot');
    cy.get('.app-ReservationPage__phase-title').last().should('be.visible').should('have.text', 'Valmis');
    cy.get('h3').should('be.visible').contains('Varaajan tiedot');
    cy.get('#reserverName').should('be.visible').should('have.value', userData.display_name);
    cy.get('#reserverPhoneNumber').should('be.visible').type('0401234567');
    cy.get('#reserverEmailAddress').should('be.visible').should('have.value', userData.email);
    cy.get('#universalData').select(1);

    cy.get('#reservationExtraQuestions').should('be.visible').type('This is a test reservation');
    cy.get('.terms-checkbox-field input').should('be.visible').click();
    cy.get('.form-controls button').contains('Tallenna').should('be.visible').click();

    // reservation success page
    cy.fixture('reservation_office.json').then(reservation => {
      const { begin, end } = formatDateTime(tomorrowDate, '08:00', '08:30');
      const updatedReservation = { ...reservation, begin, end };
      cy.intercept('POST', '**/reservation/', { body: updatedReservation }).as('postReservation');
      cy.wait('@postReservation');
    });

    cy.get('h2.app-ReservationPage__header').should('be.visible').should('have.text', 'Varaus onnistui');
    cy.get('h2#reservationDetails').should('be.visible').should('have.text', 'Varauksen lisätiedot');
    cy.get('.app-ReservationConfirmation__field').first().should('be.visible')
      .should('have.text', `Varaaja / vuokraaja${userData.display_name}`);
    cy.get('button').contains('Palaa omiin varauksiin').click();

    // my reservations page
    cy.intercept('GET', '**/reservation/*', { fixture: 'reservation_office.json' }).as('getReservations');
    cy.fixture('reservation_office.json').then(reservation => {
      const { begin, end } = formatDateTime(tomorrowDate, '08:00', '08:30');
      const updatedReservation = { ...reservation, begin, end };
      cy.intercept('GET', '**/reservation/', {
        body: {
          count: 1, next: null, previous: null, results: [updatedReservation]
        }
      }).as('getReservations');
      cy.wait('@getReservations');
    });

    cy.get('h1').should('be.visible').should('have.text', 'Omat varaukset');
    cy.get('li.reservation').should('have.length', 1).contains(this.resourceDetail.name.fi);
  });
});
