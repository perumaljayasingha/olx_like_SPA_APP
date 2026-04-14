describe('Bazaar India SPA smoke', () => {
  it('loads home and listings pages', () => {
    cy.visit('/');
    cy.contains('Explore India listings').should('exist');

    cy.visit('/listings');
    cy.contains('Browse listings in India').should('exist');
  });

  it('opens register and login pages', () => {
    cy.visit('/register');
    cy.contains('Register with mobile OTP verification').should('exist');

    cy.visit('/login');
    cy.contains('Login with mobile OTP').should('exist');
  });
});
