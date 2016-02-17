var express = require('express')
    , fs = require('fs');
module.exports = function () {

    var controllers = {}
        , controllers_path = process.cwd() + '/controller';
    fs.readdirSync(controllers_path).forEach(function (file) {
        if (file.indexOf('.js') != -1) {
            controllers[file.split('.')[0]] = require(controllers_path + '/' + file)
        }
    });

    var router = express.Router();

    // User
    router.route("/users")
        .post(controllers.user.save)
        .get(controllers.user.list);

    router.route('/users/:id')
        .get(controllers.user.get)
        .put(controllers.user.update)
        .delete(controllers.user.delete);

    // Auth
    router.route('/login')
        .post(controllers.auth.login);

    router.route('/register')
        .post(controllers.auth.register);

    return router;
};