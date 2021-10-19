//Importing dependencies
const chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');

//importing different testcases from the test.cases file
const testCases = require('./tests.cases')

//Assertion Style
chai.should();
chai.use(chaiHttp);
//description of test cases
describe('Translations API', () => {
    //describes the test cases when request to unkown route or path is made
    describe('POST / for incorrect route request', () => {
        testCases["statusCode404"].forEach((test, i) => {
            it(`Test case ${i}`, done => {
                chai.request(server)
                    .post('/translate')
                    .send(test)
                    .end((err, response) => {
                        if(err) throw err
                        response.should.have.status(404)
                        done()
                    })
            })
        })
    })
    //describes the results for correct request to the '/' route
    describe('POST / for correct http request format', () => {
        testCases["statusCode200"].forEach((test, i) => {
            it(`Test case ${i}`, done => {
                chai.request(server)
                    .post('/')
                    .send(test)
                    .end((err, response) => {
                        if(err) throw err
                        response.should.have.status(200)
                        response.body.should.be.a('object')
                        response.body.should.have.property('isTranslated').eq(true)
                        done()
                    })
            })
        })
    })

    //describes the results for incorrect request body format
    describe('POST / for incorrect request format', () => {
        testCases["statusCode400"].forEach((test, i) => {
            it(`Test case ${i}`, done => {
                chai.request(server)
                    .post('/')
                    .send(test)
                    .end((err, response) => {
                        if(err) throw err
                        response.should.have.status(400);
                        response.body.should.be.a('object')
                        response.body.should.have.property('isTranslated').eq(false)
                        done()
                    })
            })
        })
    })
})