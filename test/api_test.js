var should = require('should'),
    assert = require('assert'),
    request = require('supertest'),
    mongoose = require('mongoose'),
    async = require('async'),
    User = require('../model/user');

describe('RESTful API Test', function() {

    var apiUrl = 'http://localhost:3000';
    var app = undefined;

    beforeEach(function(done) {
        User.remove({}, function(err){
            if (err) {
                console.error('Error occurred while cleaning up user collection');
            }
            done();
        });
    });

    before(function() {
        app = require('../index.js');
    });

    describe('User', function() {

        it('should save new user', function(done) {
            var user = {
                "name": "John Doe",
                "email": "johndoe@gmail.com",
                "password": "12345"
            };

            request(apiUrl)
                .post('/api/users')
                .send(user)
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.body.success.should.equal(true);
                    done();
                });
        });

        it('should save throw error on duplicate email', function(done) {
            var user = {
                "name": "John Duplicate",
                "email": "johnduplicate@gmail.com",
                "password": "12345"
            };

            request(apiUrl)
                .post('/api/users')
                .send(user)
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    request(apiUrl)
                        .post('/api/users')
                        .send(user)
                        .end(function(err, res) {
                            res.body.success.should.equal(false);
                            done();
                        });
                });
        });

        it('should list users', function(done) {
            var user1 = {
                "name": "user1",
                "email": "user1@gmail.com",
                "password": "pass1"
            };

            var user2 = {
                "name": "user2",
                "email": "user2@gmail.com",
                "password": "pass2"
            };

            async.parallel([
                function(callback) {
                    request(apiUrl)
                        .post('/api/users')
                        .send(user1)
                        .end(callback);
                },

                function(callback) {
                    request(apiUrl)
                        .post('/api/users')
                        .send(user2)
                        .end(callback);
                }
            ], function(err, results) {
                request(apiUrl)
                    .get('/api/users')
                    .end(function(err, res) {
                        res.body.success.should.equal(true);
                        res.body.data[0].name.should.equal('user1');
                        res.body.data[0].email.should.equal('user1@gmail.com');
                        res.body.data[0].password.should.equal('pass1');
                        res.body.data[1].name.should.equal('user2');
                        res.body.data[1].email.should.equal('user2@gmail.com');
                        res.body.data[1].password.should.equal('pass2');
                        done();
                    });
            });
        });
    });
});