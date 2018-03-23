process.env.NODE_ENV = 'test';
let server = require('../../server');
let User = require('../models/user.server.model');

let mongoose = require("mongoose");
let Mockgoose = require('mockgoose').Mockgoose;
let mockgoose = new Mockgoose(mongoose);
var ObjectId = require('mongoose').Types.ObjectId;

let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
chai.use(chaiHttp); 

describe('\nUser tests-----------------------------------------------------------------------\n', () => {

    beforeEach((done) => { 
        User.remove({}, (err) => { 
           done();         
        });     
    });

/*
* Test the /GET route
*/

    //should get empty array
    describe('/GET all users', () => {
        it('it should GET all the users', (done) => {
          chai.request(server)
              .get('/api/users')
              .end((err, res) => {
                  res.should.have.status(200);
                  res.body.users.should.be.a('array');
                  res.body.users.length.should.be.eql(0);
                done();
              });
        });
    });


/*
* Test the /GET/:id route
*/
    describe('/GET/:id user', () => {

        it('it should GET a user by the given id', (done) => {

            let user = new User({

                local:{
                    name: "Alex",
                    email: "hello@alex.com",
                    password:"eiorhfjeuor"
                }

            })

            user.save((err, user) => {
                chai.request(server)
                .get('/api/users/' + user._id)
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');  
                    res.body.local.should.have.property('name');
                    res.body.should.have.property('_id').eql(user.id);
                  done();
                });
            });
        });

    });


/*
* Test the /PUT/:id route
*/
    describe('/PUT/:id user', () => {

        it('it should UPDATE a user given the id', (done) => {

            let user = new User({

                local:{
                    name: "Alex",
                    email: "hello@alex.com",
                    password:"eiorhfjeuor"
                }

            })

            user.save((err, user) => {
                    chai.request(server)
                    .put('/api/users/' + user._id)
                    .send({ maxDistance: 40 })
                    .end((err, res) => {

                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('message').eql('User updated!');
                        res.body.user.should.have.property('maxDistance').eql( 40 );
                      done();
                    });
              });
        });

    });


});


after( function(done){

    User.remove({}, (err) => {
        done()
    })

});