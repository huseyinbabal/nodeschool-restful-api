var mongoose = require('mongoose'),
    User = mongoose.model('User');

exports.save = function(req, res) {
    var userModel = new User(req.body);
    userModel.save(function(err, user) {
        if (err) {
            console.error('Error occurred while saving user: ', err);
            res.json({
                success: false,
                data: 'Error occurred while saving user'
            })
        } else {
            res.json({
                success: true,
                data: user
            });
        }
    });
};

exports.list = function(req, res) {
    User.find({}, function(err, users) {
        if (err) {
            console.error('Error occurred while listing users: ', err);
            res.json({
                success: false,
                data: 'Error occurred while listing users'
            })
        } else {
            res.json({
                success: true,
                data: users
            })
        }
    });
};

exports.get = function(req, res) {
    User.findOne({id: req.id}, function(err, user) {
        if (err) {
            console.error('Error occurred while getting user: ', err);
            res.json({
                success: false,
                data: user
            })
        } else {
            res.json({
                success: true,
                data: user
            })
        }
    });
};

exports.delete = function(req, res) {
    User.findOneAndRemove({id: req.id}, function(err) {
        if (err) {
            console.error('Error occurred while deleting user: ', err);
            res.json({
                success: false,
                data: 'Error occurred while deleting user'
            });
        } else {
            res.json({
                success: true,
                data: 'User deleted successfully'
            });
        }
    });
};

exports.update = function(req, res) {
    User.findOne({id: req.id}, function(err, user) {
        if (err) {
            console.error('Error occurred while getting user for update: ', err);
            res.json({
                success: false,
                data: 'Error occurred while getting user for update'
            });
        } else {
            if (!user) {
                res.json({
                    success: false,
                    data: 'User not found'
                });
            } else {
                user.name = req.body.name;
                user.email = req.body.email;
                user.password = req.body.password;

                user.save(function(err) {
                    if (err) {
                        console.error('Error occurred while updating user: ', err);
                        res.json({
                            success: false,
                            data: 'Error occurred while updating user'
                        });
                    } else {
                        res.json({
                            success: true,
                            data: 'User successfully updated'
                        });
                    }
                });
            }
        }
    })
};