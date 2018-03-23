process.env.NODE_ENV = 'test';
let server = require('../../server');

let Tag = require('../models/tag.server.model');

var Mongoose = require("mongoose").Mongoose;
var mongoose = new Mongoose();
var ObjectId = mongoose.Types.ObjectId;
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
chai.use(chaiHttp);


describe('\nTag tests-----------------------------------------------------------------------\n', () => {


    beforeEach((done) => { 
        Tag.remove({}, (err) => { 
           done();         
        });     
    });


    // Test the /GET route


    describe('/GET all tags', () => {
        it('it should GET all the tags', (done) => {
          chai.request(server)
              .get('/api/tags')
              .end((err, res) => {
                    res.should.have.status(200);
                    res.body.tags.should.be.a('array');
                    res.body.tags.length.should.be.eql(0);
                    done();
              });
        });
    });


    // Test the /POST route


    describe('/POST/tag', () => {


        it('it should not POST a tag without a name', (done) => {

            
            let tag = {
            }

            chai.request(server)
                .post( '/api/tags' )
                .send( tag )
                .end((err, res) => {

                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    done();
                });
        });


        it('it should POST a tag ', (done) => {
            
            let tag = new Tag({
                name: "tag"
            })

            chai.request(server)
                .post('/api/tags')
                .send(tag) 
                .end((err, res) => {

                    res.should.have.status(201);
                    res.body.tag.should.be.a('object');  
                    res.body.tag.should.have.property('name');
                    res.body.should.have.property('message').eql('Tag successfully added!');

                    done();
                });
        });

    });




    // Test the /GET/:id route

    describe('/GET/tag/:id', () => {

        it('it should GET a tag with the given name', (done) => {
            
            let tag = new Tag({
                name: "tag"
            })

            tag.save((err, tag) => {
                chai.request(server)
                .get('/api/tags/' + tag.name)
                .send(tag)
                .end((err, res) => {

                    res.should.have.status(200);
                    res.body.should.be.a('object');  
                    res.body.should.have.property('name');
                    res.body.should.have.property('_id').eql(tag.id);
                    done();
                });
            });
        });


    });


});

after( function(done){

    Tag.remove({}, (err) => {
        done()
    })

});