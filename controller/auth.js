var mongoose = require('mongoose'),
    User = mongoose.model('User');
    jwt = require('jsonwebtoken');

exports.login = function(req, res) {
    User.findOne({email: req.body.email, password: req.body.password}, function(err, user) {
        if (err) {
            console.error('Error occurred while getting user: ', err);
            res.status(500).json({
                success: false,
                data: 'Error occurred while getting user'
            });
        } else {
            if (user) {
                var userWillBeSigned = delete user.password;
                res.json({
                    success: true,
                    data: jwt.sign(userWillBeSigned, process.env.JWT_SECRET)
                })
            } else {
                res.json({
                    success: false,
                    data: 'Invalid credentials'
                })
            }
        }
    })
};

exports.register = function(req, res) {
    var userModel = new User(req.body);
    userModel.save(function(err, user) {
        console.log('asdas');
        if (err) {
            console.error('Error occurred while registering user: ', err);
            res.json({
                success: false,
                data: 'Error occurred while registering user'
            })
        } else {
            res.json({
                success: true,
                data: user
            });
        }
    });
};