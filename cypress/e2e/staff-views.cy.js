const adminUserOidc = require('../fixtures/oidc_user_admin.json');
const adminUserData = require('../fixtures/user_admin.json');
const { forceUserLogin } = require('../utils/scripts');

describe('staff views', () => {
  beforeEach(() => {
    cy.fixture('purpose.json').as('purpose');
    cy.fixture('resource_office_search.json').as('resourceSearch');
    cy.fixture('resource_office_detail.json').as('resourceDetail');
    cy.fixture('unit.json').as('unit');

    cy.intercept('GET', '**/purpose/', { fixture: 'purpose.json' }).as('getPurpose');
    cy.intercept('GET', '**/unit/*', { fixture: 'unit.json' }).as('getUnit');
    cy.intercept('GET', '**/resource/*', { fixture: 'resource_office_search.json' }).as('getResource');
    cy.intercept('GET', '**/user/*', { fixture: 'user_admin.json' }).as('getUser');
  });

  it('can see admin nav links', () => {
    cy.visit('localhost:3000');
    cy.get('#CybotCookiebotDialogBodyButtonDecline').click();

    forceUserLogin(adminUserData, adminUserOidc);

    cy.get('.navbar-header a').contains('Varaamo');
    cy.get('.navbar-nav a').contains('Haku');
    cy.get('.navbar-nav a').contains('Omat tilat');
    cy.get('.navbar-nav a').contains('Omat varaukset');
    cy.get('.navbar-nav a').contains('Varausten hallinta');
    cy.get('.navbar-nav a').contains('Ylläpito');
    cy.get('.navbar-nav a').contains('Opas');
    cy.get('.navbar-nav a').contains('Lisää tietoa');
  });

  it('can open my premises page', () => {
    cy.visit('localhost:3000');
    cy.get('#CybotCookiebotDialogBodyButtonDecline').click();

    forceUserLogin(adminUserData, adminUserOidc);

    cy.get('.navbar-nav a').contains('Omat tilat').click();
    cy.get('h1').contains('Omat tilat');
  });

  it('can open manage reservations page', () => {
    cy.visit('localhost:3000');
    cy.get('#CybotCookiebotDialogBodyButtonDecline').click();

    forceUserLogin(adminUserData, adminUserOidc);

    cy.get('.navbar-nav a').contains('Varausten hallinta').click();
    cy.get('h1').contains('Varausten hallinta');
  });
});
