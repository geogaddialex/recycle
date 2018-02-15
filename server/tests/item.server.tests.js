//During the test the env variable is set to test
process.env.NODE_ENV = 'test';
let server = require('../../server');
let Item = require('../models/item.server.model');

let mongoose = require("mongoose");
let Mockgoose = require('mockgoose').Mockgoose;
let mockgoose = new Mockgoose(mongoose);
var ObjectId = require('mongoose').Types.ObjectId;

let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
chai.use(chaiHttp); 

//Our parent block
describe('Items', () => {

    //Before each test we empty the database
    beforeEach((done) => { 
        Item.remove({}, (err) => { 
           done();         
        });     
    });

/*
* Test the /GET route
*/

    //should get empty array
    describe('/GET all items', () => {
        it('it should GET all the items', (done) => {
          chai.request(server)
              .get('/api/items')
              .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('array');
                  res.body.length.should.be.eql(0);
                done();
              });
        });
    });


/*
* Test the /POST route
*/
    describe('/POST item', () => {


        it('it should not POST an item without a name', (done) => {
            
            let item = {
                owner: "41224d776a326fb40f000001",
            }

            chai.request(server)
                .post( '/api/items' )
                .send( item )
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('name');
                    res.body.errors.name.should.have.property('kind').eql('required');
                  done();
                });
        });

        it('it should POST an item ', (done) => {

            let item = {
                owner: "41224d776a326fb40f000001",
                name: "Some item name"
            }

            chai.request(server)
                .post('/api/items')
                .send(item)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.item.should.be.a('object');  
                    res.body.item.should.have.property('name');
                    res.body.should.have.property('message').eql('Item successfully added!');
                  done();
                });
        });
    });



/*
* Test the /GET/:id route
*/
    describe('/GET/:id item', () => {

        it('it should GET an item by the given id', (done) => {

            let item = new Item({
                owner: "41224d776a326fb40f000001",
                name: "Some item name"
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


/*
* Test the /PUT/:id route
*/
    describe('/PUT/:id item', () => {

        it('it should UPDATE an item given the id', (done) => {

            let item = new Item({
                owner: "41224d776a326fb40f000001",
                name: "Some item name"
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


/*
* Test the /DELETE/:id route
*/
    describe('/DELETE/:id item', () => {

        it('it should DELETE an item given the id', (done) => {

            let item = new Item({
                owner: ObjectId("41224d776a326fb40f000001"),
                name: "Some item name"
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



});