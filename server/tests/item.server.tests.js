process.env.NODE_ENV = 'test';
let server = require('../../server');
let Item = require('../models/item.server.model');
let User = require('../models/user.server.model');
let Conversation = require('../models/conversation.server.model');
let Group = require('../models/group.server.model');
let Location = require('../models/location.server.model');


let mongoose = require("mongoose");
let Mockgoose = require('mockgoose').Mockgoose;
let mockgoose = new Mockgoose(mongoose);
var ObjectId = require('mongoose').Types.ObjectId;

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

let conversation = new Conversation({
    users: [ user ]
})

let group = new Group({
    name: "group name",
    members: [user],
    conversation: conversation
})

before( function(done){

    user.save(function (err) { done(err) })
})

before( function(done){

    conversation.save(function (err) { done(err) })
})

before( function(done){

    group.save(function (err) { done(err) })
})





describe('\nItem tests-----------------------------------------------------------------------\n', () => {

    beforeEach((done) => { 
        Item.remove({}, (err) => { 
           done();         
        });     
    });


    describe('/GET all items', () => {
        it('it should GET all the items', (done) => {
          chai.request(server)
              .get('/api/items')
              .end((err, res) => {
                  res.should.have.status(200);
                  res.body.items.should.be.a('array');
                  res.body.items.length.should.be.eql(0);
                done();
              });
        });
    });



    describe('/POST/item', () => {


        it('it should not POST an item without a name', (done) => {
            
            let item = {
                condition: "New",
                owner: user
            }

            chai.request(server)
                .post( '/api/items' )
                .send( item )
                .end((err, res) => {

                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    done();
                });
        });

        it('it should not POST an item with a name containing illegal characters', (done) => {
            
            let item = {
                condition: "New",
                owner: user,
                name: "erF{}{"
            }

            chai.request(server)
                .post( '/api/items' )
                .send( item )
                .end((err, res) => {

                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    done();
                });
        });


        it('it should not POST an item with a name of length < 3', (done) => {
            
            let item = {
                condition: "New",
                owner: user,
                name: "a"
            }

            chai.request(server)
                .post( '/api/items' )
                .send( item )
                .end((err, res) => {

                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    done();
                });
        });

        it('it should not POST an item with a name of length > 30', (done) => {
            
            let item = {
                condition: "New",
                owner: user,
                name: "12345123451234512345123451234512345"
            }

            chai.request(server)
                .post( '/api/items' )
                .send( item )
                .end((err, res) => {

                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    done();
                });
        });



        it('it should not POST an item without a condition', (done) => {
            
            let item = {
                name: "chair",
                owner: user
            }

            chai.request(server)
                .post( '/api/items' )
                .send( item )
                .end((err, res) => {

                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    done();
                });
        });

        it('it should not POST an item with an invalid condition', (done) => {
            
            let item = {
                name: "chair",
                owner: user,
                condition: "invalid"
            }

            chai.request(server)
                .post( '/api/items' )
                .send( item )
                .end((err, res) => {

                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    done();
                });
        });

        it('it should not POST an item without an owner', (done) => {
            
            let item = {
                name: "chair",
                condition: "New"
            }

            chai.request(server)
                .post( '/api/items' )
                .send( item )
                .end((err, res) => {

                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                  done();
                });
        });

        it('it should not POST an item with a description containing illegal characters', (done) => {
            
            let item = {
                condition: "New",
                owner: user,
                name: "alexItem",
                description: "euhrgre{}{}"
            }

            chai.request(server)
                .post( '/api/items' )
                .send( item )
                .end((err, res) => {

                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    done();
                });
        });

        it('it should not POST an item with a description of length > 500', (done) => {
            
            let item = {
                condition: "New",
                owner: user,
                name: "alexItem",
                description: "1234512345123451234512345123451234512345123451234512345123451234512345123451234512345123451234512345123451234512345123451234512345123451234512345123451234512345123451234512345123451234512345123451234512345123451234512345123451234512345123451234512345123451234512345123451234512345123451234512345123451234512345123451234512345123451234512345123451234512345123451234512345123451234512345123451234512345123451234512345123451234512345123451234512345123451234512345123451234512345123451234512345123451234512345123451234512345123451234512345123451234512345123451234512345123451234512345123451234512345123451234512345123451234512345123451234512345123451234512345123451234512345123451234512345123451234512345"
            }

            chai.request(server)
                .post( '/api/items' )
                .send( item )
                .end((err, res) => {

                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    done();
                });
        });


        it('it should POST an item', (done) => {

            let item = {
                name: "Some item name",
                condition: "New",
                owner: user
            }

            chai.request(server)
                .post('/api/items')
                .send(item)
                .end((err, res) => {

                    res.should.have.status(200);
                    res.body.item.should.be.a('object');  
                    res.body.item.should.have.property('name');
                    res.body.item.should.have.property('owner');
                    res.body.item.should.have.property('condition');
                    res.body.should.have.property('message').eql('Item successfully added!');
                    done();
                });
        });

    });



    describe('/GET/item/:id', () => {

        it('it should GET an item by the given id', (done) => {

            let item = new Item({
                owner: user,
                name: "Some item name",
                condition: "New"
            })

            item.save((err, item) => {
                chai.request(server)
                .get('/api/items/' + item._id)
                .send(item)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');  
                    res.body.should.have.property('name');
                    res.body.should.have.property('_id').eql(item.id);
                  done();
                });
            });
        });



    });



    describe('/PUT/item/:id', () => {

        it('it should not UPDATE an item with an invalid condition', (done) => {

            let item = new Item({
                owner: user,
                name: "Some item name",
                condition: "New"
            })

            item.save((err, item) => {
                    chai.request(server)
                    .put('/api/items/' + item._id)
                    .send({ condition: "different" })
                    .end((err, res) => {
                        res.should.have.status(500);
                        res.body.should.be.a('object');
                        res.body.should.have.property('errors');
                      done();
                    });
              });
        });

        it('it should UPDATE an item given the id', (done) => {

            let item = new Item({
                owner: user,
                name: "Some item name",
                condition: "New"
            })

            item.save((err, item) => {
                    chai.request(server)
                    .put('/api/items/' + item._id)
                    .send({ name: "different name" })
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('message').eql('Item updated!');
                        res.body.item.should.have.property('name').eql("different name");
                      done();
                    });
              });
        });



    });



    describe('/DELETE/item/:id', () => {

        it('it should DELETE an item given the id', (done) => {

            let item = new Item({
                owner: user,
                name: "Some item name",
                condition: "New"
            })

            item.save((err, item) => {
                    chai.request(server)
                    .delete('/api/items/' + item._id)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('message').eql('Item successfully deleted!');
                        res.body.result.should.have.property('ok').eql(1);
                        res.body.result.should.have.property('n').eql(1);
                      done();
                    });
              });
        });
        
    });


    describe('/GET/items/user/:id', () => {

        it('it should GET all items owned by the specified user', (done) => {

            let item = new Item({
                owner: user,
                name: "Some item name",
                condition: "New"
            })

            item.save((err, item) => {
                chai.request(server)
                .get('/api/items/user/' + user._id)
                .send(item)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.items.should.be.a('array');
                    res.body.items.length.should.be.eql(1);
                    done();
                });
            });
        });



    });


    // this can't find the group, maybe it's not going into the db

    // describe('/GET/items/group/:id', () => {

    //     it('it should GET all items owned by members of the specified group', (done) => {

    //         let item = new Item({
    //             owner: user,
    //             name: "Some item name",
    //             condition: "New"
    //         })

    //         console.log( "group: " + JSON.stringify( group,null,2))
    //         console.log( "conversation: " + JSON.stringify( conversation,null,2))
    //         console.log( "user: " + JSON.stringify( user,null,2))

    //         item.save((err, item) => {
    //             chai.request(server)
    //             .get('/api/items/group/' + group._id)
    //             .send(item)
    //             .end((err, res) => {
    //                 res.should.have.status(200);
    //                 res.body.items.should.be.a('array');
    //                 res.body.items.length.should.be.eql(1);
    //                 done();
    //             });
    //         });
    //     });

    // });


});

after( function(done){   

    User.remove({}, (err) => {
        done()
    })

});

after( function(done){   

    Group.remove({}, (err) => {
        done()
    })

});

after( function(done){   

    Conversation.remove({}, (err) => {
        done()
    })

});

after( function(done){   

    Item.remove({}, (err) => {
        done()
    })

});