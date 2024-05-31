/* eslint-disable camelcase */
/// <reference types="cypress" />
const userOidc = require('../fixtures/oidc_user.json');
const userData = require('../fixtures/user.json');
const { getReservationBeginEnd, getClosedDate } = require('../utils/scripts');

describe('Overnight calendar', () => {
  beforeEach(() => {
    cy.fixture('resource_overnight_detail.json').as('resourceDetail');
    cy.fixture('reservation_overnight.json').as('reservationOvernight');
  });

  function handleCommonInit(resource, skipCookiebot = false) {
    cy.intercept('GET', '**/user/*', { fixture: 'user.json' }).as('getUser');

    // start in resource page
    cy.visit(`localhost:3000/resources/${resource.id}`);

    if (!skipCookiebot) {
      cy.get('#CybotCookiebotDialogBodyButtonDecline').click();
    }

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
  }

  function getUpdatedResource(resourceFixt, reservationFixt) {
    const beginEndA = getReservationBeginEnd('13D13:00:00', '14D07:00:00');
    const beginEndB = getReservationBeginEnd('17D13:00:00', '19D07:00:00');
    const reservationA = { ...reservationFixt, ...beginEndA };
    const reservationB = { ...reservationFixt, ...beginEndB };
    const closedDate = getClosedDate('23');
    const resource = {
      ...resourceFixt,
      reservations: [reservationA, reservationB],
      openingHours: [closedDate]
    };
    return resource;
  }

  // eslint-disable-next-line func-names
  it('is displayed on resource page', function () {
    cy.intercept('GET', '**/resource/*/*', { fixture: 'resource_overnight_detail.json' }).as('getResource');
    const resource = this.resourceDetail;
    handleCommonInit(resource);
    cy.get('h1').should('be.visible').should('have.text', resource.name.fi);
    cy.get('.overnight-calendar').scrollIntoView().should('be.visible');
    cy.get('button').contains('Nykyinen kuukausi').should('be.visible');
    cy.contains('Vapaa').should('be.visible');
    cy.contains('Ei valittavissa').should('be.visible');
    cy.contains('Varattu').should('be.visible');
    cy.contains('Oma valinta').should('be.visible');
  });

  // eslint-disable-next-line func-names
  it('selects start and end', function () {
    const resource = getUpdatedResource(this.resourceDetail, this.reservationOvernight);
    cy.intercept('GET', `**/resource/${resource.id}/*`, resource).as('getResourceDetail');
    handleCommonInit(resource);
    cy.get('.overnight-calendar').scrollIntoView().should('be.visible');
    cy.get('.DayPicker-NavButton--next').click();
    cy.get('.DayPicker-Day').contains('10').click();
    cy.get('.DayPicker-Day').contains('12').click();
    cy.contains('Valittu aika').should('be.visible');
    cy.get('button').contains('Tee varaus').should('be.visible');
  });

  // eslint-disable-next-line func-names
  it('doesnt allow over max time reservations', function () {
    const resource = {
      ...getUpdatedResource(this.resourceDetail, this.reservationOvernight),
      reservations: []
    };
    cy.intercept('GET', `**/resource/${resource.id}/*`, resource).as('getResourceDetail');
    handleCommonInit(resource);
    cy.get('.overnight-calendar').scrollIntoView().should('be.visible');
    cy.get('.DayPicker-NavButton--next').click();

    cy.get('.DayPicker-Day').contains('11').click();
    cy.get('.DayPicker-Day--selected').should('have.length', 1).contains('11');
    cy.get('.DayPicker-Day').contains('17').click();
    cy.get('.DayPicker-Day--selected').should('have.length', 2);

    cy.contains('Valittu aika ylittää maksimipituuden').should('be.visible');
    cy.get('button').contains('Tee varaus').should('be.disabled');
  });

  const testCases = [
    { overnight_start_time: '13:00:00', overnight_end_time: '07:00:00' },
    { overnight_start_time: '12:00:00', overnight_end_time: '12:00:00' },
    { overnight_start_time: '10:00:00', overnight_end_time: '07:00:00' },
  ];

  // eslint-disable-next-line func-names
  it('handles select logic correctly', function () {
    testCases.forEach(({ overnight_start_time, overnight_end_time }, index) => {
      const resource = { ...this.resourceDetail, overnight_start_time, overnight_end_time };
      const updatedResource = getUpdatedResource(resource, this.reservationOvernight);
      cy.intercept('GET', `**/resource/${updatedResource.id}/*`, updatedResource).as('getResourceDetail');
      handleCommonInit(updatedResource, index > 0);
      cy.get('.overnight-calendar').scrollIntoView().should('be.visible');
      cy.get('.DayPicker-NavButton--next').click();

      cy.get('.DayPicker-Day').contains('10').click();
      cy.get('.DayPicker-Day--selected').should('have.length', 1).contains('10');
      cy.get('.DayPicker-Day').contains('10').click();
      cy.get('.DayPicker-Day--selected').should('have.length', 0);

      cy.get('.DayPicker-Day').contains('10').click();
      cy.get('.DayPicker-Day').contains('12').click();
      cy.get('.DayPicker-Day--selected').should('have.length', 2);

      cy.get('.DayPicker-Day').contains('11').click();
      cy.get('.DayPicker-Day--selected').should('have.length', 1).contains('11');
      cy.get('.DayPicker-Day').contains('13').click();
      cy.get('.DayPicker-Day--selected').should('have.length', 2);

      cy.get('.DayPicker-Day').contains('14').click();
      cy.get('.DayPicker-Day--selected').should('have.length', 1).contains('14');
      cy.get('.DayPicker-Day').contains('17').click();
      cy.get('.DayPicker-Day--selected').should('have.length', 2);

      cy.get('.DayPicker-Day').contains('19').click();
      cy.get('.DayPicker-Day--selected').should('have.length', 1).contains('19');
      cy.get('.DayPicker-Day').contains('22').last().click();
      cy.get('.DayPicker-Day--selected').should('have.length', 2);

      cy.get('.DayPicker-Day').contains('24').last().click();
      cy.get('.DayPicker-Day--selected').should('have.length', 1).contains('24');
      cy.get('.DayPicker-Day').contains('25').last().click();
      cy.get('.DayPicker-Day--selected').should('have.length', 2);

      cy.get('.DayPicker-Day').contains('13').click();
      cy.get('.DayPicker-Day--selected').should('have.length', 2).contains('24');
      cy.get('.DayPicker-Day').contains('22').last().click();
      cy.get('.DayPicker-Day--selected').should('have.length', 2).contains('24');

      cy.get('.DayPicker-Day').contains('12').click();
      cy.get('.DayPicker-Day--selected').should('have.length', 1).contains('12');
      cy.get('.DayPicker-Day').contains('15').click();
      cy.get('.DayPicker-Day--selected').should('have.length', 1).contains('12');
      cy.get('.DayPicker-Day').contains('14').click();
      cy.get('.DayPicker-Day--selected').should('have.length', 1).contains('12');

      cy.get('.DayPicker-Day').contains('12').click();
      cy.get('.DayPicker-Day--selected').should('have.length', 0);
      cy.get('.DayPicker-Day').contains('15').click();
      cy.get('.DayPicker-Day--selected').should('have.length', 1).contains('15');
      cy.get('.DayPicker-Day').contains('13').click();
      cy.get('.DayPicker-Day--selected').should('have.length', 1).contains('15');
    });
  });
});
