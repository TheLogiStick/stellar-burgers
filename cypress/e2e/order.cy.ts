describe('тесты заказа', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
    cy.intercept('get', 'api/auth/user', { fixture: 'user.json' });
    cy.intercept('POST', 'api/orders', { fixture: 'order.json' }).as(
      'postOrder'
    );

    window.localStorage.setItem(
      'refreshToken',
      JSON.stringify('test-refresh-token')
    );
    cy.setCookie('accessToken', 'test-access-token');
    cy.viewport(1300, 800);
    cy.visit('http://localhost:4000/');
    cy.wait('@getIngredients');
  });

  afterEach(() => {
    window.localStorage.removeItem('refreshToken');
    cy.clearCookie('accessToken');
  });

  it('отправка заказа', () => {
    cy.get('[data-cy="bun-ingredients"]').contains('Добавить').click();
    cy.get('[data-cy="main-ingredients"]').contains('Добавить').click();
    cy.get('[data-cy="sauce-ingredients"]').contains('Добавить').click();

    cy.get('[data-cy="constructor-bun-1"], [data-cy="constructor-bun-2"]')
      .should('exist')
      .and('contain', 'Булка 1');
    cy.get('[data-cy="burger-constructor"] ul')
      .should('contain', 'Начинка 1')
      .and('contain', 'Соус 1');

    cy.get('[data-cy="order-summary"] button').click();

    cy.wait('@postOrder')
      .its('request.body')
      .should('deep.equal', {
        ingredients: ['1', '3', '5', '1']
      });

    cy.get('#modals')
      .should('exist')
      .find('[data-cy="order-number"]')
      .should('contain', '12345');

    cy.get('#modals').find('button').click();

    cy.get(
      '[data-cy="constructor-bun-1"], [data-cy="constructor-bun-2"]'
    ).should('not.exist');
    cy.get('[data-cy="burger-constructor"] ul').should(
      'contain',
      'Выберите начинку'
    );
  });
});
