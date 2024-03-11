const adminUserOidc = require('../fixtures/oidc_user_admin.json');
const adminUserData = require('../fixtures/user_admin.json');
const {
  forceUserLogin, generateOpeningHrs, formatDateTime, getTomorrowDate
} = require('../utils/scripts');
const resourceSearch = require('../fixtures/resource_office_search.json');
const reservationOffice = require('../fixtures/reservation_office.json');



describe('my premises page', () => {
  beforeEach(() => {
    cy.fixture('purpose.json').as('purpose');
    cy.fixture('unit.json').as('unit');

    cy.intercept('GET', '**/purpose/', { fixture: 'purpose.json' }).as('getPurpose');
    cy.intercept('GET', '**/unit/*', { fixture: 'unit.json' }).as('getUnit');
    cy.intercept('GET', '**/user/*', { fixture: 'user_admin.json' }).as('getUser');
    cy.intercept('GET', '**/resource/*', { fixture: 'resource_office_search.json' }).as('getResource');
  });

  it('can make reservation', () => {
    cy.visit('localhost:3000');
    cy.get('#CybotCookiebotDialogBodyButtonDecline').click();

    forceUserLogin(adminUserData, adminUserOidc);
    const updatedResources = {
      ...resourceSearch.results[0],
      opening_hours: generateOpeningHrs()
    };
    const results = [updatedResources];
    const updatedResourceSearch = { ...resourceSearch, results };
    cy.intercept('GET', '**/resource/*', updatedResourceSearch).as('getResourceDetail');

    cy.get('.navbar-nav a').contains('Omat tilat').click();
    cy.get('h1').contains('Omat tilat');
    cy.get('a').contains('seuraava päivä').click();
    cy.get('button.reservation-slot-selectable').first().click();
    cy.get('button.reservation-slot-selectable').first().click();

    // mock reservation post
    const tomorrowDate = getTomorrowDate();
    const { begin, end } = formatDateTime(tomorrowDate, '08:00', '08:30');
    const updatedReservation = { ...reservationOffice, begin, end };
    cy.intercept('POST', '**/reservation/', { body: updatedReservation }).as('postReservation');

    // fill reservation form
    cy.get('#reserverName').scrollIntoView().should('be.visible');
    cy.get('#reserverName').should('be.visible').type('Test Tester');
    cy.get('button').contains('Tallenna').click();

    // check success message
    cy.get('h4').contains('Varauksen tekeminen onnistui');
    cy.get('button').contains('Valmis').click();

    // open made reservation modal
    cy.get('button.reservation-link').first().click();
    cy.get('h3').contains('Varauksen tiedot');
  });
});
