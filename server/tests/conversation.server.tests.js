process.env.NODE_ENV = 'test';
let server = require('../../server');

let Conversation = require('../models/conversation.server.model');
let User = require('../models/user.server.model');
let Message = require('../models/message.server.model');

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

let message = new Message({
    content: "message",
    sender: user,
})

before( function(done){

    user.save(function (err) { done(err) })
})

before( function(done){

    message.save(function (err) { done(err) })
})


describe('\nConversation tests-----------------------------------------------------------------------\n', () => {


    beforeEach((done) => { 
        Conversation.remove({}, (err) => { 
           done();         
        });     
    });


    // Test the /POST route


    describe('/POST/conversation', () => {


        it('it should POST a conversation ', (done) => {
            
            let conversation = {
                messages: [ message ]
            }

            chai.request(server)
                .post('/api/conversations')
                .send(conversation) 
                .end((err, res) => {

                    res.should.have.status(201);
                    res.body.conversation.should.be.a('object');  
                    res.body.conversation.should.have.property('messages');
                    res.body.should.have.property('message').eql('Conversation successfully added!');

                    done();
                });
        });

    });




    // Test the /GET/:id route

    describe('/GET/conversation/:id', () => {

        it('it should GET a conversation by the given id', (done) => {
            
            let conversation = new Conversation({
                messages: [ message ]
            })

            conversation.save((err, conversation) => {
                chai.request(server)
                .get('/api/conversations/' + conversation._id)
                .send(conversation)
                .end((err, res) => {

                    res.should.have.status(200);
                    res.body.should.be.a('object');  
                    res.body.should.have.property('_id').eql(conversation.id);
                  done();
                });
            });
        });


    });



    // Test the /PUT/:id route

    describe('/PUT/conversation/:id', () => {

        it('it should UPDATE an conversation given the id', (done) => {

            let conversation = new Conversation({
                messages: [ message ]
            })

            conversation.save((err, conversation) => {

                    chai.request(server)
                    .put('/api/conversations/' + conversation._id)
                    .send({  messages: [ message, message ] })
                    .end((err, res) => {

                        res.should.have.status(200);
                        res.body.should.be.a('object');

                        res.body.should.have.property('message').eql('Conversation updated!');
                        res.body.conversation.should.have.property('messages').length(2);

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

    Conversation.remove({}, (err) => {
        done()
    })

});

after( function(done){

    Message.remove({}, (err) => {
        done()
    })

});