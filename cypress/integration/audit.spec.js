describe(`cypress light house audit example`, () => {
    it(`run the audit`, () => {
        cy.visit(`/`);
        cy.lighthouse();
    });
});