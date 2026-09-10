/// <reference types="cypress" />

const ingredientCard = (name: string) =>
  cy.contains('[data-testid="ingredient-card"]', name);

const addIngredient = (name: string) => {
  ingredientCard(name).within(() => {
    cy.contains('button', 'Добавить').click();
  });
};

describe('burger constructor', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');
    cy.intercept('GET', '**/api/auth/user', { fixture: 'user.json' }).as(
      'getUser'
    );
    cy.intercept('POST', '**/api/orders', { fixture: 'order.json' }).as(
      'createOrder'
    );
    cy.intercept('GET', '**/api/orders/all', { fixture: 'feed.json' }).as(
      'getFeed'
    );
    cy.intercept('GET', '**/api/orders', { fixture: 'orders.json' }).as(
      'getOrders'
    );
  });

  it('adds a bun and a filling from the ingredient list', () => {
    cy.visit('/');
    cy.wait('@getIngredients');

    addIngredient('Краторная булка N-200i');
    addIngredient('Биокотлета из марсианской Магнолии');

    cy.get('[data-testid="constructor"]')
      .should('contain', 'Краторная булка N-200i (верх)')
      .and('contain', 'Краторная булка N-200i (низ)')
      .and('contain', 'Биокотлета из марсианской Магнолии');
  });

  it('shows the selected ingredient details and closes the modal', () => {
    cy.visit('/');
    cy.wait('@getIngredients');

    ingredientCard('Биокотлета из марсианской Магнолии').find('a').click();

    cy.get('[data-testid="modal"]')
      .should('be.visible')
      .and('contain', 'Биокотлета из марсианской Магнолии')
      .and('contain', '4242')
      .and('not.contain', 'Краторная булка N-200i');

    cy.get('[data-testid="modal"]')
      .find('button[aria-label="Закрыть"]')
      .click();
    cy.get('[data-testid="modal"]').should('not.exist');

    ingredientCard('Краторная булка N-200i').find('a').click();
    cy.get('[data-testid="modal"]').should('contain', 'Краторная булка N-200i');
    cy.get('[data-testid="modal-overlay"]').click({ force: true });
    cy.get('[data-testid="modal"]').should('not.exist');
  });

  it('creates an order and clears the constructor', () => {
    cy.visit('/', {
      onBeforeLoad(win) {
        win.localStorage.setItem('refreshToken', 'fake-refresh-token');
        win.document.cookie = 'accessToken=fake-access-token; path=/';
      }
    });
    cy.wait(['@getIngredients', '@getUser']);

    addIngredient('Краторная булка N-200i');
    addIngredient('Биокотлета из марсианской Магнолии');
    addIngredient('Соус Spicy-X');
    cy.contains('button', 'Оформить заказ').click();

    cy.wait('@createOrder')
      .its('request.body.ingredients')
      .should('deep.equal', ['bun-1', 'main-1', 'sauce-1', 'bun-1']);
    cy.wait(['@getFeed', '@getOrders']);

    cy.get('[data-testid="modal"]').should('be.visible');
    cy.get('[data-testid="order-number"]').should('have.text', '424242');
    cy.get('[data-testid="modal"]')
      .find('button[aria-label="Закрыть"]')
      .click();

    cy.get('[data-testid="modal"]').should('not.exist');
    cy.get('[data-testid="constructor"]')
      .should('contain', 'Выберите булки')
      .and('contain', 'Выберите начинку')
      .and('not.contain', 'Биокотлета из марсианской Магнолии');
  });
});
