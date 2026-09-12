/// <reference types="cypress" />

beforeEach(() => {
  cy.clearCookies();
  cy.clearLocalStorage();
});

afterEach(() => {
  cy.clearCookies();
  cy.clearLocalStorage();
});
