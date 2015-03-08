var users = require('../fixtures/users'),
    stub = require('passport-stub');

describe('user endpoint', function() {

    // fixtures
    beforeEach(function() {
        this.timeout(5000);
        return db.User.create(users);
    });

    afterEach(function() {
        return db.User.remove({}).exec();
    });

    describe('GET /api/user/:id', function() {

        var user = users[0];

        it('should retrieve the user', function() {
            return r
                .get('/api/user/' + user._id).should.be.fulfilled
                .then(function(body) {
                    expect(body.auth.local.password).to.not.equal(user.auth.local.password);
                    body.auth.local.password = user.auth.local.password;
                    expect(body).to.shallowDeepEqual(user);
                });
        });

        it('should return 404 with an unknown id', function() {
            return r
                .get('/api/user/' + 'asfdsafsaasdf').should.be.rejected
                .then(r.hasStatus(404));
        });
    });

    describe('POST /api/user/:id', function() {
        var user = users[0];
        var data = {};


        it('should return 403 if you are not the user', function() {
            return r
                .post('/api/user/' + user._id, data).should.be.rejected
                .then(r.hasStatus(403));
        });

        it('should return 404 with an unknown id', function() {
            return r
                .post('/api/user/' + 'asfdsafsaasdf', data).should.be.rejected
                .then(r.hasStatus(404));
        });

        it('should update the user', function() {
            stub.login(user);
            return r
                .post('/api/user/' + user._id, data).should.be.fulfilled
                .then(function(body) {
                    stub.logout();
                });
        });

    });

    describe('DELETE /api/user/:id', function() {

        var user = users[0];

        it('should return 403 if you are not the user', function() {
            return r
                .del('/api/user/' + user._id).should.be.rejected
                .then(r.hasStatus(403));
        });

        it('should return 404 with an unknown id', function() {
            return r
                .del('/api/user/' + 'asfdsafsaasdf').should.be.rejected
                .then(r.hasStatus(404));
        });

        it('should delete the user', function() {
            stub.login(user);
            return r
                .del('/api/user/' + user._id).should.be.fulfilled
                .then(function(body) {
                    stub.logout();
                });
        });

    });

    describe('GET /api/user', function() {

        it('should return a list of users', function() {
            return r
                .get('/api/user').should.be.fulfilled
                .then(function(body) {

                });
        });
    });

});
