describe('Smoke', () => {
  it('loads the homepage', () => {
    cy.visit('/');
    cy.contains('CRM-UI').should('be.visible');
  });

  it('shows the main header', () => {
    cy.visit('/');
    cy.get('h1').contains('CRM-UI').should('be.visible');
  });

  it('navigates using an available link', () => {
    cy.visit('/');
    cy.get('body').then(($body) => {
      const links = $body.find('a[href]');
      if (links.length) {
        cy.wrap(links.eq(0)).click();
      } else {
        cy.contains('select a recent program', { matchCase: false })
          .parent()
          .find('div.space-y-2 > div')
          .first()
          .click();
      }
    });
    cy.location('pathname', { timeout: 10000 }).should('not.eq', '/');
  });
});

