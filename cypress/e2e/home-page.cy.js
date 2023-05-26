/// <reference types="cypress" />

describe('home page', () => {
  beforeEach(() => {
    Cypress.config('defaultCommandTimeout', 20000);
    cy.fixture('purpose.json').as('purpose');
    cy.intercept('GET', '**/purpose/', { fixture: 'purpose.json' }).as('getPurpose');
  });

  it('should have the correct headings', () => {
    cy.visit('localhost:3000');
    cy.get('.app-HomePage__content h1').should('have.text', 'Varaamo');
    cy.get('.app-HomePage__content h2').should('have.text', 'Turun vuokrattavat tilat, laitteet ja asiantuntijapalvelut varattavana');
  });

  it('should have the correct header navigation links', () => {
    cy.visit('localhost:3000');
    cy.get('.navbar-header a').contains('Varaamo');
    cy.get('.navbar-nav a').contains('Haku');
    cy.get('.navbar-nav a').contains('Lisää tietoa');
  });

  it('should have search box and search button', () => {
    cy.visit('localhost:3000');
    cy.get('.app-HomeSearchBox input').should('be.visible');
    cy.get('.app-HomeSearchBox button').should('be.visible').should('have.text', 'Hae');
  });

  it('should have the correct purpose banners', () => {
    cy.visit('localhost:3000');
    cy.wait('@getPurpose');
    cy.get('.app-HomePageContent__banner').should('have.length', 2);
    cy.get('.app-HomePageContent__banner h3').first().should('have.text', 'Kokoustila');
    cy.get('.app-HomePageContent__banner h3').last().should('have.text', 'Testikäyttötarkoitus');
  });

  it('should have the correct footer navigation links', () => {
    cy.visit('localhost:3000');
    cy.get('footer a').should('have.length', 3);
    cy.get('footer a').first().should('have.text', 'www.turku.fi');
    cy.get('footer a').eq(1).should('have.text', 'Saavutettavuusseloste');
    cy.get('footer a').last().should('have.text', 'Palautteesi voit lähettää täältä.');
  });
});
