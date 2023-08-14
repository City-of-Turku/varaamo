/// <reference types="cypress" />

describe('search page', () => {
  beforeEach(() => {
    cy.fixture('purpose.json').as('purpose');
    cy.fixture('unit.json').as('unit');
    cy.fixture('resource.json').as('resource');
    cy.intercept('GET', '**/purpose/', { fixture: 'purpose.json' }).as('getPurpose');
    cy.intercept('GET', '**/unit/*', { fixture: 'unit.json' }).as('getUnit');
    cy.intercept('GET', '**/resource/*', { fixture: 'resource.json' }).as('getResource');
  });

  it('should have the correct headings', () => {
    cy.visit('localhost:3000/search');
    cy.get('.app-SearchControlsContainer__content h1').should('have.text', 'Mitä haluat tehdä?');
  });

  // eslint-disable-next-line func-names
  it('should have correct search results', function () {
    cy.visit('localhost:3000/search');
    cy.wait('@getPurpose');
    cy.wait('@getUnit');
    cy.wait('@getResource');
    const resourceNames = this.resource.results.map((resource) => resource.name.fi);
    cy.get('.app-ResourceCard').should('have.length', resourceNames.length);
    cy.get('.app-ResourceCard__content h3').each(($el, index) => {
      expect($el.text()).to.equal(resourceNames[index]);
    });
  });
});
