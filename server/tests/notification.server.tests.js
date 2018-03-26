process.env.NODE_ENV = 'test';
let server = require('../../server');

let Notification = require('../models/notification.server.model');
let User = require('../models/user.server.model');
let Location = require('../models/location.server.model');


var Mongoose = require("mongoose").Mongoose;
var mongoose = new Mongoose();
var ObjectId = mongoose.Types.ObjectId;
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
chai.use(chaiHttp);


describe('\nNotification tests-----------------------------------------------------------------------\n', () => {

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
        Notification.remove({}, (err) => { 
           done();         
        });     
    });


    // Test the /POST route


    describe('/POST/notification', () => {


        it('it should not POST a notification without a user', (done) => {

            
            let notification = new Notification({
                message: "something",
                link: "/some/link"
            })

            chai.request(server)
                .post( '/api/notifications' )
                .send( notification )
                .end((err, res) => {

                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    done();
                });
        });

        it('it should not POST a notification without a message', (done) => {

            
            let notification = new Notification({
                user: user,
                link: "/some/link"
            })

            chai.request(server)
                .post( '/api/notifications' )
                .send( notification )
                .end((err, res) => {

                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    done();
                });
        });

        it('it should not POST a notification with message length > 100', (done) => {

            
            let notification = new Notification({
                user: user,
                link: "/some/link",
                message: "123451234512345123451234512345123451234512345123451234512345123451234512345123451234512345123451234512345123451234512345"
            })

            chai.request(server)
                .post( '/api/notifications' )
                .send( notification )
                .end((err, res) => {

                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    done();
                });
        });

        it('it should not POST a notification with message length < 5', (done) => {

            
            let notification = new Notification({
                user: user,
                link: "/some/link",
                message: "1234"
            })

            chai.request(server)
                .post( '/api/notifications' )
                .send( notification )
                .end((err, res) => {

                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    done();
                });
        });

        it('it should not POST a notification with a message containing illegal characters', (done) => {

            
            let notification = new Notification({
                user: user,
                link: "/some/link",
                message: "{W:EF{WE}:"
            })

            chai.request(server)
                .post( '/api/notifications' )
                .send( notification )
                .end((err, res) => {

                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    done();
                });
        });

        it('it should not POST a notification without a link', (done) => {

            
            let notification = new Notification({
                user: user,
                message: "something"
            })

            chai.request(server)
                .post( '/api/notifications' )
                .send( notification )
                .end((err, res) => {

                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    done();
                });
        });


        it('it should POST a notification ', (done) => {
            
            let notification = new Notification({
                user: user,
                message: "something",
                link: "/some/link"
            })

            chai.request(server)
                .post('/api/notifications')
                .send(notification) 
                .end((err, res) => {

                    res.should.have.status(201);
                    res.body.notification.should.be.a('object');  
                    res.body.notification.should.have.property('user');
                    res.body.notification.should.have.property('message');
                    res.body.notification.should.have.property('link');
                    res.body.should.have.property('message').eql('Notification successfully added!');

                    done();
                });
        });

    });



    // Test the /GET route

    describe('/GET all notifications for the logged in user', () => {
        it('it should GET all notification for the logged in user', (done) => {
          chai.request(server)
              .get('/api/notifications')
              .end((err, res) => {
                  res.should.have.status(200);
                  res.body.notifications.should.be.a('array');
                  res.body.notifications.length.should.be.eql(0);
                done();
              });
        });
    });

});

after( function(done){

    Notification.remove({}, (err) => {
        done()
    })

});

after( function(done){

    User.remove({}, (err) => {
        done()
    })

});