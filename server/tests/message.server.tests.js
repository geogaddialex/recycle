process.env.NODE_ENV = 'test';
let server = require('../../server');

let Message = require('../models/message.server.model');
let User = require('../models/user.server.model');
let Location = require('../models/location.server.model');


var Mongoose = require("mongoose").Mongoose;
var mongoose = new Mongoose();
var ObjectId = mongoose.Types.ObjectId;
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
chai.use(chaiHttp);


describe('\nMessage tests-----------------------------------------------------------------------\n', () => {

    let location = new Location({

            name: "france",
            country: "UK",
            lat: "0.1",
            long: "1.4"
    })

    let user = new User({
        local:{
            name: "Alex",
            email: "hello@alex.com",
            password:"eiorhfjeuor"
        },
        location: location
    })


    beforeEach((done) => { 
        Message.remove({}, (err) => { 
           done();         
        });     
    });


    // Test the /POST route


    describe('/POST/message', () => {


        it('it should not POST a message without a sender', (done) => {

            
            let message = new Message({
                content: "message"
            })

            chai.request(server)
                .post( '/api/messages' )
                .send( message )
                .end((err, res) => {

                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    done();
                });
        });

        it('it should not POST a message without content', (done) => {

            
            let message = new Message({
                sender: user
            })

            chai.request(server)
                .post( '/api/messages' )
                .send( message )
                .end((err, res) => {

                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    done();
                });
        });

        it('it should not POST a message with content containing illegal characters', (done) => {

            
            let message = new Message({
                sender: user,
                content: "%%%^^^*& alex"
            })

            chai.request(server)
                .post( '/api/messages' )
                .send( message )
                .end((err, res) => {

                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    done();
                });
        });

        it('it should not POST a message with content length < 1', (done) => {

            
            let message = new Message({
                sender: user,
                content: ""
            })

            chai.request(server)
                .post( '/api/messages' )
                .send( message )
                .end((err, res) => {

                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    done();
                });
        });

        it('it should not POST a message with content length > 500', (done) => {

            
            let message = new Message({
                sender: user,
                content: "1234512345123451234512345123451234512345123451234512345123451234512345123451234512345123451234512345123451234512345123451234512345123451234512345123451234512345123451234512345123451234512345123451234512345123451234512345123451234512345123451234512345123451234512345123451234512345123451234512345123451234512345123451234512345123451234512345123451234512345123451234512345123451234512345123451234512345123451234512345123451234512345123451234512345123451234512345123451234512345123451234512345123451234512345123451234512345123451234512345123451234512345123451234512345123451234512345123451234512345123451234512345123451234512345123451234512345123451234512345123451234512345123451234512345123451234512345"
            })

            chai.request(server)
                .post( '/api/messages' )
                .send( message )
                .end((err, res) => {

                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    done();
                });
        });

        it('it should POST a message ', (done) => {
            
            let message = new Message({
                content: "message",
                sender: user
            })

            chai.request(server)
                .post('/api/messages')
                .send(message) 
                .end((err, res) => {

                    res.should.have.status(201);
                    res.body.message.should.be.a('object');  
                    res.body.message.should.have.property('content');
                    res.body.message.should.have.property('sender');
                    res.body.should.have.property('successMessage').eql('Message successfully added!');

                    done();
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

    Message.remove({}, (err) => {
        done()
    })

});