describe('Stepper sidebar navigation', () => {
  const next = () => cy.get('#stepper-next').click();

  const expectStepHeading = (text) =>
    cy
      .contains('h1, h2', text, {
        matchCase: false,
        timeout: 10000,
      })
      .scrollIntoView()
      .should('be.visible');

  const selectFirstDatabase = () => {
    expectStepHeading('Select databases');
    cy.get('table tbody tr', { timeout: 10000 })
      .first()
      .within(() => {
        cy.get('input[type="checkbox"]').should('not.be.checked').check({ force: true });
        cy.get('input[type="checkbox"]').should('be.checked');
      });
  };

  const selectPortfolio = () => {
    expectStepHeading('Select portfolios');
    cy.contains('button', 'EDM_RH_39823_AutoOwners_EQ_19', { timeout: 10000 }).click();
    cy.get('table tbody tr', { timeout: 10000 })
      .first()
      .within(() => {
        cy.get('input[type="checkbox"]').check({ force: true }).should('be.checked');
      });
  };

  const configureDemandSurge = () => {
    expectStepHeading('Set demand surge');
    cy.get('table tbody tr', { timeout: 10000 })
      .first()
      .within(() => {
        cy.get('input[type="checkbox"]').check({ force: true });
        cy.get('input[type="text"]').clear().type('Automation justification');
        cy.get('input[type="text"]').should('have.value', 'Automation justification');
      });
  };

  const configurePortfolioPerils = () => {
    expectStepHeading('portfolio peril coverage');
    cy.get('table tbody tr', { timeout: 10000 })
      .first()
      .within(() => {
        cy.get('td').eq(4).as('wsCell');
      });
    cy.get('@wsCell').click().click();
    cy.get('@wsCell').should('have.class', 'bg-(--color-primary-dark)');
  };

  const configurePortfolioRegions = () => {
    expectStepHeading('portfolio region coverage');
    cy.get('.grid.grid-cols-2', { timeout: 10000 })
      .first()
      .within(() => {
        cy.get('input[type="checkbox"]').first().check({ force: true }).should('be.checked');
      });
    cy.contains('h3', 'Regional Coverage')
      .parent()
      .parent()
      .find('input[type="checkbox"]')
      .first()
      .check({ force: true });
    cy.contains('button', 'Add').click();
  };

  const goToStepSix = () => {
    selectFirstDatabase();
    next();

    selectPortfolio();
    next();

    configureDemandSurge();
    next();

    configurePortfolioPerils();
    next();

    configurePortfolioRegions();

    expectStepHeading('portfolio region coverage');
  };

  const sidebarItem = (stepNumber, label) =>
    cy.contains('li', `${stepNumber}. ${label}`, { matchCase: false });

  it('allows navigating to any previously visited step from the sidebar', () => {
    cy.visit('/stepper?id=PRG001');

    goToStepSix();

    // Step 6 is the farthest visited step
    sidebarItem(6, 'Set portfolio region coverage')
      .should('have.class', 'text-(--color-primary)')
      .and('not.have.class', 'cursor-not-allowed');

    // Jump back via sidebar to earlier visited steps
    sidebarItem(4, 'Set demand surge').click();
    expectStepHeading('Set demand surge');

    sidebarItem(3, 'Select portfolios').click();
    expectStepHeading('Select portfolios');

    sidebarItem(2, 'Select databases').click();
    expectStepHeading('Select databases');

    // Navigate forward again to the last visited step using the sidebar
    sidebarItem(6, 'Set portfolio region coverage').click();
    expectStepHeading('portfolio region coverage');

    // Steps beyond the max visited step remain locked
    sidebarItem(7, 'Select treaties').should('have.class', 'cursor-not-allowed');

    // Sidebar can still navigate back to the databases step (step 2)
    sidebarItem(2, 'Select databases').click();
    expectStepHeading('Select databases');

    // And we can move forward via sidebar back to step 5
    sidebarItem(5, 'Set portfolio peril coverage').click();
    expectStepHeading('portfolio peril coverage');
  });
});

