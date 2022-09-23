context("TicTacToe", () => {
  // Start each test with loading the URL
  beforeEach(() => {
    // load the url defined in cypress.env.json or from cli
    cy.visit(Cypress.env("url"));
  });

  // Given: The webpage loads
  // When:  A size is entered
  // Then:  A grid of the size squared is created and visible
  describe("Validate game board size", () => {
    // parameterize the test to check multiple sizes
    [3, 4, 11, 12].forEach((size) => {
      it(`Validating size ${size}`, () => {
        cy.get("input#number").type(size);
        cy.get("button#start").click();

        // walk the grid and ensure each square exists
        for (let step = 0; step < size ** 2; step++) {
          cy.get(`td#${step}`, { timeout: 0 }).should("be.visible");
        }

        // make sure there total squares matches expected
        cy.get("td").should("have.length", size ** 2);
      });
    });
  });

  // Given: The webpage loads
  // When:  A game is played with an expected winner
  // Then:  A message is displayed with the proper winner
  describe("Validate game results for win", () => {
    // parameterize the test to check both players
    [
      { start: 0, player: "X" },
      { start: 1, player: "O" },
    ].forEach((param) => {
      it(`Validate win for player ${param["player"]}`, () => {
        var size = 3;
        var start = param["start"];
        var player = param["player"];
        cy.get("input#number").type(size);
        cy.get("button#start").click();

        var done = false;
        for (let step = start; step < size ** 2; step++) {
          if (done) {
            break;
          }
          cy.get("div#endgame").then(($end) => {
            // if the endgame div is visible, stop
            if ($end.is(":visible")) {
              done = true;
            } else {
              // click the square
              cy.get(`td#${step}`).click();
            }
          });
        }

        // check the expected message is displayed
        cy.get("div#endgame").contains(`Congratulations player ${player}`, {
          timeout: 0,
        });
      });
    });
  });

  // Given: The webpage loads
  // When:  A game is played to a draw
  // Then:  No message is displayed
  describe("Validate game results for draw", () => {
    it(`Validate a draw`, () => {
      var size = 3;
      cy.get("input#number").type(size);
      cy.get("button#start").click();
      var clicks = [0, 1, 2, 4, 5, 6, 7, 8, 3];
      for (const step of clicks) {
        cy.get(`td#${step}`).click();
      }
      cy.get("div#endgame").then(($end) => {
        expect($end.is(":hidden")).to.be.true;
      });
    });
  });
});
