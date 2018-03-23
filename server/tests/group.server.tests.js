process.env.NODE_ENV = 'test';
let server = require('../../server');

let Group = require('../models/group.server.model');
let User = require('../models/user.server.model');
let Conversation = require('../models/conversation.server.model');

var Mongoose = require("mongoose").Mongoose;
var mongoose = new Mongoose();
var ObjectId = mongoose.Types.ObjectId;
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

let conversation = new Conversation({
    users: [ user ]
})

before( function(done){

    user.save(function (err) { done(err) })
})

before( function(done){

    conversation.save(function (err) { done(err) })
})


describe('\nGroup tests-----------------------------------------------------------------------\n', () => {


    beforeEach((done) => { 
        Group.remove({}, (err) => { 
           done();         
        });     
    });


    // Test the /GET route


    describe('/GET all groups', () => {
        it('it should GET all the groups', (done) => {
          chai.request(server)
              .get('/api/groups')
              .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('array');
                  res.body.length.should.be.eql(0);
                done();
              });
        });
    });


    // Test the /POST route


    describe('/POST/group', () => {


        it('it should not POST a group without any members', (done) => {

            
            let group = new Group({
                name: "group name",
                members: [],
                conversation: conversation
            })

            chai.request(server)
                .post( '/api/groups' )
                .send( group )
                .end((err, res) => {

                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');

                    done();
                });
        });


        it('it should not POST a group without a name', (done) => {

            
            let group = new Group({
                members: [ user ],
                conversation: conversation
            })

            chai.request(server)
                .post( '/api/groups' )
                .send( group )
                .end((err, res) => {

                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');

                  done();
                });
        });


        it('it should not POST a group without a conversation', (done) => {

            
            let group = new Group({
                name: "group name",
                members: [ user ]
            })

            chai.request(server)
                .post( '/api/groups' )
                .send( group )
                .end((err, res) => {

                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                  done();
                });
        });


        it('it should POST an group ', (done) => {
            
            let group = new Group({
                name: "group name",
                members: [ user ],
                conversation: conversation
            })

            chai.request(server)
                .post('/api/groups')
                .send(group) 
                .end((err, res) => {

                    res.should.have.status(201);
                    res.body.group.should.be.a('object');  
                    res.body.group.should.have.property('name');
                    res.body.group.should.have.property('members');
                    res.body.group.should.have.property('conversation');
                    res.body.should.have.property('message').eql('Group successfully added!');

                    done();
                });
        });

    });




    // Test the /GET/:id route

    describe('/GET/group/:id', () => {

        it('it should GET an group by the given id', (done) => {
            
            let group = new Group({
                name: "group name",
                members: [ user ],
                conversation: conversation
            })

            group.save((err, group) => {
                chai.request(server)
                .get('/api/groups/' + group._id)
                .send(group)
                .end((err, res) => {

                    res.should.have.status(200);
                    res.body.should.be.a('object');  
                    res.body.should.have.property('created');
                    res.body.should.have.property('conversation');
                    res.body.should.have.property('name');
                    res.body.should.have.property('members');
                    res.body.should.have.property('_id').eql(group.id);
                  done();
                });
            });
        });


    });



    // Test the /PUT/:id route

    describe('/PUT/group/:id', () => {

        it('it should UPDATE an group given the id', (done) => {

            let group = new Group({
                name: "group name",
                members: [ user ],
                conversation: conversation
            })

            group.save((err, group) => {

                    chai.request(server)
                    .put('/api/groups/' + group._id)
                    .send({ members: [ user, user ] })
                    .end((err, res) => {

                        res.should.have.status(200);
                        res.body.should.be.a('object');

                        res.body.should.have.property('message').eql('Group updated!');
                        res.body.group.should.have.property('members').length(2);

                        done();
                    });
              });
        });

    });



    //get groups for user

    

});

after( function(done){

    Conversation.remove({}, (err) => {
        done()
    })

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