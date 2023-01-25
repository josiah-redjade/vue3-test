

describe('experiment with todos', () => {
    beforeEach(()=>{
        cy.visit(Cypress.env('BASE_URL'))
    });

    it('adds items', ()=>{
        const textInputs = ['Taking out the trash', 'Doing dishes', 'Clean the floor'];
        textInputs.forEach(input => {
            cy.get('#todo-input').type(`${input}{enter}`);
            cy.get('ul li').last().should('have.text', input);
        })
    })

    it('deletes items', ()=>{
        const textInputs = ['Taking out the trash', 'Doing dishes', 'Clean the floor'];
        textInputs.forEach(input => {
            cy.get('#todo-input').type(`${input}{enter}`);
            cy.get('ul li').last().should('have.text', input);
        })
        for(let i = textInputs.length - 1; i >= 0; i--) {
            cy.get('ul li').last().click();
            cy.get('ul li').should('have.length', i + 1).last().should('not.have.text', textInputs[i])
        }
       cy.get('ul li').last().click();
       cy.get('ul li').should('have.length', 0)
    })
})