var should = require('should'),
    assert = require('assert'),
    request = require('supertest'),
    mongoose = require('mongoose'),
    async = require('async'),
    User = require('../model/user');

describe('RESTful API Test', function () {

    var apiUrl = 'http://localhost:3000';
    var app = undefined;
    var token = '';

    describe('User', function () {

        before(function (done) {
            app = require('../index.js');
            request(apiUrl)
                .post('/api/register')
                .send({
                    name: 'Integration Test User',
                    email: 'integrationtest@gmail.com',
                    password: '12345'
                })
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    if (res.body.success) {
                        request(apiUrl)
                            .post('/api/login')
                            .send({
                                email: 'integrationtest@gmail.com',
                                password: '12345'
                            })
                            .end(function (err, res) {
                                if (err) {
                                    throw err;
                                }
                                if (res.body.success) {
                                    token = 'Bearer ' + res.body.data;
                                    done();
                                } else {
                                    throw res.body.data;
                                }
                            });
                    } else {
                        throw res.body.data;
                    }
                });
        });

        beforeEach(function (done) {
            User.remove({email: {'$ne': 'integrationtest@gmail.com'}}, function (err) {
                if (err) {
                    console.error('Error occurred while cleaning up user collection');
                }
                done();
            });
        });

        after(function (done) {
            User.remove({email: 'integrationtest@gmail.com'}, function (err) {
                if (err) {
                    console.error('Error occurred while removing integration test user');
                }
                done();
            });
        });

        it('should save new user', function (done) {
            console.log('First Test: ' + token);

            var user = {
                "name": "John Doe",
                "email": "johndoe@gmail.com",
                "password": "12345"
            };

            request(apiUrl)
                .post('/api/users')
                .set('Authorization', token)
                .send(user)
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    res.body.success.should.equal(true);
                    done();
                });
        });

        it('should save throw error on duplicate email', function (done) {
            var user = {
                "name": "John Duplicate",
                "email": "johnduplicate@gmail.com",
                "password": "12345"
            };

            request(apiUrl)
                .post('/api/users')
                .set('Authorization', token)
                .send(user)
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    request(apiUrl)
                        .post('/api/users')
                        .set('Authorization', token)
                        .send(user)
                        .end(function (err, res) {
                            res.body.success.should.equal(false);
                            done();
                        });
                });
        });

        it('should list users', function (done) {
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
                function (callback) {
                    request(apiUrl)
                        .post('/api/users')
                        .set('Authorization', token)
                        .send(user1)
                        .end(callback);
                },

                function (callback) {
                    request(apiUrl)
                        .post('/api/users')
                        .set('Authorization', token)
                        .send(user2)
                        .end(callback);
                }
            ], function (err, results) {
                request(apiUrl)
                    .get('/api/users')
                    .set('Authorization', token)
                    .end(function (err, res) {
                        res.body.success.should.equal(true);
                        res.body.data[0].name.should.equal('user2');
                        res.body.data[0].email.should.equal('user2@gmail.com');
                        res.body.data[0].password.should.equal('pass2');
                        res.body.data[1].name.should.equal('user1');
                        res.body.data[1].email.should.equal('user1@gmail.com');
                        res.body.data[1].password.should.equal('pass1');
                        done();
                    });
            });
        });

        it('should update user', function (done) {
            var user = {
                "name": "huseyin",
                "email": "huseyin@gmail.com",
                "password": "pass1"
            };

            var updatedUser = {
                "name": "huseyin_updated",
                "email": "huseyin_updated@gmail.com",
                "password": "pass1_updated"
            };

            request(apiUrl)
                .post('/api/users')
                .set('Authorization', token)
                .send(user)
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    var userId = res.body.data._id;
                    console.log('User: ', userId);
                    request(apiUrl)
                        .put('/api/users/' + userId)
                        .set('Authorization', token)
                        .send(updatedUser)
                        .end(function (err, res) {
                            if (err) {
                                throw err;
                            }
                            res.body.success.should.equal(true);
                            request(apiUrl)
                                .get('/api/users/' + userId)
                                .set('Authorization', token)
                                .end(function (err, res) {
                                    if (err) {
                                        throw err;
                                    }

                                    res.body.success.should.equal(true);
                                    res.body.data.name.should.equal('huseyin_updated');
                                    res.body.data.email.should.equal('huseyin_updated@gmail.com');
                                    res.body.data.password.should.equal('pass1_updated');
                                    done();
                                });
                        })
                });
        });

        it('should delete user', function (done) {
            var user = {
                "name": "huseyin",
                "email": "huseyin@gmail.com",
                "password": "pass"
            };

            request(apiUrl)
                .post('/api/users')
                .set('Authorization', token)
                .send(user)
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    var userId = res.body.data._id;

                    request(apiUrl)
                        .delete('/api/users/' + userId)
                        .set('Authorization', token)
                        .end(function (err, res) {
                            if (err) {
                                throw err;
                            }

                            res.body.success.should.equal(true);

                            request(apiUrl)
                                .get('/api/users/' + userId)
                                .set('Authorization', token)
                                .end(function (err, res) {
                                    if (err) {
                                        throw err;
                                    }

                                    res.status.should.equal(404);
                                    done();
                                });
                        })
                });
        });
    });
});