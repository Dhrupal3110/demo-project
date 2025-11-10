describe('Program search and stepper forms', () => {
  const next = () => cy.get('#stepper-next').click();

  const selectFirstDatabase = () => {
    cy.contains('h2', 'Select databases', { matchCase: false, timeout: 10000 }).should(
      'be.visible'
    );
    cy.get('table tbody tr', { timeout: 10000 })
      .first()
      .within(() => {
        cy.get('input[type="checkbox"]').should('not.be.checked').check({ force: true });
        cy.get('input[type="checkbox"]').should('be.checked');
      });
  };

  const selectPortfolio = () => {
    cy.contains('h2', 'Select portfolios', { matchCase: false, timeout: 10000 }).should(
      'be.visible'
    );
    cy.contains('button', 'EDM_RH_39823_AutoOwners_EQ_19', { timeout: 10000 }).click();
    cy.get('table tbody tr', { timeout: 10000 })
      .first()
      .within(() => {
        cy.get('input[type="checkbox"]').check({ force: true }).should('be.checked');
      });
  };

  const configureDemandSurge = () => {
    cy.contains('h2', 'Set demand surge', { matchCase: false, timeout: 10000 }).should(
      'be.visible'
    );
    cy.get('table tbody tr', { timeout: 10000 })
      .first()
      .within(() => {
        cy.get('input[type="checkbox"]').check({ force: true });
        cy.get('input[type="text"]').clear().type('Automation justification');
        cy.get('input[type="text"]').should('have.value', 'Automation justification');
      });
  };

  const configurePortfolioPerils = () => {
    cy.contains('h2', 'portfolio peril coverage', {
      matchCase: false,
      timeout: 10000,
    }).should('be.visible');
    cy.get('table tbody tr', { timeout: 10000 })
      .first()
      .within(() => {
        cy.get('td').eq(4).as('wsCell');
      });
    cy.get('@wsCell').click().click();
    cy.get('@wsCell').should('have.class', 'bg-(--color-primary-dark)');
  };

  const configurePortfolioRegions = () => {
    cy.contains('h2', 'portfolio region coverage', {
      matchCase: false,
      timeout: 10000,
    }).should('be.visible');
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

  const selectTreaties = () => {
    cy.contains('h2', 'Select treaties', { matchCase: false, timeout: 10000 }).should(
      'be.visible'
    );
    cy.contains('button', 'EDM_RH_39823_AutoOwners_EQ_19', { timeout: 10000 }).click();
    cy.get('table tbody tr', { timeout: 10000 })
      .first()
      .within(() => {
        cy.get('input[type="checkbox"]').check({ force: true }).should('be.checked');
      });
  };

  const configureTreatyPerils = () => {
    cy.contains('h2', 'treaty peril coverage', { matchCase: false, timeout: 10000 }).should(
      'be.visible'
    );
    cy.get('table tbody tr', { timeout: 10000 })
      .first()
      .within(() => {
        cy.get('td').eq(4).as('wsTreatyCell');
      });
    cy.get('@wsTreatyCell').click();
    cy.get('@wsTreatyCell').should('have.class', 'bg-(--color-primary-dark)');
  };

  const configureTreatyRegions = () => {
    cy.contains('h2', 'treaty region coverage', { matchCase: false, timeout: 10000 }).should(
      'be.visible'
    );
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
  };

  const linkPortfoliosAndTreaties = () => {
    cy.contains('h2', 'Link portfolios and treaties', {
      matchCase: false,
      timeout: 10000,
    }).should('be.visible');
    cy.get('.grid.grid-cols-2 > div', { timeout: 10000 })
      .first()
      .find('.space-y-2 input[type="checkbox"]')
      .first()
      .check({ force: true })
      .should('be.checked');
    cy.get('.grid.grid-cols-2 > div', { timeout: 10000 })
      .eq(1)
      .find('.space-y-2 input[type="checkbox"]')
      .first()
      .check({ force: true })
      .should('be.checked');
  };

  it('searches programs and navigates to stepper', () => {
    cy.visit('/');
    cy.get('input[placeholder*="107311"]').type('PRG001');
    cy.contains('button', 'Search').click();
    cy.get('div.space-y-2 > div').first().click();
    cy.location('pathname', { timeout: 10000 }).should('eq', '/stepper');
    cy.contains('h2, h1', 'Select databases', { matchCase: false, timeout: 10000 }).should(
      'be.visible'
    );
  });

  it('fills each form and navigates via header', () => {
    cy.visit('/stepper?id=PRG001');

    selectFirstDatabase();
    next();

    selectPortfolio();
    next();

    configureDemandSurge();
    next();

    configurePortfolioPerils();
    next();

    configurePortfolioRegions();
    next();

    selectTreaties();
    next();

    configureTreatyPerils();
    next();

    configureTreatyRegions();
    next();

    linkPortfoliosAndTreaties();
    next();

    cy.contains('h1', 'Review analyses', { matchCase: false, timeout: 10000 }).should(
      'be.visible'
    );
    next(); // Submit
    cy.contains('Submission Successful!', { timeout: 10000 }).should('be.visible');
  });
});

