process.env.NODE_ENV = 'test';
let server = require('../../server');

let Exchange = require('../models/exchange.server.model');
let User = require('../models/user.server.model');
let Item = require('../models/item.server.model');
let Notification = require('../models/notification.server.model');
let Tag = require('../models/tag.server.model');
let Conversation = require('../models/conversation.server.model');
let Location = require('../models/location.server.model');


var Mongoose = require("mongoose").Mongoose;
var mongoose = new Mongoose();
var ObjectId = mongoose.Types.ObjectId;
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
chai.use(chaiHttp);

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

let item = new Item({
    name: "myItem",
    owner: user,
    condition: "New"
})

let conversation = new Conversation({
    users: [ user ]
})

before( function(done){

    user.save(function (err) { done(err) })
})

before( function(done){

    item.save(function (err) { done(err) })
})

before( function(done){

    conversation.save(function (err) { done(err) })
})

describe('\nExchange tests-----------------------------------------------------------------------\n', () => {


    beforeEach((done) => { 
        Exchange.remove({}, (err) => { 
           done();         
        });     
    });



    describe('/GET all exchanges', () => {
        it('it should GET all the exchanges', (done) => {
          chai.request(server)
              .get('/api/exchanges')
              .end((err, res) => {
                  res.should.have.status(200);
                  res.body.exchanges.should.be.a('array');
                  res.body.exchanges.length.should.be.eql(0);
                done();
              });
        });
    });



    describe('/POST/exchanges', () => {


        it('it should not POST an exchange without any items', (done) => {

            
            let exchange = new Exchange({
                items: { sender: [], recipient: [] },
                sender: user,
                lastUpdatedBy: user,
                recipient: user,
                conversation: conversation,
                status: "In progress"
            })

            chai.request(server)
                .post( '/api/exchanges' )
                .send( exchange )
                .end((err, res) => {

                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');

                    done();
                });
        });


        it('it should not POST an exchange without a sender', (done) => {

            
            let exchange = new Exchange({
                items: { sender: [item], recipient: [item, item] },
                lastUpdatedBy: user,
                recipient: user,
                conversation: conversation,
                status: "In progress"
            })

            chai.request(server)
                .post( '/api/exchanges' )
                .send( exchange )
                .end((err, res) => {

                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');

                  done();
                });
        });


        it('it should not POST an exchange without a recipient', (done) => {

            
            let exchange = new Exchange({
                items: { sender: [item], recipient: [item, item] },
                sender: user,
                lastUpdatedBy: user,
                conversation: conversation,
                status: "In progress"
            })

            chai.request(server)
                .post( '/api/exchanges' )
                .send( exchange )
                .end((err, res) => {

                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                  done();
                });
        });

        it('it should not POST an exchange without a conversation', (done) => {

            
            let exchange = new Exchange({
                items: { sender: [item], recipient: [item, item] },
                recipient: user,
                sender: user,
                lastUpdatedBy: user,
                status: "In progress"
            })

            chai.request(server)
                .post( '/api/exchanges' )
                .send( exchange )
                .end((err, res) => {

                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                  done();
                });
        });


        it('it should POST an exchange', (done) => {
            
            let exchange = new Exchange({
                items: { sender: [item], recipient: [item, item] },
                sender: user,
                lastUpdatedBy: user,
                recipient: user,
                conversation: conversation,
                status: "In progress"
            })

            chai.request(server)
                .post('/api/exchanges')
                .send(exchange) 
                .end((err, res) => {

                    res.should.have.status(201);
                    res.body.exchange.should.be.a('object');  
                    res.body.exchange.should.have.property('status');
                    res.body.should.have.property('message').eql('Exchange successfully added!');

                    done();
                });
        });

    });




    describe('/GET/exchanges/:id', () => {

        it('it should GET an exchange by the given id', (done) => {
            
            let exchange = new Exchange({
                items: { sender: [item], recipient: [item, item] },
                sender: user,
                lastUpdatedBy: user,
                recipient: user,
                conversation: conversation,
                status: "In progress"
            })

            exchange.save((err, exchange) => {
                chai.request(server)
                .get('/api/exchanges/' + exchange._id)
                .send(exchange)
                .end((err, res) => {

                    res.should.have.status(200);
                    res.body.should.be.a('object');  
                    res.body.should.have.property('created');
                    res.body.should.have.property('_id').eql(exchange.id);
                  done();
                });
            });
        });


    });




    describe('/PUT/exchanges/:id', () => {

        it('it should not UPDATE an exchange with an invalid status', (done) => {

            let exchange = new Exchange({
                items: { sender: [item], recipient: [item, item] },
                sender: user,
                lastUpdatedBy: user,
                recipient: user,
                conversation: conversation,
                status: "In progress"
            })

            exchange.save((err, exchange) => {

                    chai.request(server)
                    .put('/api/exchanges/' + exchange._id)
                    .send({ status: "different" })
                    .end((err, res) => {

                        res.should.have.status(500);
                        res.body.should.be.a('object');
                        res.body.should.have.property('errors');

                        done();
                    });
              });
        });

        it('it should UPDATE an exchange given the id', (done) => {

            let exchange = new Exchange({
                items: { sender: [item], recipient: [item, item] },
                sender: user,
                lastUpdatedBy: user,
                recipient: user,
                conversation: conversation,
                status: "In progress"
            })

            exchange.save((err, exchange) => {

                    chai.request(server)
                    .put('/api/exchanges/' + exchange._id)
                    .send({ status: "Completed" })
                    .end((err, res) => {

                        res.should.have.status(200);
                        res.body.should.be.a('object');

                        res.body.should.have.property('message').eql('Exchange updated!');
                        res.body.exchange.should.have.property('status').eql("Completed");

                        done();
                    });
              });
        });

    });


    describe('/GET/exchanges/forUser/:id', () => {

        it('it should GET all exchanges involving the specified user', (done) => {

            let exchange = new Exchange({
                items: { sender: [item], recipient: [item, item] },
                sender: user,
                lastUpdatedBy: user,
                recipient: user,
                conversation: conversation,
                status: "In progress"
            })

            exchange.save((err, item) => {
                chai.request(server)
                .get('/api/exchanges/forUser/' + user._id)
                .send(item)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.exchanges.should.be.a('array');
                    res.body.exchanges.length.should.be.eql(1);
                    done();
                });
            });
        });



    });

});

after( function(done){

    Item.remove({}, (err) => {
        done()
    })

});

after( function(done){

    User.remove({}, (err) => {
        done()
    })

});

after( function(done){

    Exchange.remove({}, (err) => {
        done()
    })

});

after( function(done){

    Notification.remove({}, (err) => {
        done()
    })

});

after( function(done){

    Tag.remove({}, (err) => {
        done()
    })

});

after( function(done){

    Conversation.remove({}, (err) => {
        done()
    })

});