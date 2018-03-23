process.env.NODE_ENV = 'test';
let server = require('../../server');
let Item = require('../models/item.server.model');
let User = require('../models/user.server.model');

let mongoose = require("mongoose");
let Mockgoose = require('mockgoose').Mockgoose;
let mockgoose = new Mockgoose(mongoose);
var ObjectId = require('mongoose').Types.ObjectId;

let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
chai.use(chaiHttp); 

let user = new User({
    local:{
        name: "Alex",
        email: "hello@alex.com",
        password:"eiorhfjeuor"
    }
})

before( function(done){

    user.save(function (err) { done(err) })
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

                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.name.should.have.property('kind').eql('required');
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

                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.condition.should.have.property('kind').eql('required');
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

                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.condition.should.have.property('kind').eql('required');
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

                    console.log(JSON.stringify(res.body,null,2))
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


    describe('/GET/items/forUser/:id', () => {

        it('it should GET all items owned by the specified user', (done) => {

            let item = new Item({
                owner: user,
                name: "Some item name",
                condition: "New"
            })

            item.save((err, item) => {
                chai.request(server)
                .get('/api/items/forUser/' + user._id)
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



});