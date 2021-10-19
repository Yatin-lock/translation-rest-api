const chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
const testCases = require('./tests.cases')

//Assertion Style
chai.should();

chai.use(chaiHttp);

describe('Translations API', () => {
    describe('POST / for incorrect route request', () => {
        testCases["statusCode404"].forEach((test, i) => {
            it(`Test case ${i}`, done => {
                chai.request(server)
                    .post('/translate')
                    .send(test)
                    .end((err, response) => {
                        response.should.have.status(404)
                        done()
                    })
            })
        })
    })
    describe('POST / for correct http request format', () => {
        testCases["statusCode200"].forEach((test, i) => {
            it(`Test case ${i}`, done => {
                chai.request(server)
                    .post('/')
                    .send(test)
                    .end((err, response) => {
                        response.should.have.status(200)
                        response.body.should.be.a('object')
                        response.body.should.have.property('isTranslated').eq(true)
                        done()
                    })
            })
        })
    })
    describe('POST / for incorrect request format', () => {
        testCases["statusCode400"].forEach((test, i) => {
            it(`Test case ${i}`, done => {
                chai.request(server)
                    .post('/')
                    .send(test)
                    .end((err, response) => {
                        response.should.have.status(400);
                        response.body.should.be.a('object')
                        response.body.should.have.property('isTranslated').eq(false)
                        done()
                    })
            })
        })
    })
})