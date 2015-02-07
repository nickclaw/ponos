var path = require('path'),
    serve = require('serve-static'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    cookieSession = require('cookie-session'),
    router = require('../routes/'),
    app = require('../../app/index');

module.exports = function(app, passport) {

    // add static routes
    app.use('/lib', serve(path.join(__dirname, '../public/lib')));
    app.use('/static', serve(path.join(__dirname, '../public/src/')));

    app.use(bodyParser.json());
    app.use(cookieParser());
    app.use(cookieSession({
        key: C.SERVER.COOKIE.key,
        secret: C.SERVER.COOKIE.SECRET,
        cookie: { maxAge: C.SERVER.COOKIE.MAXAGE }
    }));

    // add dynamic routes
    app.use(router);
    app.use(app);

    // listen for unmatched routes
    app.use(function(req, res) {
        Log.warn('Unmatched route: %s', req.url);
        res.sendStatus(404);
    });

    // listen for uncaught router errors
    app.use(function(err, req, res, next) {
        Log.error(err.stack);
        res.sendStatus(500);
    });
}
