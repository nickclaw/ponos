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

        var user = users[0],
            ret = null;

        it('should retrieve the user', function() {
            return r
                .get('/api/user/' + user._id).should.be.fulfilled
                .then(function(body) {
                    ret = body;
                });
        });

        it('should only show public properties', function() {
            expect(ret).to.have.keys(['_id', 'worker', 'firstName', 'lastName', 'phone', 'finished', 'new', 'roles', 'employer'])
            expect(ret.worker.reviews).to.be.undefined;
            expect(ret.employer.reviews).to.be.undefined;
        });

        it('should return 404 with an unknown id', function() {
            return r
                .get('/api/user/' + 'asfdsafsaasdf').should.be.rejected
                .then(r.hasStatus(404));
        });
    });

    describe('POST /api/user/:id', function() {
        var user = users[0],
            data = {
                _id: "abcdefgasdf",
                firstName: "New",
                lastName: "Name",
                new: true,
                false: true,
                finished: true
            },
            badData = {
                firstName: "",
                lastName: ""
            },
            ret = null;


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

        it('should return 401 for invalid input', function() {
            stub.login(user);
            return r
                .post('/api/user/' + user._id, badData).should.be.rejected
                .then(r.hasStatus(401))
                .then(function() {
                    stub.logout();
                });
        });

        it('should update the user', function() {
            stub.login(user);
            return r
                .post('/api/user/' + user._id, data).should.be.fulfilled
                .then(function(body) {
                    stub.logout();
                    ret = body;
                });
        });

        it('should only update editable properties', function() {
            expect(ret._id).to.equal(user._id);
            expect(ret.firstName).to.equal(data.firstName);
            expect(ret.lastName).to.equal(data.lastName);
            expect(ret.new).to.equal(data.new);
            expect(ret.false).to.be.undefined;
            expect(ret.finished).to.equal(user.finished);
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

    describe('METHOD /api/user/me', function() {

        var id = users[0]._id;

        it('should act on the logged in user', function() {
            return db.User.findById(id).exec()
                .then(function(user) {
                    stub.login(user);
                })
                .then(function() {
                    return r.get('/api/user/me').should.be.fulfilled;
                })
                .then(function(u) {
                    stub.logout();
                    expect(u._id).to.equal(id);
                });
        });

        it('should return 403 if not logged in', function() {
            return r
                .get('/api/user/me').should.be.rejected
                .then(r.hasStatus(403));
        });

    });

});
