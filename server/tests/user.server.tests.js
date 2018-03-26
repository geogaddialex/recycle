process.env.NODE_ENV = 'test';
let server = require('../../server');
let User = require('../models/user.server.model');
let Location = require('../models/location.server.model');

let mongoose = require("mongoose");
let Mockgoose = require('mockgoose').Mockgoose;
let mockgoose = new Mockgoose(mongoose);
var ObjectId = require('mongoose').Types.ObjectId;

let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
chai.use(chaiHttp); 

describe('\nUser tests-----------------------------------------------------------------------\n', () => {

    let location = new Location({

            name: "france",
            country: "UK",
            lat: "0.1",
            long: "1.4"
    })

    beforeEach((done) => { 
        User.remove({}, (err) => { 
           done();         
        });     
    });

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


    describe('/POST/user', () => {


        it('it should not POST a user without a name', (done) => {

            
            let user = {
                email: "eirfhr@ijege.com",
                password: "qwe123QWE!@£",
                location: location
            }

            chai.request(server)
                .post( '/api/auth/register' )
                .send( user )
                .end((err, res) => {

                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    done();
                });
        });


        it('it should not POST a user without an email', (done) => {

            
            let user = {
                password: "qwe123QWE!@£",
                name: "tag",
                location: location
            }

            chai.request(server)
                .post( '/api/auth/register' )
                .send( user )
                .end((err, res) => {

                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    done();
                });
        });


        it('it should not POST a user without a password', (done) => {

            
            let user = {
                email: "eirfhr@ijege.com",
                name: "tag",
                location: location
            }

            chai.request(server)
                .post( '/api/auth/register' )
                .send( user )
                .end((err, res) => {

                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    done();
                });
        });


        it('it should not POST a user without a location', (done) => {

            
            let user = {
                email: "eirfhr@ijege.com",
                password: "qwe123QWE!@£",
                name: "tag",
            }

            chai.request(server)
                .post( '/api/auth/register' )
                .send( user )
                .end((err, res) => {

                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    done();
                });
        });

        it('it should not POST a user with name containing illegal characters', (done) => {

            
            let user = {
                email: "eirfhr@ijege.com",
                password: "qwe123QWE!@£",
                name: "alex{}}_{",
                location: location
            }

            chai.request(server)
                .post( '/api/auth/register' )
                .send( user )
                .end((err, res) => {

                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    done();
                });
        });

        it('it should not POST a user with a weak password', (done) => {

            
            let user = {
                email: "eirfhr@ijege.com",
                password: "123",
                name: "alex",
                location: location
            }

            chai.request(server)
                .post( '/api/auth/register' )
                .send( user )
                .end((err, res) => {

                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    done();
                });
        });


        it('it should POST a user ', (done) => {
            
            let user = {
                email: "eirfhr@ijege.com",
                password: "qwe123QWE!@£",
                name: "tag",
                location: location
            }

            chai.request(server)
                .post( '/api/auth/register' )
                .send(user) 
                .end((err, res) => {

                    res.should.have.status(201);
                    res.body.should.be.a('object');  
                    res.body.should.have.property('local');
                    res.body.should.have.property('location');
                    res.body.local.should.have.property('name');
                    res.body.local.should.have.property('password');
                    res.body.local.should.have.property('email');

                    done();
                });
        });

    });


    describe('/GET/user/:id', () => {

        it('it should GET a user by the given id', (done) => {

            let user = new User({

                local:{
                    name: "Alex",
                    email: "hello@alex.com",
                    password:"eiorhfjeuor"
                },
                location: location

            })

            user.save((err, user) => {
                chai.request(server)
                .get('/api/users/' + user._id)
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');  
                    res.body.should.have.property('local');
                    res.body.should.have.property('location');
                    res.body.local.should.have.property('name');
                    res.body.local.should.have.property('email');
                    res.body.local.should.have.property('password');
                    res.body.should.have.property('_id').eql(user.id);
                  done();
                });
            });
        });

    });



    describe('/PUT/user/:id', () => {

        it('it should not UPDATE a user with a name containing illegal characters', (done) => {

            let user = new User({

                local:{
                    name: "Alex",
                    email: "hello@alex.com",
                    password:"eiorhfjeuor"
                },
                location: location

            })

            user.save((err, user) => {

                    chai.request(server)
                    .put('/api/users/' + user._id)
                    .send({local: { name: "}{{}{}" }})
                    .end((err, res) => {

                        res.should.have.status(500);
                        res.body.should.be.a('object');
                        res.body.should.have.property('errors');

                        done();
                    });
              });
        });

        it('it should not UPDATE a user with a name length < 1', (done) => {

            let user = new User({

                local:{
                    name: "Alex",
                    email: "hello@alex.com",
                    password:"eiorhfjeuor"
                },
                location: location

            })

            user.save((err, user) => {

                    chai.request(server)
                    .put('/api/users/' + user._id)
                    .send({ local: { name: "" } })
                    .end((err, res) => {

                        res.should.have.status(500);
                        res.body.should.be.a('object');
                        res.body.should.have.property('errors');

                        done();
                    });
              });
        });

        it('it should not UPDATE a user with a name length > 70', (done) => {

            let user = new User({

                local:{
                    name: "Alex",
                    email: "hello@alex.com",
                    password:"eiorhfjeuor"
                },
                location: location

            })

            user.save((err, user) => {

                    chai.request(server)
                    .put('/api/users/' + user._id)
                    .send({ local: { name: "12345123451234512345123451234512345123451234512345123451234512345123451234512345" } })
                    .end((err, res) => {

                        res.should.have.status(500);
                        res.body.should.be.a('object');
                        res.body.should.have.property('errors');

                        done();
                    });
              });
        });

        it('it should not UPDATE a user with an invalid email', (done) => {

            let user = new User({

                local:{
                    name: "Alex",
                    email: "hello@alex.com",
                    password:"eiorhfjeuor"
                },
                location: location

            })

            user.save((err, user) => {

                    chai.request(server)
                    .put('/api/users/' + user._id)
                    .send({local: { email: "helloalex.com" }})
                    .end((err, res) => {

                        res.should.have.status(500);
                        res.body.should.be.a('object');
                        res.body.should.have.property('errors');

                        done();
                    });
              });
        });

        it('it should not UPDATE a user with an invalid feedback score (> 100)', (done) => {

            let user = new User({

                local:{
                    name: "Alex",
                    email: "hello@alex.com",
                    password:"eiorhfjeuor"
                },
                location: location

            })

            user.save((err, user) => {

                    chai.request(server)
                    .put('/api/users/' + user._id)
                    .send({ feedback: { score: 105 }})
                    .end((err, res) => {

                        res.should.have.status(500);
                        res.body.should.be.a('object');
                        res.body.should.have.property('errors');

                        done();
                    });
              });
        });

        it('it should not UPDATE a user with a max distance < 1', (done) => {

            let user = new User({

                local:{
                    name: "Alex",
                    email: "hello@alex.com",
                    password:"eiorhfjeuor"
                },
                location: location

            })

            user.save((err, user) => {

                    chai.request(server)
                    .put('/api/users/' + user._id)
                    .send({ maxDistance: 0.1 })
                    .end((err, res) => {

                        res.should.have.status(500);
                        res.body.should.be.a('object');
                        res.body.should.have.property('errors');

                        done();
                    });
              });
        });


        it('it should UPDATE a user given the id', (done) => {

            let user = new User({

                local:{
                    name: "Alex",
                    email: "hello@alex.com",
                    password:"eiorhfjeuor"
                },
                location: location

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

after( function(done){

    Location.remove({}, (err) => {
        done()
    })

});