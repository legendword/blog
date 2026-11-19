// Use `cy.dataCy` custom command for more robust tests
// See https://docs.cypress.io/guides/references/best-practices.html#Selecting-Elements

const API = "https://analycube.com:8001";

describe("Landing", () => {
    beforeEach(() => {
        // the tests never talk to the real API
        cy.intercept("GET", `${API}/posts*`, { success: true, posts: [], postCount: "0" });
        cy.intercept("GET", `${API}/badges`, { success: true, badges: { following: 0 } });
        cy.visit("/");
    });
    it(".should() - assert that <title> is correct", () => {
        cy.title().should("include", "Legendword Blog");
    });
});
