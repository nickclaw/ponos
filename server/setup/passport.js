

module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        done();
    });

    passport.deserializeUser(function(id, done) {
        done();
    });

}
