process.env.NODE_ENV = 'test';
let server = require('../../server');

let Location = require('../models/location.server.model');

var Mongoose = require("mongoose").Mongoose;
var mongoose = new Mongoose();
var ObjectId = mongoose.Types.ObjectId;
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
chai.use(chaiHttp);


describe('\nLocation tests-----------------------------------------------------------------------\n', () => {


    describe('/GET all locations', () => {

        it('it should GET all the locations', (done) => {
          chai.request(server)
              .get('/api/locations')
              .end((err, res) => {
                    res.should.have.status(200);
                    res.body.locations.should.be.a('array');
                    res.body.locations.length.should.be.eql(0);
                    done();
              });
        });

    });

});