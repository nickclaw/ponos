var User = {}, //require('../database/').User,
    GoogleAuth = require('passport-google-oauth').OAuth2Strategy,
    LocalAuth = require('passport-local').Strategy;

module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.find(id).nodeify(done);
    });

    //
    // Google auth
    //
    passport.use('google-login', new GoogleAuth({
        clientID: C.AUTH.GOOGLE.ID,
        clientSecret: C.AUTH.GOOGLE.SECRET,
        callbackURL: C.SERVER.HOST + ":" + C.SERVER.PORT + "/auth/google/login/callback",
        scope: 'profile'
    }, function(accessToken, refreshToken, profile, done) {
        User.findOne({
            authType: "google",
            authUser: profile.id
        }).nodeify(done);
    }));

    passport.use('google-signup', new GoogleAuth({
        clientID: C.AUTH.GOOGLE.ID,
        clientSecret: C.AUTH.GOOGLE.SECRET,
        callbackURL: C.SERVER.HOST + ":" + C.SERVER.PORT + "/auth/google/signup/callback",
        scope: 'profile'
    }, function(accessToken, refreshToken, profile, done) {
        User.create({
            authType: "google",
            authUser: profile.id,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName
        }).nodeify(done);
    }));


    //
    // Local auth
    //
    passport.use('local-login', new LocalAuth({
        usernameField: 'email'
    }, function(email, password, done) {
        User.findOne({
            authType: "local",
            authUser: email
        }).then(function(user) {
            if (user.password !== password) throw new Error();
            return user;
        }).nodeify(done);
    }));

    passport.use('local-signup', new LocalAuth({
        usernameField: 'email'
    }, function(email, password, done) {
        User.create({
            authType: "local",
            authUser: email,
            authPass: password
        }).nodeify(done);
    }));

    function resolve(promise, callback) {
        Promise.resolve(promise).nodeify(callback);
    }
}
