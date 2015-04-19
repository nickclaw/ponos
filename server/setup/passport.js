var User = db.User,
    GoogleAuth = require('passport-google-oauth').OAuth2Strategy,
    FacebookAuth = require('passport-facebook').Strategy,
    LocalAuth = require('passport-local').Strategy,
    LinkedAuth = require('passport-linkedin-oauth2').Strategy;

module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        Log.verbose("Serializing user: %s", user.id);
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            if (err) {
                Log.warn('Error unserializing user: %s', id);
                return done(err, null);
            }

            if (!user) {
                Log.verbose('Could not unserialize user: %s', id);
                return done(null, null);
            }

            Log.verbose('Unserialized user: %s', id);
            return done(null, user);
        });
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
        User.findOne({'auth.google_id': profile.id}, done);
    }));

    passport.use('google-signup', new GoogleAuth({
        clientID: C.AUTH.GOOGLE.ID,
        clientSecret: C.AUTH.GOOGLE.SECRET,
        callbackURL: C.SERVER.HOST + ":" + C.SERVER.PORT + "/auth/google/signup/callback",
        scope: 'profile'
    }, function(accessToken, refreshToken, profile, done) {
        var user = new User({
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            birthdate: null,
            gender: null,
            picture: profile._json.picture,
            role: null,
            worker: {},
            employer: {},

            auth: {
                google_id: profile.id
            },

            new: true,
            finished: false
        });

        user.save(done);
    }));

    //
    // Facebook auth
    //
    passport.use('facebook-login', new FacebookAuth({
        clientID: C.AUTH.FACEBOOK.ID,
        clientSecret: C.AUTH.FACEBOOK.SECRET,
        callbackURL: C.SERVER.HOST + ":" + C.SERVER.PORT + "/auth/facebook/login/callback",
        enableProof: true
    }, function(accessToken, refreshToken, profile, done) {
        User.findOne({ 'auth.facebook_id': profile.id }, done);
    }));

    passport.use('facebook-signup', new FacebookAuth({
        clientID: C.AUTH.FACEBOOK.ID,
        clientSecret: C.AUTH.FACEBOOK.SECRET,
        callbackURL: C.SERVER.HOST + ":" + C.SERVER.PORT + "/auth/facebook/signup/callback",
        enableProof: true,
        profileFields: ['id', 'displayName', 'picture.type(large)', 'profileUrl']
    }, function(accessToken, refreshToken, profile, done) {
        var user = new User({
            new: true,
            role: null,
            firstName: "",
            lastName: "",
            phone: "",
            birthdate: null,
            gender: null,
            picture: !profile._json.picture.data.is_silhouette ? profile._json.picture.data.url : undefined,

            auth: {
                facebook_id: profile.id
            }
        });

        user.save(done);
    }));


    //
    // Linkin auth
    //
    passport.use('linkedin-login', new LinkedAuth({
        clientID: C.AUTH.LINKEDIN.ID,
        clientSecret: C.AUTH.LINKEDIN.SECRET,
        callbackUrl: C.SERVER.HOST + ":" + C.SERVER.PORT + "/auth/linkedin/login/callback",
        scope: ['r_emailaddress', 'r_basicprofile']
    }, function() {

    }));

    passport.use('linkedin-signup', new LinkedAuth({
        clientID: C.AUTH.LINKEDIN.ID,
        clientSecret: C.AUTH.LINKEDIN.SECRET,
        callbackUrl: C.SERVER.HOST + ":" + C.SERVER.PORT + "/auth/linkedin/signup/callback",
        scope: ['r_emailaddress', 'r_basicprofile']
    }, function() {

    }));


    //
    // Local auth
    //
    passport.use('local-login', new LocalAuth({
        usernameField: 'email'
    }, function(email, password, done) {
        User.findOne({'auth.local.email': email}, function(err, user) {
            if (err || !user) return done(err, user);
            if (!user.checkPassword(password)) return done(new Error());
            done(null, user);
        });
    }));

    passport.use('local-signup', new LocalAuth({
        usernameField: 'email',
        passReqToCallback: true,
    }, function(req, email, password, done) {
        var user = new User({
            firstName: "",
            lastName: "",
            phone: "",
            role: null,
            auth: {
                local: {
                    email: email,
                    password: password
                }
            }
        });

        user.save(done);
    }));
}
