const expect = require('chai').expect;
const request = require('supertest');
const {app} = require('../server');

describe('GET /',() => {
    it('Welcome!', (done) => {
        request(app)
            .get('/')
            .expect((res) => {
                expect(res.text).to.equal("Welcome to Twitter Clone API");
            })
            .end(done);
    })
})

describe('POST /users', () => {
    it('Register User!', (done) => {
        request(app)
            .post('/users')
            .send({
                "name" : "Shravan Adiyodi",
                "username" : "fxshravan",
                "password" : "shravan1234",
                "email" : "shravanadiyodi40@gmail.com"
            })
            .expect((res) => {
                expect(res.text).to.equal("User Shravan Adiyodi added succesfully!");
            })
            .end(done);
    })
});

describe('POST /users', () => {
    it('User Already Present!', (done) => {
        request(app)
            .post('/users')
            .send({
                "name" : "Shravan Adiyodi",
                "username" : "fxshravan",
                "password" : "shravan1234",
                "email" : "shravanadiyodi40@gmail.com"
            })
            .expect((res) => {
                expect(res.text).to.equal("fxshravan already exists!!");
            })
            .end(done);
    })
});

describe('POST /users', () => {
    it('Fill All Fields!', (done) => {
        request(app)
            .post('/users')
            .send({
                "name" : "Shravan Adiyodi",
                "username" : "fxshravan",
                "password" : "shravan1234",
                "email" : ""
            })
            .expect((res) => {
                expect(res.text).to.equal("Please fill all Fields");
            })
            .end(done);
    })
});

describe('GET /users', () => {
    it('Password Wrong!', (done) => {
        request(app)
            .get('/users')
            .send({
                "username" : "fxshravan",
                "password" : "shravan12345"
            })
            .expect((res) => {
                expect(res.text).to.equal("Password Wrong");
            })
            .end(done);
    })
});

describe('GET /users', () => {
    it('Login User!', (done) => {
        request(app)
            .get('/users')
            .send({
                "username" : "fxshravan",
                "password" : "shravan1234"
            })
            .expect((res) => {
                expect(res.text).to.equal("fxshravan found in database!");
            })
            .end(done);
    })
});

describe('GET /logout', () => {
    it('Logout User!', (done) => {
        request(app)
            .get('/logout')
            .expect((res) => {
                expect(res.text).to.equal("Logged Out!");
            })
            .end(done);
    })
});





