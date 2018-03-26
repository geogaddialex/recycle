process.env.NODE_ENV = 'test';
let server = require('../../server');

let Feedback = require('../models/feedback.server.model');
let User = require('../models/user.server.model');
let Location = require('../models/location.server.model');


var Mongoose = require("mongoose").Mongoose;
var mongoose = new Mongoose();
var ObjectId = mongoose.Types.ObjectId;
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
chai.use(chaiHttp);


describe('\nFeedback tests-----------------------------------------------------------------------\n', () => {

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

    before( function(done){

        user.save(function (err) { done(err) })
    })


    beforeEach((done) => { 
        Feedback.remove({}, (err) => { 
           done();         
        });     
    });


    // Test the /POST route


    describe('/POST/feedback', () => {


        it('it should not POST a feedback without an author', (done) => {

            
            let feedback = new Feedback({
                subject: user,
                comment: "yeah",
                rating: 3,
                exchangeHappened: false
            })

            chai.request(server)
                .post( '/api/feedback' )
                .send( feedback )
                .end((err, res) => {

                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    done();
                });
        });

        it('it should not POST a feedback without a subject', (done) => {

            
            let feedback = new Feedback({
                author: user,
                comment: "yeah",
                rating: 3,
                exchangeHappened: false
            })

            chai.request(server)
                .post( '/api/feedback' )
                .send( feedback )
                .end((err, res) => {

                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    done();
                });
        });

        it('it should not POST a feedback without a comment', (done) => {

            
            let feedback = new Feedback({
                author: user,
                subject: user,
                rating: 3,
                exchangeHappened: false
            })

            chai.request(server)
                .post( '/api/feedback' )
                .send( feedback )
                .end((err, res) => {

                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    done();
                });
        });

        it('it should not POST a feedback with a comment of length > 140', (done) => {

            
            let feedback = new Feedback({
                author: user,
                subject: user,
                rating: 3,
                exchangeHappened: false,
                comment: "12345123451234512345123451234512345123451234512345123451234512345123451234512345123451234512345123451234512345123451234512345123451234512345123451234512345123451234512345123451234512345123451234512345"
            })

            chai.request(server)
                .post( '/api/feedback' )
                .send( feedback )
                .end((err, res) => {

                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    done();
                });
        });

        it('it should not POST a feedback with a comment of length < 1', (done) => {

            
            let feedback = new Feedback({
                author: user,
                subject: user,
                rating: 3,
                exchangeHappened: false,
                comment: ""
            })

            chai.request(server)
                .post( '/api/feedback' )
                .send( feedback )
                .end((err, res) => {

                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    done();
                });
        });

        it('it should not POST a feedback with an illegal comment', (done) => {

            
            let feedback = new Feedback({
                author: user,
                subject: user,
                rating: 3,
                exchangeHappened: false,
                comment: "+++==()"
            })

            chai.request(server)
                .post( '/api/feedback' )
                .send( feedback )
                .end((err, res) => {

                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    done();
                });
        });

        it('it should not POST a feedback without a rating', (done) => {

            
            let feedback = new Feedback({
                author: user,
                subject: user,
                comment: "yeah",
                exchangeHappened: false
            })

            chai.request(server)
                .post( '/api/feedback' )
                .send( feedback )
                .end((err, res) => {

                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    done();
                });
        });

        it('it should not POST a feedback without an exchangeHappened boolean', (done) => {

            
            let feedback = new Feedback({
                author: user,
                subject: user,
                comment: "yeah",
                rating: 3
            })

            chai.request(server)
                .post( '/api/feedback' )
                .send( feedback )
                .end((err, res) => {

                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    done();
                });
        });


        it('it should POST a feedback ', (done) => {
            
            let feedback = new Feedback({
                author: user,
                subject: user,
                comment: "yeah",
                rating: 3,
                exchangeHappened: false
            })

            chai.request(server)
                .post('/api/feedback')
                .send(feedback) 
                .end((err, res) => {

                    res.should.have.status(201);
                    res.body.feedback.should.be.a('object');  
                    res.body.feedback.should.have.property('author');
                    res.body.feedback.should.have.property('subject');
                    res.body.feedback.should.have.property('comment');
                    res.body.feedback.should.have.property('rating');
                    res.body.feedback.should.have.property('exchangeHappened');
                    res.body.should.have.property('message').eql('Feedback successfully added!');

                    done();
                });
        });

    });



    // Test the /GET/:id route

    describe('/GET/feedback/forUser/:id', () => {

        it('it should GET all feedback for the specified user', (done) => {
            
            let feedback = new Feedback({
                author: user,
                subject: user,
                comment: "yeah",
                rating: 3,
                exchangeHappened: false
            })

            feedback.save((err, feedback) => {
                chai.request(server)
                .get('/api/feedback/forUser/' + user._id)
                .send(feedback)
                .end((err, res) => {

                    res.should.have.status(200);
                    res.body.feedback.should.be.a('array');
                    res.body.feedback.length.should.be.eql(1);
                    done();
                });
            });
        });


    });


});

after( function(done){

    Feedback.remove({}, (err) => {
        done()
    })

});

after( function(done){

    User.remove({}, (err) => {
        done()
    })

});