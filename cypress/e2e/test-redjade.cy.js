const data = {
    user: {
        email : "josiah@redjade.net",
        password : "Password1*",
        username: 'Josiah'
    },
    projects: [
        {
            name: 'Cypress Test Project',
            description: 'A sample project for interacting with cypress',
            samples: [
                'Sample A',
                'Sample B',
                'Sample C'
            ],
            tests: [
                {
                    name: 'Cypress Test 1',
                    consumer_name: 'Consumer Visible Cypress Test',
                    type: 'Acceptance',
                    needed_participant_count: 100,
                    questionnaire: {
                        title: 'Cypress Test Questionnaire',
                        type: 'Single Sample'
                    }
                }
            ]
        }
    ],
    usingTriggers: false
}

const basicQuestion = [
    {
        title: 'Dropdown',
        answers: [
            'A',
            'B',
            'C',
            'D'
        ]
    },
    {
        title: 'Line Scale',
        trigger: {question: 'Dropdown', answers: ['A', 'B', 'C']}
    },
    {
        title: 'Multiple Selection',
        answers: [
            'A',
            'B',
            'C',
            'D'
        ]
    },
    {
        title: 'Numeric',
        min: 5,
        max: 10,
        trigger: {question: 'Multiple Selection', answers: ['A', 'B', 'C']}
    },
    {
        title: 'Single Selection' ,
        answers: [
            'A',
            'B',
            'C',
            'D'
        ]
    },
    {
        title: 'Text'
    }
];

// const base_url = 'http://rj.redjade.localhost'
const base_url = 'https://app.josiah.redjade-qa.com';

const actions = {
    login() {
        cy.get('#account_email').click();
        cy.get('#account_email').type(data.user.email);
        cy.get('#account_password').click();
        cy.get('#account_password').type(data.user.password + '{enter}');
        cy.get('#main > header > h3 > span').should('contain.text', `Welcome Back, ${data.user.username}`)
    },
    createProjectIfEmpty() {
        cy.visit(base_url + '/projects/projects');
        cy.get('#content table [data-title-text="Name"] a').then($project_links => {
            let containsProject = false
            $project_links.each(i => {
                if ($project_links[i].textContent.match(data.projects[0].name)) {
                    containsProject = true;
                } 
            });
            if (!containsProject) {
                // Name/Description Page
                cy.get('button[ng-click="vm.create()"]').click({force: true, multiple: true});
                cy.get('input#name').type(data.projects[0].name);
                cy.get('input#description').type(data.projects[0].description)
                cy.get('button#next').click();
                // Samples
                const sample_container = 'form[name="vm.main_form"]';
                const sample_input = '[placeholder="Report Name"]';
                data.projects[0].samples.forEach(sample => {
                    cy.get(`${sample_container} ${sample_input}`).type(sample)
                    cy.get(`${sample_container} button`).click();
                    cy.get(`${sample_container} ${sample_input}`).should('not.have.value', sample)
                });
                cy.get('button#next').click();
                cy.contains(data.projects[0].name)
                cy.contains('Create Test').get('[ng-click="$select.activate()"]').first().click({force:true});
                cy.get('.ui-select-choices-row').first().click();
                cy.get('#testName').type(data.projects[0].tests[0].name);
                cy.get('[ng-model="test.consumer_name"]').type(data.projects[0].tests[0].consumer_name);
                cy.get('button[ng-click="startWizard()"]').click();
                cy.get('#radio_where_online').click();
                cy.get('button#next').click();
                cy.get('#needed_participant_count').type(data.projects[0].tests[0].needed_participant_count);
                cy.get('button#next').click();
                cy.contains('Event Name')
                cy.get('.form-group > .form-control').type('Cypress Test Event Name')
                cy.get('button#next').click();
                cy.get('[ng-click="vm.createQuestionnaire()"]').click();
                cy.get('[ng-model="vm.title"]').first().type(data.projects[0].tests[0].questionnaire.title);
                cy.get('[ng-model="vm.primary_questionnaire_type"]').click();
                cy.get('.ui-select-choices-row ').first().click()
                cy.get('#createQuestionnaireNext').click();
                cy.get('[ng-click="vm.selectAll()"]').click();
                cy.get('#createQuestionnaireSubmit').click();
            } 
        })

    },
    navigateToTestSurvey(){
        cy.visit(base_url + '/projects/projects')
        cy.contains(data.projects[0].name).click({force: true});
        cy.contains('Surveys').click();
        cy.get('[ng-click="vm.buildQuestionnaire(questionnaire.id)"]').click({force: true});
    },
    page: {
        breakAll() {
            cy.get('.question').should('have.length.of.at.least', basicQuestion.length)
            cy.get('.builder-page:first [uib-tooltip="Break All"]').click();
            cy.get('.btn-danger').first().click()
            cy.get('.builder-page').should('have.length.of.at.least', basicQuestion.length);
            cy.get('[type="button"][ng-click="vm.saveQuestionnaire()"]').click({force: true})
        },
        mergeAll() {
            cy.get('.builder-page').should('have.length.of.at.least', basicQuestion.length);
            cy.get('[ng-click="vm.removePageBreak($index)"]').each(btn => {
                cy.wrap(btn).click({force: true})
            });
            cy.get('.question').should('have.length.of.at.least', basicQuestion.length);
            cy.get('[type="button"][ng-click="vm.saveQuestionnaire()"]').click({force: true})
        },
        deleteAll() {
            cy.get('.fa-trash-o').click({force: true, multiple: true});
            cy.get('.btn-danger').click({force: true, multiple: true});
            cy.get('.question').should('have.length', 0);
            cy.get('[type="button"][ng-click="vm.saveQuestionnaire()"]').click({force: true})
        },
        addBasicQuestions(config={triggers:false}) {
            // this assumes you have the survey builder open
            cy.contains('Basic Questions').click({force: true});
            basicQuestion.forEach(question => {
                cy.get('.library-folder').contains(question.title).click()
                cy.get('.question-button-tray > .btn-success > .fa').click();
                cy.get('.trumbowyg-editor').type(`This is a ${question.title} question.`);
                if(question?.answers?.length > 0) {
                        cy.get('input[placeholder="enter response here"]').each((input, i) => {
                            cy.wrap(input).type(question.answers[i])
                        })
                } else if (question.min && question.max) {
                    cy.contains('Minimum Value').siblings().first().type(question.min, {force: true});
                    cy.contains('Maximum Value').siblings().first().type(question.max, {force: true})
                }
                if (config.triggers && question.trigger) {
                    cy.get('[heading="Logic"] > .nav-link').click();
                    cy.contains('Add Trigger').click()
                    cy.get('.ui-select-questions > .ui-select-match > .btn-default').click();
                    cy.get('.ui-select-choices-group').contains(question.trigger.question).click({force: true})
                    cy.get('[placeholder="Answer Condition..."]').click({multiple: true});
                    cy.get('.ui-select-choices-group').contains('Includes any').click();
                    cy.get('[ng-if="builderHelper.getQuestionByCID(trigger.parent_cid).hasAnswers()"] > .form-group .check-label').click({multiple: true})
                }
            });
            cy.get('.questionnaire-builder-main').click({force: true});
            cy.get('.question').should('have.length.of.at.least', basicQuestion.length)
            cy.get('[type="button"][ng-click="vm.saveQuestionnaire()"]').click({force: true})
        },
        copyPage() {
            let numPages = 0;
            let numQuestions = 0;
            cy.get('.builder-page').then(pages => {
                numPages = pages.length;
                expect(numPages).to.be.greaterThan(0);
                cy.get('.question').then(questions => {
                    numQuestions = questions.length;
                    cy.get('.zmdi-copy').first().click();
                    cy.get('#questionnaire-builder-wrapper').click({force: true})
                    cy.get('.builder-page').should('have.lengthOf', numPages + 1);
                    cy.get('.question').should('have.length.greaterThan', numQuestions);
                    cy.get('[type="button"][ng-click="vm.saveQuestionnaire()"]').click({force: true})
                })
            });
        },
        copyQuestion() {
            let numPages = 0;
            let numQuestions = 0;
            cy.get('.builder-page').then(pages => {
                numPages = pages.length;
                expect(numPages).to.be.greaterThan(0);
                cy.get('.question').then(questions => {
                    numQuestions = questions.length;
                    cy.get('.question').first().click({force: true});
                    cy.get('[uib-tooltip="Copy Question"]').click();
                    cy.get('#questionnaire-builder-wrapper').click({force: true})
                    cy.get('.question').should('have.lengthOf', numQuestions + 1);
                    cy.get('.builder-page').should('have.lengthOf', numPages);
                    cy.get('[type="button"][ng-click="vm.saveQuestionnaire()"]').click({force: true})
                })
            });

        },
        pageBreak() {
            let numPages = 0;
            let numQuestions = 0;
            cy.get('.builder-page').then(pages => {
                numPages = pages.length;
                expect(numPages).to.be.greaterThan(0);
                cy.get('.question').then(questions => {
                    numQuestions = questions.length
                    expect(numQuestions).to.be.greaterThan(0);
                    cy.get('.question').last().click({force: true});
                    cy.get('[ng-click="vm.pageBreak(question)"]').click();
                    cy.get('#questionnaire-builder-wrapper').click({force: true})
                    cy.get('.builder-page').should('have.lengthOf', numPages + 1);
                    cy.get('.question').should('have.lengthOf', numQuestions);
                })
            });
        },
        deleteQuestion() {
            let numQuestions = 0;
            cy.get('.question').then(questions => {
                numQuestions = questions.length
                expect(numQuestions).to.be.greaterThan(0);
                cy.get('.question').last().click({force: true});
                cy.get('[uib-tooltip="Delete Question"]').click({force: true})
                cy.get('.fa-trash-o').click({force: true, multiple: true});
                cy.get('.btn-danger').click({force: true, multiple: true});
                cy.get('#questionnaire-builder-wrapper').click({force: true})
                cy.get('.question').should('have.length.of.lessThan', numQuestions);
            })
        },
        bumpPage() {

        },
        movePage() {

        },
        bumpQuestion() {

        },
        moveQuestion() {

        }
    }

}

context('Redjade', ()=>{
    describe('login and do stuff with redjade', ()=>{
        beforeEach(()=>{
            cy.visit(base_url);
        });
        it('goes to the projects page and creates a project', ()=>{
            actions.login();
            actions.createProjectIfEmpty();
            actions.navigateToTestSurvey();
            actions.page.addBasicQuestions();
            actions.page.pageBreak();
            actions.page.breakAll();
            actions.page.mergeAll();
            actions.page.copyQuestion();
            actions.page.copyPage();
            actions.page.deleteQuestion();
            actions.page.deleteAll();
        })
    })
})
