var express = require('express'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    jwt = require('express-jwt'),
    morgan = require('morgan'),
    unless = require('express-unless');

module.exports = function(app) {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(methodOverride());
    app.use(morgan('combined'));
    app.use(function (req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type, Authorization');
        next();
    });

    app.use('/api', require(process.cwd() + '/core/router.js')());
    app.all("*", function (req, res) {
        res.status(404).json({
            success: false,
            data: 'Not Found'
        })
    });
};