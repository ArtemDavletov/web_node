const app = require("../server");
const supertest = require("supertest");
const mongoose = require('mongoose');
const request = supertest(app);

const localhost = 'http://localhost:8001'

beforeAll(async () => {
    await mongoose.connect('mongodb+srv://artem:3558266@cluster0.xnqzf.mongodb.net/weather', {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    })
});

// Testing endpoint /weather
describe('Endpoint /weather', () => {

    it("Testing endpoint /weather 200 by name", (done) => {
        request
            .get({path: localhost + "/weather?q=London"})
            .expect(200)
            .end(function (err, res) {
                done();
            });
    });

    it("Testing endpoint /weather 200 by coords", (done) => {
        request
            .get({path: localhost + "/weather?lat=59.936003295525815&lon=30.237438323552727"})
            .expect(200)
            .end(function (err, res) {
                done();
            });
    });

    it("Testing endpoint /weather 404 by name", (done) => {
        request
            .get({path: localhost + "/weather?q=hjhjk"})
            .expect(404)
            .end(function (err, res) {
                done();
            });
    });

    it("Testing endpoint /weather 404 by coords", (done) => {
        request
            .get({path: localhost + "/weather?lat=jkjg&lon=nkug"})
            .expect(404)
            .end(function (err, res) {
                done();
            });
    });
})

// Testing endpoint /favorites
describe('Endpoint /favorites', () => {
    // GET
    it("Testing GET favorites", (done) => {
        request
            .get({path: localhost + "/favorites"})
            .expect(200)
            .end(function (err, res) {
                done();
            });
    });

    // POST
    it("Testing POST favorites", (done) => {
        request
            .post({path: localhost + "/favorites"})
            .send({
                name: "Moscow"
            })
            .expect(200)
            .end(function (err, res) {
                done();
            });
    });

    it("Testing adding existing favorite city", (done) => {
        request
            .post({path: localhost + "/favorites"})
            .send({
                name: "Moscow"
            });
        request
            .post({path: localhost + "/favorites"})
            .send({
                name: "Moscow"
            })
            .expect(400)
            .end(function (err, res) {
                done();
            });
    });

    //DELETE
    it("Testing DELETE favorites", (done) => {
        request
            .post({path: localhost + "/favorites"})
            .send({
                name: "Moscow"
            });
        request
            .delete({path: localhost + "/favorites"})
            .send({
                name: "Moscow"
            })
            .expect(200)
            .end(function (err, res) {
                done();
            });
    });

    it("Try to delete non exist favorite city", (done) => {
        request
            .delete({path: localhost + "/favorites"})
            .send({
                name: "London"
            })
            .expect(500)
            .end(function (err, res) {
                done();
            });
    });
})