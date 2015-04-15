describe('user endpoint', function() {

    describe('GET /api/user/:id', function() {

        var ret = null;

        it('should retrieve the user', function() {
            this.timeout(5000);
            return r
                .get('/api/user/' + U.user._id).should.be.fulfilled
                .then(function(body) {
                    ret = body;
                });
        });

        it('should only show public properties', function() {
            expect(ret).to.have.keys(['_id', 'worker', 'firstName', 'lastName', 'phone', 'birthdate', 'gender', 'finished', 'new', 'roles', 'employer', 'updated', 'created'])
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
        var data = {
                _id: "abcdefgasdf",
                firstName: "New",
            },
            badData = {
                firstName: "",
                lastName: ""
            },
            ret = null;

        it('should return 401 if you are not logged in', function() {
            return r
                .post('/api/user/' + U.user._id, data).should.be.rejected
                .then(r.hasStatus(401));
        });


        it('should return 403 if you are not the user', function() {
            r.login(U.worker);
            return r
                .post('/api/user/' + U.user._id, data).should.be.rejected
                .then(r.hasStatus(403))
                .then(r.logout);
        });

        it('should return 404 with an unknown id', function() {
            return r
                .post('/api/user/' + 'asfdsafsaasdf', data).should.be.rejected
                .then(r.hasStatus(404));
        });

        it('should return 400 for invalid input', function() {
            r.login(U.user);
            return r
                .post('/api/user/' + U.user._id, badData).should.be.rejected
                .then(r.hasStatus(400))
                .then(r.logout);
        });

        it('should update the user', function() {
            r.login(U.user);
            return r
                .post('/api/user/' + U.user._id, data).should.be.fulfilled
                .then(function(body) {
                    ret = body;
                    r.logout();
                });
        });

        it('should only update editable properties', function() {
            expect(ret._id).to.equal(U.user._id);
            expect(ret.firstName).to.equal(data.firstName);
        });

    });

    describe('DELETE /api/user/:id', function() {

        var newUser;

        before(function() {
            newUser = require('../fixtures/users').user;
            newUser._id = 'throwaway';
            newUser.auth.local.email = 'throwaway@example.com';
            return db.User.create(newUser)
        });

        it('should return 401 if you are not logged in', function() {
            return r
                .del('/api/user/' + newUser._id).should.be.rejected
                .then(r.hasStatus(401));
        });

        it('should return 403 if you are not the user', function() {
            r.login(U.worker);
            return r
                .del('/api/user/' + newUser._id).should.be.rejected
                .then(r.hasStatus(403))
                .then(r.logout);
        });

        it('should return 404 with an unknown id', function() {
            return r
                .del('/api/user/' + 'asfdsafsaasdf').should.be.rejected
                .then(r.hasStatus(404));
        });

        it('should delete the user', function() {
            r.login(newUser);
            return r
                .del('/api/user/' + newUser._id).should.be.fulfilled
                .then(r.logout);
        });

    });

    describe.skip('GET /api/user', function() {

        it('should return a list of users', function() {
            return r
                .get('/api/user').should.be.fulfilled
                .then(function(body) {

                });
        });
    });


    describe('METHOD /api/user/me', function() {

        it('should act on the logged in user', function() {
            var id = U.user._id;
            return db.User.findById(id).exec()
                .then(function(user) {
                    r.login(user);
                })
                .then(function() {
                    return r.get('/api/user/me').should.be.fulfilled;
                })
                .then(function(u) {
                    r.logout();
                    expect(u._id).to.equal(id);
                });
        });

        it('should return 401 if not logged in', function() {
            return r
                .get('/api/user/me').should.be.rejected
                .then(r.hasStatus(401));
        });

    });

});
